// ============================================================================
// 就地编辑系统（#admin）
// 页面本身即编辑器：文字点击直接改（富文本有浮动工具条），卡片悬停出现
// 排序/配图/删除工具条，图片·PDF·展示样式走右侧抽屉，底部悬浮条负责
// 预览/重置/发布。公开页不挂 EditCtx 时，这里的组件全部退化为纯展示。
// ============================================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ClipboardEvent,
  type Dispatch,
  type ElementType,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type SetStateAction,
} from 'react';
import {
  AlertCircle,
  Bold,
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Eraser,
  Eye,
  FileText,
  FileUp,
  Image as ImageIcon,
  KeyRound,
  Palette,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import {
  defaultContent,
  localeLabels,
  type Locale,
  type LocalizedText,
  type ProfileLink,
  type ResearchItem,
  type ResumeBlock,
  type SiteContent,
  type TimelineProject,
} from './data/siteContent';
import { assetUrl, makeLocalizedText, publishToGitHub, uploadImageToGitHub } from './utils/editorUtils';
import { pdfFirstPageToImage } from './utils/pdfCover';

export const contentStorageKey = 'zxeqzzg-portfolio-content-draft';
export const githubTokenKey = 'zxeqzzg-github-token';

// ---------------------------------------------------------------------------
// 编辑上下文
// ---------------------------------------------------------------------------
export type DrawerState =
  | { type: 'publish' }
  | { type: 'avatar' }
  | { type: 'resume' }
  | { type: 'link'; index: number }
  | { type: 'timeline-media'; id: string }
  | { type: 'gallery-cover'; id: string }
  | { type: 'research-media'; id: string };

export type EditApi = {
  locale: Locale;
  /** 重置草稿时 +1，用于强制重挂所有 contentEditable，刷新其初始文本 */
  session: number;
  set: (up: (c: SiteContent) => SiteContent) => void;
  openDrawer: (d: DrawerState) => void;
  uploadFile: (file: File) => Promise<string | null>;
  toast: (msg: string) => void;
};

const EditCtx = createContext<EditApi | null>(null);
export const useEdit = () => useContext(EditCtx);

// ---------------------------------------------------------------------------
// 小工具
// ---------------------------------------------------------------------------
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const setLT = (lt: LocalizedText, locale: Locale, v: string): LocalizedText => ({ ...lt, [locale]: v });

export const updIn = <T extends { id: string }>(arr: T[], id: string, patch: Partial<T>): T[] =>
  arr.map((x) => (x.id === id ? { ...x, ...patch } : x));

export const moveIn = <T,>(arr: T[], index: number, dir: -1 | 1): T[] => {
  const j = index + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[j]] = [next[j], next[index]];
  return next;
};

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 富文本渲染：内容字段支持 <b>/<span style=...> 等，渲染前做轻量消毒（去 script/on*/javascript:）
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function RichText({ text, className, as = 'p' }: { text: string; className?: string; as?: ElementType }) {
  const Tag = as as 'p';
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
}

// ---------------------------------------------------------------------------
// contentEditable 基元
// 关键约定：初始 HTML 只在挂载时写入一次（dangerouslySetInnerHTML 传恒定值），
// 输入过程中父组件随便重渲染都不会碰 DOM，光标不丢；外部改值（切语言/重置）
// 一律靠调用方换 key 重挂。
// ---------------------------------------------------------------------------
const richRegistry = new WeakMap<HTMLElement, (html: string) => void>();

export function EditableText({
  value,
  onChange,
  as = 'span',
  className,
  placeholder = '点击输入',
  onEnter,
  onBlurText,
}: {
  value: string;
  onChange: (v: string) => void;
  as?: ElementType;
  className?: string;
  placeholder?: string;
  onEnter?: () => void;
  onBlurText?: (text: string) => void;
}) {
  const initial = useRef(escapeHtml(value));
  const Tag = as as 'span';
  return (
    <Tag
      className={cx('editable', className)}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-ph={placeholder}
      onInput={(e: FormEvent<HTMLElement>) => onChange(e.currentTarget.textContent ?? '')}
      onKeyDown={(e: ReactKeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (onEnter) onEnter();
          else (e.currentTarget as HTMLElement).blur();
        } else if (e.key === 'Escape') {
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onPaste={(e: ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
      }}
      onBlur={(e) => onBlurText?.((e.currentTarget as HTMLElement).textContent ?? '')}
      dangerouslySetInnerHTML={{ __html: initial.current }}
    />
  );
}

export function EditableRich({
  value,
  onChange,
  as = 'div',
  className,
  placeholder = '点击输入',
}: {
  value: string;
  onChange: (v: string) => void;
  as?: ElementType;
  className?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    const el = ref.current;
    if (el) richRegistry.set(el, (html) => cb.current(html));
  }, []);
  const initial = useRef(sanitizeHtml(value));
  const Tag = as as 'div';
  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        ref.current = el;
      }}
      className={cx('editable richEditable', className)}
      data-rich="1"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-ph={placeholder}
      onInput={(e: FormEvent<HTMLElement>) => onChange(e.currentTarget.innerHTML)}
      onPaste={(e: ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
      }}
      dangerouslySetInnerHTML={{ __html: initial.current }}
    />
  );
}

// ---------------------------------------------------------------------------
// 展示 / 编辑双态文本组件：公开页纯展示，编辑态变 contentEditable
// ---------------------------------------------------------------------------
/** 非本地化纯文本（如时间段、站点标题、标签类型） */
export function S({
  value,
  onChange,
  as = 'span',
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  as?: ElementType;
  className?: string;
  placeholder?: string;
}) {
  const edit = useEdit();
  const Tag = as as 'span';
  if (!edit) return <Tag className={className}>{value}</Tag>;
  return (
    <EditableText key={edit.session} value={value} onChange={onChange} as={as} className={className} placeholder={placeholder} />
  );
}

/** 非本地化富文本（如姓名，可加粗/上色） */
export function SR({
  value,
  onChange,
  as = 'div',
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  as?: ElementType;
  className?: string;
  placeholder?: string;
}) {
  const edit = useEdit();
  if (!edit) return <RichText text={value} as={as} className={className} />;
  return (
    <EditableRich key={edit.session} value={value} onChange={onChange} as={as} className={className} placeholder={placeholder} />
  );
}

/** 本地化文本；rich=true 时支持富文本与浮动工具条 */
export function LT({
  value,
  locale,
  onChange,
  rich = false,
  as = 'p',
  className,
  placeholder,
}: {
  value: LocalizedText;
  locale: Locale;
  onChange: (v: string) => void;
  rich?: boolean;
  as?: ElementType;
  className?: string;
  placeholder?: string;
}) {
  const edit = useEdit();
  const Tag = as as 'p';
  if (!edit) {
    if (rich) return <RichText text={value[locale]} as={as} className={className} />;
    return <Tag className={className}>{value[locale]}</Tag>;
  }
  const key = `${edit.session}:${locale}`;
  return rich ? (
    <EditableRich key={key} value={value[locale]} onChange={onChange} as={as} className={className} placeholder={placeholder} />
  ) : (
    <EditableText key={key} value={value[locale]} onChange={onChange} as={as} className={className} placeholder={placeholder} />
  );
}

// ---------------------------------------------------------------------------
// 标签云（chips）与可编辑列表
// ---------------------------------------------------------------------------
export function Chips({
  items,
  onChange,
  className = 'tagCloud',
}: {
  items: string[];
  onChange?: (items: string[]) => void;
  className?: string;
}) {
  const edit = useEdit();
  // 结构变化（增删）时 +1 强制重挂各 chip，避免 index-key 下文本错位
  const [ver, bump] = useReducer((x: number) => x + 1, 0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    const chips = wrapRef.current?.querySelectorAll<HTMLElement>('.chip .editable');
    const last = chips?.[chips.length - 1];
    if (!last) return;
    last.focus();
    const range = document.createRange();
    range.selectNodeContents(last);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  });

  if (!edit || !onChange) {
    return (
      <div className={className}>
        {items.map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </div>
    );
  }

  const add = () => {
    pendingFocus.current = true;
    bump();
    onChange([...items, '']);
  };
  const removeAt = (i: number) => {
    bump();
    onChange(items.filter((_, x) => x !== i));
  };

  return (
    <div className={cx(className, 'chipsEdit')} ref={wrapRef}>
      {items.map((item, i) => (
        <span className="chip" key={`${edit.session}:${ver}:${i}`}>
          <EditableText
            value={item}
            placeholder="标签"
            onChange={(v) => onChange(items.map((x, xi) => (xi === i ? v : x)))}
            onEnter={add}
            onBlurText={(t) => {
              if (!t.trim()) removeAt(i);
            }}
          />
          <button type="button" className="chipX" title="删除" onMouseDown={(e) => e.preventDefault()} onClick={() => removeAt(i)}>
            <X size={11} />
          </button>
        </span>
      ))}
      <button type="button" className="chipAdd" title="添加标签" onClick={add}>
        <Plus size={12} />
      </button>
    </div>
  );
}

/** LocalizedText 列表：项目细节（ul/li）、画廊说明（div/p）共用 */
export function LTList({
  items,
  locale,
  onChange,
  as = 'ul',
  className,
  itemClassName,
  addLabel = '添加一条',
  max,
}: {
  items: LocalizedText[];
  locale: Locale;
  onChange?: (v: LocalizedText[]) => void;
  as?: 'ul' | 'div';
  className?: string;
  itemClassName?: string;
  addLabel?: string;
  max?: number;
}) {
  const edit = useEdit();
  const [ver, bump] = useReducer((x: number) => x + 1, 0);

  if (!edit || !onChange) {
    const shown = items.filter((it) => it[locale].trim() !== '').slice(0, max ?? items.length);
    if (shown.length === 0) return null;
    if (as === 'ul') {
      return (
        <ul className={className}>
          {shown.map((it, i) => (
            <li key={i} className={itemClassName}>
              {it[locale]}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div className={className}>
        {shown.map((it, i) => (
          <p key={i} className={itemClassName}>
            {it[locale]}
          </p>
        ))}
      </div>
    );
  }

  const Wrap = as;
  const Row = as === 'ul' ? 'li' : 'p';
  const add = () => {
    bump();
    onChange([...items, makeLocalizedText()]);
  };
  return (
    <div className="ltListEdit">
      <Wrap className={className}>
        {items.map((it, i) => (
          <Row key={`${edit.session}:${locale}:${ver}:${i}`} className={cx(itemClassName, 'ltRow')}>
            <EditableText
              as="span"
              value={it[locale]}
              placeholder="输入内容"
              onChange={(v) => onChange(items.map((x, xi) => (xi === i ? setLT(x, locale, v) : x)))}
              onEnter={add}
            />
            <button
              type="button"
              className="chipX"
              title="删除该条"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                bump();
                onChange(items.filter((_, x) => x !== i));
              }}
            >
              <X size={12} />
            </button>
          </Row>
        ))}
      </Wrap>
      <button type="button" className="listAdd" onClick={add}>
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 卡片悬停工具条 / 添加占位
// ---------------------------------------------------------------------------
export function ItemToolbar({
  index,
  total,
  onMove,
  onDelete,
  deleteLabel = '该条目',
  buttons,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  deleteLabel?: string;
  buttons?: Array<{ icon: ReactNode; title: string; onClick: () => void }>;
}) {
  return (
    <div className="itemToolbar" onClick={(e) => e.stopPropagation()}>
      <button type="button" disabled={index === 0} onClick={() => onMove(-1)} title="上移">
        <ChevronUp size={14} />
      </button>
      <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} title="下移">
        <ChevronDown size={14} />
      </button>
      {buttons?.map((b, i) => (
        <button type="button" key={i} onClick={b.onClick} title={b.title}>
          {b.icon}
        </button>
      ))}
      <button
        type="button"
        className="tbDanger"
        title="删除"
        onClick={() => {
          if (window.confirm(`确定删除${deleteLabel}？`)) onDelete();
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function AddGhost({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button type="button" className={cx('addGhost', className)} onClick={onClick}>
      <Plus size={15} /> {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 文件选择与上传
// ---------------------------------------------------------------------------
function FilePick({
  onFile,
  label,
  accept = 'image/*',
  busy = false,
  icon,
}: {
  onFile: (f: File) => void;
  label: string;
  accept?: string;
  busy?: boolean;
  icon?: ReactNode;
}) {
  return (
    <label className={cx('fileButton', busy && 'busy')}>
      {busy ? <RefreshCw size={14} className="spin" /> : icon ?? <Upload size={14} />}
      <span>{busy ? '处理中…' : label}</span>
      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) onFile(f);
        }}
      />
    </label>
  );
}

export function UploadButton({
  onUploaded,
  label = '上传图片',
  accept = 'image/*',
  api,
  icon,
}: {
  onUploaded: (path: string) => void;
  label?: string;
  accept?: string;
  api?: EditApi;
  icon?: ReactNode;
}) {
  const ctx = useEdit();
  const edit = api ?? ctx;
  const [busy, setBusy] = useState(false);
  if (!edit) return null;
  return (
    <FilePick
      busy={busy}
      label={label}
      accept={accept}
      icon={icon}
      onFile={async (f) => {
        setBusy(true);
        const path = await edit.uploadFile(f);
        setBusy(false);
        if (path) onUploaded(path);
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// 研究条目配图（展示组件，公开页与编辑抽屉共用）
// ---------------------------------------------------------------------------
export function ResearchMediaView({ item, onClick }: { item: ResearchItem; onClick?: () => void }) {
  const mode = item.imageMode === 'cover' || item.imageMode === 'contain' ? item.imageMode : 'auto';
  const height = Math.round(Number(item.imageHeight)) || 190;
  if (!item.image && !item.pdf) return null;
  return (
    <div
      className={cx('researchMedia', `mode-${mode}`, onClick && 'clickable')}
      style={mode === 'auto' ? undefined : { height }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {item.image ? (
        <img src={assetUrl(item.image)} alt="" loading="lazy" />
      ) : (
        <div className="pdfPlaceholder">
          <FileText size={22} />
          <span>PDF 附件</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 抽屉表单原子
// ---------------------------------------------------------------------------
function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="editorField">
      <span className="fieldLabel">{label}</span>
      <input className="fieldInput" type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ImageListEditor({
  items,
  onChange,
  api,
  label,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  api: EditApi;
  label?: string;
}) {
  return (
    <div className="editorField">
      {label && <span className="fieldLabel">{label}</span>}
      <div className="imgList">
        {items.map((p, i) => (
          <div className="imgListRow" key={i}>
            {p ? (
              <img className="uploadPreview" src={assetUrl(p)} alt="" />
            ) : (
              <div className="uploadPreview placeholder">
                <ImageIcon size={16} />
              </div>
            )}
            <input
              className="fieldInput"
              value={p}
              placeholder="/assets/文件名"
              onChange={(e) => onChange(items.map((x, xi) => (xi === i ? e.target.value : x)))}
            />
            <button type="button" className="iconMiniButton" disabled={i === 0} onClick={() => onChange(moveIn(items, i, -1))} title="上移">
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              className="iconMiniButton"
              disabled={i === items.length - 1}
              onClick={() => onChange(moveIn(items, i, 1))}
              title="下移"
            >
              <ChevronDown size={14} />
            </button>
            <button type="button" className="iconDangerButton" onClick={() => onChange(items.filter((_, xi) => xi !== i))} title="删除">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="uploadRow">
        <UploadButton api={api} label="上传图片" onUploaded={(p) => onChange([...items, p])} />
        <button type="button" className="compactButton" onClick={() => onChange([...items, ''])}>
          <Plus size={14} /> 添加路径
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 抽屉面板
// ---------------------------------------------------------------------------
type PanelProps = { content: SiteContent; api: EditApi };

function AvatarPanel({ content, api }: PanelProps) {
  const avatar = content.profile.avatar;
  const patch = (v: string) => api.set((c) => ({ ...c, profile: { ...c.profile, avatar: v } }));
  return (
    <>
      <div className="uploadRow">
        {avatar ? (
          <img className="uploadPreview large" src={assetUrl(avatar)} alt="" />
        ) : (
          <div className="uploadPreview large placeholder">
            <User size={22} />
          </div>
        )}
        <UploadButton api={api} label="上传照片" onUploaded={patch} />
        {avatar && (
          <button type="button" className="compactButton" onClick={() => patch('')}>
            <X size={14} /> 清除
          </button>
        )}
      </div>
      <Field label="或手动填路径" value={avatar} onChange={patch} placeholder="/assets/文件名" />
      <p className="fieldHint">建议 4:5 竖版照片，头像框按 4:5 显示。</p>
    </>
  );
}

function ResumePanel({ content, api }: PanelProps) {
  const resume: ResumeBlock = content.profile.resume;
  const patch = (p: Partial<ResumeBlock>) =>
    api.set((c) => ({ ...c, profile: { ...c.profile, resume: { ...c.profile.resume, ...p } } }));
  return (
    <>
      <ImageListEditor label="简历图片（访客点「查看简历」弹窗翻页）" items={resume.images} onChange={(images) => patch({ images })} api={api} />
      <div className="editorField">
        <span className="fieldLabel">PDF 文件（访客可下载）</span>
        <div className="uploadRow">
          {resume.pdf ? (
            <a className="resumePdfChip" href={assetUrl(resume.pdf)} target="_blank" rel="noreferrer">
              <FileText size={14} /> 当前 PDF
            </a>
          ) : (
            <span className="fieldHint">尚未上传</span>
          )}
          <UploadButton api={api} label="上传 PDF" accept=".pdf,application/pdf" onUploaded={(p) => patch({ pdf: p })} />
          {resume.pdf && (
            <button type="button" className="compactButton" onClick={() => patch({ pdf: '' })}>
              <X size={14} /> 清除
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function LinkPanel({ index, content, api, onClose }: PanelProps & { index: number; onClose: () => void }) {
  const link: ProfileLink | undefined = content.profile.links[index];
  if (!link) return <p className="fieldHint">该联系方式已删除。</p>;
  const patch = (p: Partial<ProfileLink>) =>
    api.set((c) => ({
      ...c,
      profile: { ...c.profile, links: c.profile.links.map((l, i) => (i === index ? { ...l, ...p } : l)) },
    }));
  return (
    <>
      <Field label="标签（按名字自动配图标：Email / GitHub / 电话 / 微信…）" value={link.label} onChange={(v) => patch({ label: v })} />
      <Field label="显示文本" value={link.value} onChange={(v) => patch({ value: v })} />
      <Field
        label="链接（邮箱自动加 mailto:；电话/微信可留空 = 不可点击）"
        value={link.href}
        onChange={(v) => patch({ href: v })}
        placeholder="https://…"
      />
      <button
        type="button"
        className="dangerButton"
        onClick={() => {
          if (!window.confirm('删除该联系方式？')) return;
          api.set((c) => ({ ...c, profile: { ...c.profile, links: c.profile.links.filter((_, i) => i !== index) } }));
          onClose();
        }}
      >
        <Trash2 size={14} /> 删除该联系方式
      </button>
    </>
  );
}

function TimelineMediaPanel({ project, api }: { project: TimelineProject; api: EditApi }) {
  return (
    <>
      <ImageListEditor
        label="项目图片（单图铺满、多图横向滑动；点击可全屏查看）"
        items={project.images}
        onChange={(images) => api.set((c) => ({ ...c, timelineProjects: updIn(c.timelineProjects, project.id, { images }) }))}
        api={api}
      />
      <p className="fieldHint">图片顺序即展示顺序，可用 ↑↓ 调整。</p>
    </>
  );
}

function GalleryCoverPanel({ id, content, api }: PanelProps & { id: string }) {
  const project = content.galleryProjects.find((p) => p.id === id);
  if (!project) return <p className="fieldHint">该项目已删除。</p>;
  const patch = (cover: string) => api.set((c) => ({ ...c, galleryProjects: updIn(c.galleryProjects, id, { cover }) }));
  return (
    <>
      <div className="drawerPreview">
        {project.cover ? <img className="coverPreview" src={assetUrl(project.cover)} alt="" /> : <p className="fieldHint">暂无封面</p>}
      </div>
      <div className="uploadRow">
        <UploadButton api={api} label="上传封面" onUploaded={patch} />
      </div>
      <Field label="封面路径" value={project.cover} onChange={patch} placeholder="/assets/文件名" />
    </>
  );
}

function ResearchMediaPanel({ id, content, api }: PanelProps & { id: string }) {
  const [busyPdf, setBusyPdf] = useState(false);
  const item = content.recentResearch.find((r) => r.id === id);
  if (!item) return <p className="fieldHint">该条目已删除。</p>;
  const patch = (p: Partial<ResearchItem>) => api.set((c) => ({ ...c, recentResearch: updIn(c.recentResearch, id, p) }));
  const mode = item.imageMode === 'cover' || item.imageMode === 'contain' ? item.imageMode : 'auto';
  const height = Math.round(Number(item.imageHeight)) || 190;

  const onPdf = async (file: File) => {
    setBusyPdf(true);
    let cover: File | null = null;
    try {
      cover = await pdfFirstPageToImage(file);
    } catch {
      // PDF 解析失败也继续上传原文件，封面可手动补
    }
    const pdfPath = await api.uploadFile(file);
    if (!pdfPath) {
      setBusyPdf(false);
      return;
    }
    let image = item.image ?? '';
    if (cover) {
      const coverPath = await api.uploadFile(cover);
      if (coverPath) image = coverPath;
    }
    patch({ pdf: pdfPath, image });
    api.toast(cover ? 'PDF 已上传，封面已自动取第一页' : 'PDF 已上传（封面生成失败，可手动上传图片）');
    setBusyPdf(false);
  };

  return (
    <>
      <div className="drawerPreview">
        <ResearchMediaView item={item} />
      </div>
      <div className="uploadRow">
        <UploadButton api={api} label="上传封面图" onUploaded={(p) => patch({ image: p })} />
        <FilePick label="上传 PDF · 封面取第一页" accept=".pdf,application/pdf" busy={busyPdf} icon={<FileUp size={14} />} onFile={onPdf} />
      </div>
      <Field label="封面图路径（也可手填；留空且无 PDF 则不显示图区）" value={item.image ?? ''} onChange={(v) => patch({ image: v })} />
      <div className="editorField">
        <span className="fieldLabel">PDF 附件（卡片上会出现 PDF 按钮）</span>
        <div className="uploadRow">
          {item.pdf ? (
            <a className="resumePdfChip" href={assetUrl(item.pdf)} target="_blank" rel="noreferrer">
              <FileText size={14} /> 打开当前 PDF
            </a>
          ) : (
            <span className="fieldHint">未上传（只放封面图也可以）</span>
          )}
          {item.pdf && (
            <button type="button" className="compactButton" onClick={() => patch({ pdf: '' })}>
              <X size={14} /> 清除 PDF
            </button>
          )}
        </div>
      </div>
      <div className="editorField">
        <span className="fieldLabel">封面展示方式</span>
        <div className="segmented drawerSeg">
          {(
            [
              ['auto', '自适应比例'],
              ['cover', '固定 · 裁剪'],
              ['contain', '固定 · 完整'],
            ] as const
          ).map(([m, label]) => (
            <button key={m} type="button" className={mode === m ? 'active' : ''} onClick={() => patch({ imageMode: m })}>
              {label}
            </button>
          ))}
        </div>
        <p className="fieldHint">自适应＝按图片真实比例完整展示（论文长页推荐）；固定＝统一框高，超出部分裁剪或留边。</p>
      </div>
      <div className="editorField">
        <span className="fieldLabel">
          框高 {height}px{mode === 'auto' ? '（自适应模式不生效）' : ''}
        </span>
        <input
          type="range"
          min={110}
          max={460}
          step={10}
          value={height}
          disabled={mode === 'auto'}
          onChange={(e) => patch({ imageHeight: Number(e.target.value) })}
        />
      </div>
      <Field label="外部链接 URL（标题可点击跳转，可空）" value={item.link} onChange={(v) => patch({ link: v })} placeholder="https://arxiv.org/…" />
    </>
  );
}

function PublishPanel({
  token,
  setToken,
  publishing,
  onPublish,
}: {
  token: string;
  setToken: (v: string) => void;
  publishing: boolean;
  onPublish: () => void;
}) {
  return (
    <>
      <div className="publishInfo">
        <AlertCircle size={16} />
        <p>
          「发布」把当前全部内容写回仓库 <code>siteContent.ts</code>，GitHub Actions 自动构建部署，约 1–2 分钟生效。图片 / PDF
          上传也使用这个 Token。
        </p>
      </div>
      <div className="editorField">
        <span className="fieldLabel">GitHub Personal Access Token</span>
        <input
          type="password"
          className="fieldInput"
          value={token}
          placeholder="github_pat_xxx / ghp_xxx"
          onChange={(e) => {
            setToken(e.target.value);
            window.localStorage.setItem(githubTokenKey, e.target.value);
          }}
        />
        <p className="fieldHint">
          推荐 fine-grained PAT：只授权本仓库，权限 Contents: Read and write。Token 仅保存在当前浏览器 localStorage。
        </p>
      </div>
      <div className="publishActions">
        <button type="button" className="primaryButton" onClick={onPublish} disabled={publishing}>
          {publishing ? <RefreshCw size={16} className="spin" /> : <Send size={16} />} {publishing ? '发布中…' : '发布到线上'}
        </button>
        <a className="ghostButton" href="https://github.com/ZXEQzzg/ZXEQzzg_Csy.github.io/actions" target="_blank" rel="noreferrer">
          <Eye size={16} /> 查看部署进度
        </a>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// 抽屉外壳
// ---------------------------------------------------------------------------
function DrawerShell({
  state,
  onClose,
  content,
  api,
  token,
  setToken,
  publishing,
  onPublish,
}: {
  state: DrawerState;
  onClose: () => void;
  content: SiteContent;
  api: EditApi;
  token: string;
  setToken: (v: string) => void;
  publishing: boolean;
  onPublish: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  let title = '';
  let body: ReactNode = null;
  switch (state.type) {
    case 'publish':
      title = '发布 · Token';
      body = <PublishPanel token={token} setToken={setToken} publishing={publishing} onPublish={onPublish} />;
      break;
    case 'avatar':
      title = '个人照片';
      body = <AvatarPanel content={content} api={api} />;
      break;
    case 'resume':
      title = '简历 · CV';
      body = <ResumePanel content={content} api={api} />;
      break;
    case 'link':
      title = '联系方式';
      body = <LinkPanel index={state.index} content={content} api={api} onClose={onClose} />;
      break;
    case 'timeline-media': {
      const project = content.timelineProjects.find((p) => p.id === state.id);
      title = '项目图片';
      body = project ? <TimelineMediaPanel project={project} api={api} /> : <p className="fieldHint">该项目已删除。</p>;
      break;
    }
    case 'gallery-cover':
      title = '封面图片';
      body = <GalleryCoverPanel id={state.id} content={content} api={api} />;
      break;
    case 'research-media':
      title = '配图 / PDF / 展示样式';
      body = <ResearchMediaPanel id={state.id} content={content} api={api} />;
      break;
  }

  return (
    <aside className="drawer" role="dialog" aria-label={title}>
      <header className="drawerHead">
        <h3>{title}</h3>
        <button type="button" className="iconMiniButton" onClick={onClose} title="关闭 (Esc)">
          <X size={15} />
        </button>
      </header>
      <div className="drawerBody">{body}</div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// 浮动富文本工具条 + HTML 源码弹窗
// ---------------------------------------------------------------------------
export type SourceTarget = { el: HTMLElement; onChange: (html: string) => void };

const SWATCHES = ['#6fd7c6', '#f2c46d', '#a9a3ff', '#ff9b9b'];

function FloatingToolbar({ disabled, onOpenSource }: { disabled: boolean; onOpenSource: (t: SourceTarget) => void }) {
  const [anchor, setAnchor] = useState<{ x: number; y: number; el: HTMLElement } | null>(null);
  const [color, setColor] = useState('#6fd7c6');
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    if (disabled) {
      setAnchor(null);
      return;
    }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sel = document.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
          setAnchor(null);
          return;
        }
        const hostOf = (n: Node | null) =>
          (n instanceof HTMLElement ? n : n?.parentElement)?.closest<HTMLElement>('[data-rich="1"]') ?? null;
        const host = hostOf(sel.anchorNode);
        if (!host || hostOf(sel.focusNode) !== host) {
          setAnchor(null);
          return;
        }
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          setAnchor(null);
          return;
        }
        setAnchor({
          x: Math.min(Math.max(rect.left + rect.width / 2, 150), window.innerWidth - 150),
          y: Math.max(56, rect.top),
          el: host,
        });
      });
    };
    document.addEventListener('selectionchange', update);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('selectionchange', update);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [disabled]);

  if (!anchor) return null;
  const el = anchor.el;
  const commit = () => richRegistry.get(el)?.(el.innerHTML);
  const exec = (fn: () => void) => {
    fn();
    commit();
  };
  const saveSel = () => {
    const s = document.getSelection();
    if (s && s.rangeCount > 0) savedRange.current = s.getRangeAt(0).cloneRange();
  };
  const restoreSel = () => {
    const r = savedRange.current;
    const s = document.getSelection();
    if (!r || !s) return;
    s.removeAllRanges();
    s.addRange(r);
  };
  const applySize = (em: string) =>
    exec(() => {
      document.execCommand('fontSize', false, '7');
      el.querySelectorAll('font[size="7"]').forEach((f) => {
        const span = document.createElement('span');
        span.style.fontSize = em;
        while (f.firstChild) span.appendChild(f.firstChild);
        f.replaceWith(span);
      });
    });
  const applyColor = (c: string) => {
    restoreSel();
    exec(() => {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('foreColor', false, c);
    });
  };

  return (
    <div
      className="floatToolbar"
      style={{ left: anchor.x, top: anchor.y }}
      onMouseDown={(e) => {
        e.preventDefault();
        saveSel();
      }}
    >
      <button type="button" title="加粗" onClick={() => exec(() => document.execCommand('bold'))}>
        <Bold size={13} />
      </button>
      <span className="ftSep" />
      <button type="button" className="ftText" title="小字号" onClick={() => applySize('0.85em')}>
        小
      </button>
      <button type="button" className="ftText" title="大字号" onClick={() => applySize('1.3em')}>
        大
      </button>
      <button type="button" className="ftText" title="特大字号" onClick={() => applySize('1.6em')}>
        特大
      </button>
      <span className="ftSep" />
      {SWATCHES.map((c) => (
        <button key={c} type="button" className="ftSwatch" style={{ background: c }} title={c} onClick={() => applyColor(c)} />
      ))}
      <label className="ftPicker" title="自定义颜色">
        <Palette size={13} />
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            applyColor(e.target.value);
          }}
        />
      </label>
      <span className="ftSep" />
      <button type="button" title="清除格式" onClick={() => exec(() => document.execCommand('removeFormat'))}>
        <Eraser size={13} />
      </button>
      <button
        type="button"
        title="编辑 HTML 源码"
        onClick={() => {
          const cb = richRegistry.get(el);
          if (cb) onOpenSource({ el, onChange: cb });
        }}
      >
        <Code size={13} />
      </button>
    </div>
  );
}

function SourceModal({ target, onClose }: { target: SourceTarget; onClose: () => void }) {
  const [html, setHtml] = useState(target.el.innerHTML);
  return (
    <div className="sourceModal" onClick={onClose}>
      <div className="sourceCard" onClick={(e) => e.stopPropagation()}>
        <h3>
          <Code size={15} /> 编辑 HTML 源码
        </h3>
        <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={8} spellCheck={false} />
        <p className="fieldHint">支持 &lt;b&gt;、&lt;span style="color:#e0553d;font-size:1.4em"&gt; 等，保存时自动过滤脚本。</p>
        <div className="publishActions">
          <button
            type="button"
            className="primaryButton"
            onClick={() => {
              const clean = sanitizeHtml(html);
              target.el.innerHTML = clean;
              target.onChange(clean);
              onClose();
            }}
          >
            <Check size={15} /> 应用
          </button>
          <button type="button" className="ghostButton" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 弹窗打开时锁定背景滚动
// ---------------------------------------------------------------------------
export function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

// ---------------------------------------------------------------------------
// AdminEditor：#admin 外壳。children 即整站页面，包在 EditCtx 里变成可编辑画布。
// ---------------------------------------------------------------------------
export function AdminEditor({
  content,
  setContent,
  locale,
  children,
}: {
  content: SiteContent;
  setContent: Dispatch<SetStateAction<SiteContent>>;
  locale: Locale;
  children: ReactNode;
}) {
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [preview, setPreview] = useState(false);
  const [token, setToken] = useState(() => window.localStorage.getItem(githubTokenKey) ?? '');
  const [publishing, setPublishing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [saveInfo, setSaveInfo] = useState<{ state: 'clean' | 'dirty' | 'saved'; at?: string }>({ state: 'clean' });
  const [session, bumpSession] = useReducer((x: number) => x + 1, 0);
  const [source, setSource] = useState<SourceTarget | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const firstRun = useRef(true);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(''), 3600);
  }, []);

  // 草稿自动保存（防抖 800ms）
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSaveInfo({ state: 'dirty' });
    const t = window.setTimeout(() => {
      window.localStorage.setItem(contentStorageKey, JSON.stringify(content));
      setSaveInfo({ state: 'saved', at: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) });
    }, 800);
    return () => window.clearTimeout(t);
  }, [content]);

  // 编辑态的全局样式（可编辑虚线、底部留白等）挂在 body[data-editing] 上
  useEffect(() => {
    if (!preview) document.body.dataset.editing = '1';
    else delete document.body.dataset.editing;
    return () => {
      delete document.body.dataset.editing;
    };
  }, [preview]);

  const set = useCallback<EditApi['set']>((up) => setContent((c) => up(c)), [setContent]);

  const uploadFile = useCallback(
    async (file: File) => {
      const tk = token.trim();
      if (!tk) {
        toast('请先在发布面板填入 GitHub Token');
        setDrawer({ type: 'publish' });
        return null;
      }
      toast(`正在上传 ${file.name} …`);
      const res = await uploadImageToGitHub(file, tk);
      if (res.success && res.path) {
        toast(`已上传：${res.path}`);
        return res.path;
      }
      toast(res.message);
      return null;
    },
    [token, toast]
  );

  const api = useMemo<EditApi>(
    () => ({ locale, session, set, openDrawer: setDrawer, uploadFile, toast }),
    [locale, session, set, uploadFile, toast]
  );

  const doPublish = useCallback(async () => {
    if (!token.trim()) {
      setDrawer({ type: 'publish' });
      toast('请先填入 GitHub Token 再发布');
      return;
    }
    if (!window.confirm('把当前内容发布到线上？发布后约 1–2 分钟生效。')) return;
    setPublishing(true);
    toast('正在推送到 GitHub…');
    const res = await publishToGitHub(content, token.trim());
    setPublishing(false);
    toast(res.message);
  }, [content, token, toast]);

  const doReset = useCallback(() => {
    if (!window.confirm('重置为已发布版本？当前浏览器里未发布的草稿修改将全部丢弃。')) return;
    window.localStorage.removeItem(contentStorageKey);
    setContent(defaultContent);
    bumpSession();
    setDrawer(null);
    toast('已重置为已发布版本');
  }, [setContent, toast]);

  const statusText =
    saveInfo.state === 'dirty' ? '正在编辑…' : saveInfo.at ? `草稿已自动保存 ${saveInfo.at}` : '内容与草稿一致';

  return (
    <>
      <EditCtx.Provider value={preview ? null : api}>
        {children}
        {!preview && drawer && (
          <DrawerShell
            state={drawer}
            onClose={() => setDrawer(null)}
            content={content}
            api={api}
            token={token}
            setToken={setToken}
            publishing={publishing}
            onPublish={doPublish}
          />
        )}
      </EditCtx.Provider>
      <FloatingToolbar disabled={preview} onOpenSource={setSource} />
      {source && <SourceModal target={source} onClose={() => setSource(null)} />}
      <div className="editBar" role="toolbar" aria-label="编辑工具条">
        <span className={cx('saveDot', saveInfo.state)} aria-hidden="true" />
        <span className="editBarStatus">{preview ? '预览模式 — 当前所见即访客所见' : statusText}</span>
        {!preview && <span className="editBarLang">编辑语言 {localeLabels[locale]} · 右上角可切换</span>}
        <div className="editBarActions">
          <button
            type="button"
            className="ghostButton"
            onClick={() => {
              setPreview((p) => !p);
              setDrawer(null);
            }}
          >
            {preview ? (
              <>
                <Pencil size={15} /> 继续编辑
              </>
            ) : (
              <>
                <Eye size={15} /> 预览
              </>
            )}
          </button>
          <button type="button" className="ghostButton" onClick={doReset} title="丢弃草稿，恢复为已发布版本">
            <RotateCcw size={15} /> 重置
          </button>
          <button type="button" className="ghostButton" onClick={() => setDrawer({ type: 'publish' })} title="Token 与发布设置">
            <KeyRound size={15} />
          </button>
          <button type="button" className="primaryButton" onClick={doPublish} disabled={publishing}>
            {publishing ? <RefreshCw size={15} className="spin" /> : <Send size={15} />} 发布
          </button>
          <a
            className="ghostButton"
            href="#"
            title="退出编辑模式"
            onClick={() => {
              // 退出前立即落盘，避免 800ms 防抖窗口内的最后修改丢失
              window.localStorage.setItem(contentStorageKey, JSON.stringify(content));
            }}
          >
            <X size={15} /> 退出
          </a>
        </div>
      </div>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  );
}
