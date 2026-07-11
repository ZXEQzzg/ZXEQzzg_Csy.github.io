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
  type PointerEvent as ReactPointerEvent,
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
  GripHorizontal,
  Image as ImageIcon,
  KeyRound,
  Palette,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
  Type,
  Upload,
  X,
} from 'lucide-react';
import {
  defaultContent,
  localeLabels,
  type AvatarStyle,
  type Locale,
  type LocalizedText,
  type ProfileLink,
  type ResearchItem,
  type ResumeBlock,
  type SiteContent,
  type TimelineProject,
} from './data/siteContent';
import { assetUrl, makeLocalizedText, normAvatarStyle, publishToGitHub, uploadImageToGitHub } from './utils/editorUtils';
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
  /** 上传到 public/assets/[folder/]，folder 为业务分类目录（如 'PaPer'） */
  uploadFile: (file: File, folder?: string) => Promise<string | null>;
  toast: (msg: string) => void;
};

/** 各业务的图片分类目录（public/assets/ 下） */
export const ASSET_FOLDERS = {
  avatar: 'I',
  experience: 'Main Experiences',
  gallery: 'PPT',
  research: 'PaPer',
  ticker: 'Recent',
  major: 'Major',
} as const;

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

/** 去 HTML 标签取纯文本：用于 alt/aria/删除确认等非富文本场景 */
export const plainText = (s: string) => s.replace(/<[^>]+>/g, '');

/** 卡片行宽百分比，钳制在 24–100（1 位小数），非法值回落 def */
export const clampWidthPct = (v: unknown, def = 50): number => {
  const n = Math.round(Number(v) * 10) / 10;
  return Number.isFinite(n) && n >= 24 && n <= 100 ? n : def;
};

// 拖宽时的轻量吸附点：常用整分栏（1/4、1/3、1/2、2/3、3/4、整行）
const WIDTH_SNAPS = [25, 33.3, 50, 66.7, 75, 100];

/**
 * 像窗口一样横向拉卡片：拖右缘改行宽百分比。
 * 拖动过程直改卡片的 --w CSS 变量（不触发整树重渲染），松手才提交状态。
 */
export function useWidthDrag(widthPct: number, onCommit: (w: number) => void) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [wBadge, setWBadge] = useState<number | null>(null);

  const startResize = (e: ReactPointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const card = cardRef.current;
    const grid = card?.parentElement;
    if (!card || !grid) return;
    const gridW = grid.getBoundingClientRect().width;
    if (gridW <= 0) return;
    const handle = e.currentTarget as HTMLElement;
    const startX = e.clientX;
    const startPct = widthPct;
    let latest = startPct;
    handle.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      let p = startPct + ((ev.clientX - startX) / gridW) * 100;
      for (const snap of WIDTH_SNAPS) {
        if (Math.abs(p - snap) < 1.6) p = snap;
      }
      latest = Math.min(100, Math.max(24, Math.round(p * 10) / 10));
      card.style.setProperty('--w', String(latest));
      setWBadge(latest);
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      card.style.removeProperty('--w');
      setWBadge(null);
      onCommit(latest);
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  };

  return { cardRef, wBadge, startResize };
}

/**
 * 通用竖向拖拽：pointer 捕获 + 实时回调 + 松手提交。
 * onLive 里直接改 DOM（style/CSS 变量），不触发整树重渲染；onEnd 才写状态。
 */
export function dragVertical(
  e: ReactPointerEvent<HTMLElement>,
  opts: { start: number; min: number; max: number; onLive: (v: number) => void; onEnd: (v: number) => void }
) {
  e.preventDefault();
  e.stopPropagation();
  const handle = e.currentTarget as HTMLElement;
  const startY = e.clientY;
  let latest = Math.round(opts.start);
  let moved = false;
  handle.setPointerCapture(e.pointerId);
  const onMove = (ev: PointerEvent) => {
    moved = true;
    latest = Math.min(opts.max, Math.max(opts.min, Math.round(opts.start + (ev.clientY - startY))));
    opts.onLive(latest);
  };
  const onUp = () => {
    handle.removeEventListener('pointermove', onMove);
    handle.removeEventListener('pointerup', onUp);
    handle.removeEventListener('pointercancel', onUp);
    // 纯点击（未拖动）不提交：onLive 从未执行，调 onEnd 会让调用方误清
    // React 写入的行内样式（等值提交时 React diff 跳过回写，样式就此丢失）
    if (moved) opts.onEnd(latest);
  };
  handle.addEventListener('pointermove', onMove);
  handle.addEventListener('pointerup', onUp);
  handle.addEventListener('pointercancel', onUp);
}

/** 同图高斯模糊铺底：contain 留边时垫在图片后面，让「边边」看起来自然 */
export function BlurFill({ src }: { src: string }) {
  return <span className="blurFill" style={{ backgroundImage: `url("${assetUrl(src)}")` }} aria-hidden="true" />;
}

/** 卡片右缘的拖宽手柄（编辑态才渲染） */
export function CardWidthHandle({
  start,
  reset,
}: {
  start: (e: ReactPointerEvent<HTMLElement>) => void;
  reset: () => void;
}) {
  return (
    <span
      className="cardResizeHandle"
      title="拖动调整卡片宽度 · 双击恢复默认"
      onPointerDown={start}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => {
        e.stopPropagation();
        reset();
      }}
    />
  );
}

// 富文本渲染：内容字段支持 <b>/<span style=...> 等，渲染前做轻量消毒。
// 全站文字都走 dangerouslySetInnerHTML，这里是唯一防线：
// 1. 整段去掉可执行/可加载类标签（script/iframe/object/embed/…，含 srcdoc 注入路径）
// 2. 去 on* 事件属性——注意 HTML 允许用 / 或引号作属性分隔（<img src=x/onerror=…>），
//    不能只认空白符
// 3. 去 javascript: 协议
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*\/?\s*(script|iframe|frame|object|embed|link|meta|base|form)\b[^>]*>/gi, '')
    .replace(/([\s"'/])on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '$1')
    .replace(/javascript:/gi, '');
}

export function RichText({ text, className, as = 'p' }: { text: string; className?: string; as?: ElementType }) {
  const Tag = as as 'p';
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
}

// ---------------------------------------------------------------------------
// contentEditable 基元
// 关键约定：
// 1. 初始 HTML 只在挂载时写入一次（dangerouslySetInnerHTML 传恒定值），React
//    永远不碰输入中的 DOM——打字由浏览器原生渲染，所见即所得、零延迟。
// 2. 不逐键写 React 状态：只在「停顿 400ms / 失焦 / 回车」时提交，避免整页
//    随键重渲染，也避免打断中文输入法组词（组词期间绝不提交，Enter/keyCode
//    229 属于输入法确认，直接放行）。
// 3. 外部改值（切语言/重置草稿）靠调用方换 key 重挂。
// ---------------------------------------------------------------------------
const richRegistry = new WeakMap<HTMLElement, (html: string) => void>();

const COMMIT_DELAY = 400;

/** 输入提交管线：组词保护 + 空闲提交 + 失焦提交，EditableText/EditableRich 共用 */
function useCommitPipeline(read: (el: HTMLElement) => string, onChange: (v: string) => void) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const composing = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const commit = (el: HTMLElement) => {
    window.clearTimeout(timer.current);
    onChangeRef.current(read(el));
  };
  const schedule = (el: HTMLElement) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!composing.current) commit(el);
    }, COMMIT_DELAY);
  };
  return {
    commit,
    handlers: {
      onInput: (e: FormEvent<HTMLElement>) => {
        if (composing.current) return;
        schedule(e.currentTarget);
      },
      onCompositionStart: () => {
        composing.current = true;
        window.clearTimeout(timer.current);
      },
      onCompositionEnd: (e: FormEvent<HTMLElement>) => {
        composing.current = false;
        schedule(e.currentTarget);
      },
      onPaste: (e: ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
      },
    },
    isComposing: () => composing.current,
  };
}

const isImeKey = (e: ReactKeyboardEvent<HTMLElement>) =>
  (e.nativeEvent as KeyboardEvent).isComposing || e.keyCode === 229;

/** 在光标处插入换行（execCommand 不可用时手动插 <br> 兜底，如 jsdom） */
function insertLineBreak() {
  if (document.execCommand?.('insertLineBreak')) return;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const br = document.createElement('br');
  range.insertNode(br);
  range.setStartAfter(br);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

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
  /** 回车时以最新内容回调（用于 chips/列表「提交并新增」的原子写入）；不传则回车=提交+失焦 */
  onEnter?: (current: string) => void;
  onBlurText?: (text: string) => void;
}) {
  // 单行富文本：存 innerHTML（选中文字可经浮动工具条调色/字号/加粗），
  // 回车仍拦截（单行语义），渲染端统一走 sanitizeHtml 消毒。
  // 注意必须冻结整个 {__html} 对象而非只冻结字符串：React 19 对
  // dangerouslySetInnerHTML 按对象引用比较，引用变了就无条件重写 innerHTML，
  // 会把用户正在输入的内容打回旧值（React 18 比较的是字符串，无此问题）。
  const initial = useRef({ __html: sanitizeHtml(value) });
  const ref = useRef<HTMLElement | null>(null);
  const pipeline = useCommitPipeline((el) => el.innerHTML, onChange);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;
  const onBlurRef = useRef(onBlurText);
  onBlurRef.current = onBlurText;
  useEffect(() => {
    const el = ref.current;
    if (el) richRegistry.set(el, (html) => onChangeRef.current(html));
  }, []);
  const Tag = as as 'span';
  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        ref.current = el;
      }}
      className={cx('editable', className)}
      data-rich="1"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-ph={placeholder}
      {...pipeline.handlers}
      onKeyDown={(e: ReactKeyboardEvent<HTMLElement>) => {
        if (isImeKey(e)) return; // 输入法组词中的按键（含确认回车）交给输入法
        if (e.key === 'Enter') {
          e.preventDefault();
          const el = e.currentTarget as HTMLElement;
          if (onEnterRef.current) {
            // chips/列表：Enter=提交并新增一条，Shift+Enter=在本条里换行
            if (e.shiftKey) {
              insertLineBreak();
              pipeline.commit(el);
            } else {
              onEnterRef.current(el.innerHTML);
            }
          } else {
            // 普通字段：Enter 直接换行（点击别处或 Esc 结束编辑）
            insertLineBreak();
            pipeline.commit(el);
          }
        } else if (e.key === 'Escape') {
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onBlur={(e) => {
        const el = e.currentTarget as HTMLElement;
        pipeline.commit(el);
        onBlurRef.current?.(el.textContent ?? '');
      }}
      dangerouslySetInnerHTML={initial.current}
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
  const pipeline = useCommitPipeline((el) => el.innerHTML, onChange);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    const el = ref.current;
    if (el) richRegistry.set(el, (html) => onChangeRef.current(html));
  }, []);
  // 同 EditableText：{__html} 对象引用必须恒定，否则 React 19 每次更新都重写 DOM
  const initial = useRef({ __html: sanitizeHtml(value) });
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
      {...pipeline.handlers}
      onBlur={(e: FormEvent<HTMLElement>) => pipeline.commit(e.currentTarget)}
      dangerouslySetInnerHTML={initial.current}
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
  if (!edit) return <RichText text={value} as={as} className={className} />;
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
  if (!edit) return <RichText text={value[locale]} as={as} className={className} />;
  const key = `${edit.session}:${locale}`;
  return rich ? (
    <EditableRich key={key} value={value[locale]} onChange={onChange} as={as} className={className} placeholder={placeholder} />
  ) : (
    <EditableText key={key} value={value[locale]} onChange={onChange} as={as} className={className} placeholder={placeholder} />
  );
}

// ---------------------------------------------------------------------------
// 配色主题（chip 小框 / 卡片大框共用，含渐变），键名与 styles.css 的 .tone-* 一致
// ---------------------------------------------------------------------------
export const CHIP_THEMES: Array<{ key: string; a: string; b: string; label: string }> = [
  { key: 'teal', a: '#6fd7c6', b: '#6fd7c6', label: '青' },
  { key: 'gold', a: '#f2c46d', b: '#f2c46d', label: '金' },
  { key: 'violet', a: '#a9a3ff', b: '#a9a3ff', label: '紫' },
  { key: 'rose', a: '#ff9b9b', b: '#ff9b9b', label: '玫红' },
  { key: 'sky', a: '#8fd0ff', b: '#8fd0ff', label: '天蓝' },
  { key: 'mint', a: '#9be8a8', b: '#9be8a8', label: '薄荷' },
  { key: 'sunset', a: '#f2c46d', b: '#ff9b9b', label: '落日 · 渐变' },
  { key: 'ocean', a: '#6fd7c6', b: '#8fd0ff', label: '海洋 · 渐变' },
  { key: 'candy', a: '#a9a3ff', b: '#ff9b9b', label: '糖果 · 渐变' },
  { key: 'aurora', a: '#6fd7c6', b: '#a9a3ff', label: '极光 · 渐变' },
];

const themeBg = (key: string): string | undefined => {
  const t = CHIP_THEMES.find((x) => x.key === key);
  return t ? `linear-gradient(120deg, ${t.a}, ${t.b})` : undefined;
};

export const toneClass = (c?: string) => (c ? `tone-${c}` : undefined);

/** 一排配色圆点：第一颗为「默认（清除配色）」 */
export function ThemeDots({ value, onPick }: { value?: string; onPick: (key: string) => void }) {
  return (
    // mousedown 一律 preventDefault：空 chip 依赖失焦即删除，选色点击不能先触发失焦
    <span className="themeDots" onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
      <button type="button" className={cx('themeDot', 'none', !value && 'on')} title="默认（无配色）" onClick={() => onPick('')}>
        <X size={9} />
      </button>
      {CHIP_THEMES.map((t) => (
        <button
          key={t.key}
          type="button"
          className={cx('themeDot', value === t.key && 'on')}
          title={t.label}
          style={{ background: themeBg(t.key) }}
          onClick={() => onPick(t.key)}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// 标签云（chips）与可编辑列表
// ---------------------------------------------------------------------------
export function Chips({
  items,
  onChange,
  className = 'tagCloud',
  colors,
  onColors,
}: {
  items: string[];
  onChange?: (items: string[]) => void;
  className?: string;
  /** 每个 chip 的配色主题键（与 items 一一对应，'' = 默认） */
  colors?: string[];
  /** 传入后编辑态每个 chip 出现配色圆点，可独立换色 */
  onColors?: (colors: string[]) => void;
}) {
  const edit = useEdit();
  // 结构变化（增删）时 +1 强制重挂各 chip，避免 index-key 下文本错位
  const [ver, bump] = useReducer((x: number) => x + 1, 0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);
  const [toneIdx, setToneIdx] = useState<number | null>(null);

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
          <RichText as="span" key={`${item}-${i}`} className={toneClass(colors?.[i])} text={item} />
        ))}
      </div>
    );
  }

  // colors 与 items 对齐后的工作副本：增删改都基于它，保证两数组同步
  const cols = items.map((_, i) => colors?.[i] ?? '');

  const add = () => {
    pendingFocus.current = true;
    bump();
    setToneIdx(null);
    onChange([...items, '']);
    onColors?.([...cols, '']);
  };
  const removeAt = (i: number) => {
    bump();
    setToneIdx(null);
    onChange(items.filter((_, x) => x !== i));
    onColors?.(cols.filter((_, x) => x !== i));
  };

  return (
    <div className={cx(className, 'chipsEdit')} ref={wrapRef}>
      {items.map((item, i) => (
        <span className={cx('chip', toneClass(cols[i] || undefined))} key={`${edit.session}:${ver}:${i}`}>
          <EditableText
            value={item}
            placeholder="标签"
            onChange={(v) => onChange(items.map((x, xi) => (xi === i ? v : x)))}
            onEnter={(t) => {
              // 提交当前文本 + 新增空 chip 必须是一次原子写入，分两次 setState 会互相覆盖
              pendingFocus.current = true;
              bump();
              onChange([...items.map((x, xi) => (xi === i ? t : x)), '']);
              onColors?.([...cols, '']);
            }}
            onBlurText={(t) => {
              if (!t.trim()) removeAt(i);
            }}
          />
          {onColors && (
            <button
              type="button"
              className={cx('chipTone', !cols[i] && 'empty')}
              title="配色"
              style={cols[i] ? { background: themeBg(cols[i]) } : undefined}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setToneIdx(toneIdx === i ? null : i)}
            />
          )}
          <button type="button" className="chipX" title="删除" onMouseDown={(e) => e.preventDefault()} onClick={() => removeAt(i)}>
            <X size={11} />
          </button>
          {onColors && toneIdx === i && (
            <span className="chipTonePop">
              <ThemeDots
                value={cols[i]}
                onPick={(k) => {
                  onColors(cols.map((x, xi) => (xi === i ? k : x)));
                  setToneIdx(null);
                }}
              />
            </span>
          )}
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
    const shown = items.filter((it) => plainText(it[locale]).trim() !== '').slice(0, max ?? items.length);
    if (shown.length === 0) return null;
    const Wrap = as === 'ul' ? 'ul' : 'div';
    const rowAs = as === 'ul' ? 'li' : 'p';
    return (
      <Wrap className={className}>
        {shown.map((it, i) => (
          <RichText key={i} as={rowAs} className={itemClassName} text={it[locale]} />
        ))}
      </Wrap>
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
              onEnter={(t) => {
                bump();
                onChange([...items.map((x, xi) => (xi === i ? setLT(x, locale, t) : x)), makeLocalizedText()]);
              }}
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
  compact = false,
}: {
  onFile: (f: File) => void;
  label: string;
  accept?: string;
  busy?: boolean;
  icon?: ReactNode;
  compact?: boolean;
}) {
  return (
    <label className={cx('fileButton', busy && 'busy', compact && 'iconOnly')} title={compact ? label : undefined}>
      {busy ? <RefreshCw size={14} className="spin" /> : icon ?? <Upload size={14} />}
      {!compact && <span>{busy ? '处理中…' : label}</span>}
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
  folder,
  compact = false,
}: {
  onUploaded: (path: string) => void;
  label?: string;
  accept?: string;
  api?: EditApi;
  icon?: ReactNode;
  /** 上传到 public/assets/ 下的分类目录 */
  folder?: string;
  /** 紧凑图标按钮（用于 chip 等窄场景） */
  compact?: boolean;
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
      compact={compact}
      onFile={async (f) => {
        setBusy(true);
        const path = await edit.uploadFile(f, folder);
        setBusy(false);
        if (path) onUploaded(path);
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// 研究条目配图（展示组件，公开页与编辑抽屉共用）
// 编辑模式下图片下缘有拖拽手柄：直接拖动改框高（自适应模式拖动后自动切为
// 固定·裁剪），双击手柄恢复自适应。拖动过程直改 DOM，松手才提交状态。
// ---------------------------------------------------------------------------
export function ResearchMediaView({ item, onClick }: { item: ResearchItem; onClick?: () => void }) {
  const edit = useEdit();
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragH, setDragH] = useState<number | null>(null);
  const mode = item.imageMode === 'cover' || item.imageMode === 'contain' ? item.imageMode : 'auto';
  const height = Math.round(Number(item.imageHeight)) || 190;
  if (!item.image && !item.pdf) return null;

  const patch = (p: Partial<ResearchItem>) =>
    edit?.set((c) => ({ ...c, recentResearch: updIn(c.recentResearch, item.id, p) }));

  const startDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (!edit) return;
    e.preventDefault();
    e.stopPropagation();
    const box = boxRef.current;
    if (!box) return;
    const handle = e.currentTarget as HTMLElement;
    const startY = e.clientY;
    const startH = box.getBoundingClientRect().height;
    let latest = Math.round(startH);
    handle.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      latest = Math.min(640, Math.max(90, Math.round(startH + (ev.clientY - startY))));
      box.style.height = `${latest}px`;
      setDragH(latest);
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      box.style.height = '';
      setDragH(null);
      patch({ imageHeight: latest, imageMode: mode === 'auto' ? 'cover' : mode });
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  };

  return (
    <div
      ref={boxRef}
      className={cx('researchMedia', `mode-${mode}`, onClick && 'clickable', dragH !== null && 'dragging')}
      style={mode === 'auto' ? undefined : { height }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {item.image ? (
        <>
          {mode === 'contain' && <BlurFill src={item.image} />}
          <img src={assetUrl(item.image)} alt="" loading="lazy" />
        </>
      ) : (
        <div className="pdfPlaceholder">
          <FileText size={22} />
          <span>PDF 附件</span>
        </div>
      )}
      {dragH !== null && <span className="resizeBadge">{dragH}px</span>}
      {edit && (
        <span
          className="resizeHandle"
          title="拖动调整图片框高度 · 双击恢复自适应"
          onPointerDown={startDrag}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => {
            e.stopPropagation();
            patch({ imageMode: 'auto' });
          }}
        >
          <GripHorizontal size={13} />
        </span>
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
  folder,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  api: EditApi;
  label?: string;
  folder?: string;
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
        <UploadButton api={api} folder={folder} label="上传图片" onUploaded={(p) => onChange([...items, p])} />
        <button type="button" className="compactButton" onClick={() => onChange([...items, ''])}>
          <Plus size={14} /> 添加路径
        </button>
      </div>
      {folder && <p className="fieldHint">上传归档到 /assets/{folder}/</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 抽屉面板
// ---------------------------------------------------------------------------
type PanelProps = { content: SiteContent; api: EditApi };

const AVATAR_SHAPES = [
  ['full', '铺满'],
  ['circle', '圆形'],
  ['square', '方形'],
] as const;

function AvatarPanel({ content, api }: PanelProps) {
  const avatars = (content.profile.avatars ?? (content.profile.avatar ? [content.profile.avatar] : [])).filter(Boolean);
  const styles = avatars.map((_, i) => normAvatarStyle(content.profile.avatarStyles?.[i]));
  // avatars 与 avatarStyles 必须一次原子提交，分两次 set 会互相覆盖
  const commit = (nextAvatars: string[], nextStyles: AvatarStyle[]) =>
    api.set((c) => ({
      ...c,
      profile: { ...c.profile, avatars: nextAvatars, avatar: nextAvatars[0] ?? '', avatarStyles: nextStyles },
    }));
  const patchStyle = (i: number, p: Partial<AvatarStyle>) =>
    commit(avatars, styles.map((s, si) => (si === i ? normAvatarStyle({ ...s, ...p }) : s)));
  const backdrop = content.profile.photoBackdrop ?? '';
  const setBackdrop = (v: string) => api.set((c) => ({ ...c, profile: { ...c.profile, photoBackdrop: v } }));
  return (
    <>
      <div className="editorField">
        <span className="fieldLabel">个人照片（可多张：左栏箭头/滑动切换；圆/方头像可在左栏照片区直接拖动摆位置）</span>
        <div className="imgList">
          {avatars.map((p, i) => (
            <div className="avatarRow" key={i}>
              <div className="imgListRow">
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
                  onChange={(e) => commit(avatars.map((x, xi) => (xi === i ? e.target.value : x)), styles)}
                />
                <button
                  type="button"
                  className="iconMiniButton"
                  disabled={i === 0}
                  onClick={() => commit(moveIn(avatars, i, -1), moveIn(styles, i, -1))}
                  title="上移"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  className="iconMiniButton"
                  disabled={i === avatars.length - 1}
                  onClick={() => commit(moveIn(avatars, i, 1), moveIn(styles, i, 1))}
                  title="下移"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  className="iconDangerButton"
                  onClick={() => commit(avatars.filter((_, xi) => xi !== i), styles.filter((_, xi) => xi !== i))}
                  title="删除"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="avatarRowOpts">
                <div className="segmented drawerSeg avatarShapeSeg">
                  {AVATAR_SHAPES.map(([sh, label]) => (
                    <button key={sh} type="button" className={styles[i].shape === sh ? 'active' : ''} onClick={() => patchStyle(i, { shape: sh })}>
                      {label}
                    </button>
                  ))}
                </div>
                {styles[i].shape !== 'full' && (
                  <label className="avatarSizeCtl">
                    <span className="fieldLabel">大小 {styles[i].size}%</span>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      step={1}
                      value={styles[i].size}
                      onChange={(e) => patchStyle(i, { size: Number(e.target.value) })}
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="uploadRow">
          <UploadButton
            api={api}
            folder={ASSET_FOLDERS.avatar}
            label="上传照片"
            onUploaded={(p) => commit([...avatars, p], [...styles, normAvatarStyle(undefined)])}
          />
        </div>
      </div>
      <div className="editorField">
        <span className="fieldLabel">背景装饰图（铺满照片区底部，圆/方头像空出的地方露出它）</span>
        <div className="uploadRow">
          {backdrop ? <img className="uploadPreview" src={assetUrl(backdrop)} alt="" /> : <span className="fieldHint">未设置</span>}
          <UploadButton api={api} folder={ASSET_FOLDERS.avatar} label="上传背景" onUploaded={setBackdrop} />
          {backdrop && (
            <button type="button" className="compactButton" onClick={() => setBackdrop('')}>
              <X size={14} /> 清除背景
            </button>
          )}
        </div>
      </div>
      <p className="fieldHint">
        铺满＝照片按 4:5 撑满画框（原样式）；圆形/方形＝小头像，可调大小并在左栏直接拖动摆放。访客点击照片区查看大图；上传归档到
        /assets/{ASSET_FOLDERS.avatar}/
      </p>
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
  const imgH = (() => {
    const n = Math.round(Number(project.imageHeight));
    return Number.isFinite(n) && n >= 120 && n <= 560 ? n : 220;
  })();
  return (
    <>
      <ImageListEditor
        label="项目图片（每格宽度按图片比例自适应，多图横向滑动；点击可全屏查看）"
        items={project.images}
        onChange={(images) => api.set((c) => ({ ...c, timelineProjects: updIn(c.timelineProjects, project.id, { images }) }))}
        api={api}
        folder={ASSET_FOLDERS.experience}
      />
      <div className="editorField">
        <span className="fieldLabel">图片高度 {imgH}px（也可直接拖卡片上图片区下缘，双击恢复 220px）</span>
        <input
          type="range"
          min={120}
          max={560}
          step={10}
          value={imgH}
          onChange={(e) =>
            api.set((c) => ({ ...c, timelineProjects: updIn(c.timelineProjects, project.id, { imageHeight: Number(e.target.value) }) }))
          }
        />
      </div>
      <p className="fieldHint">图片顺序即展示顺序，可用 ↑↓ 调整；高度与卡片宽度互不影响。</p>
    </>
  );
}

function GalleryCoverPanel({ id, content, api }: PanelProps & { id: string }) {
  const project = content.galleryProjects.find((p) => p.id === id);
  if (!project) return <p className="fieldHint">该项目已删除。</p>;
  const patch = (cover: string) => api.set((c) => ({ ...c, galleryProjects: updIn(c.galleryProjects, id, { cover }) }));
  const coverH = (() => {
    const n = Math.round(Number(project.coverHeight));
    return Number.isFinite(n) && n >= 120 && n <= 520 ? n : 200;
  })();
  return (
    <>
      <div className="drawerPreview">
        {project.cover ? <img className="coverPreview" src={assetUrl(project.cover)} alt="" /> : <p className="fieldHint">暂无封面</p>}
      </div>
      <div className="uploadRow">
        <UploadButton api={api} folder={ASSET_FOLDERS.gallery} label="上传封面" onUploaded={patch} />
      </div>
      <Field label="封面路径" value={project.cover} onChange={patch} placeholder="/assets/文件名" />
      <div className="editorField">
        <span className="fieldLabel">封面高度 {coverH}px（也可直接拖卡片封面下缘，双击恢复 200px）</span>
        <input
          type="range"
          min={120}
          max={520}
          step={10}
          value={coverH}
          onChange={(e) => api.set((c) => ({ ...c, galleryProjects: updIn(c.galleryProjects, id, { coverHeight: Number(e.target.value) }) }))}
        />
      </div>
      <p className="fieldHint">封面完整显示不裁切，留边用同图模糊铺底；上传归档到 /assets/{ASSET_FOLDERS.gallery}/</p>
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
  const widthPct = Math.min(100, Math.max(24, Math.round(Number(item.widthPct)) || 50));

  const onPdf = async (file: File) => {
    setBusyPdf(true);
    let cover: File | null = null;
    try {
      cover = await pdfFirstPageToImage(file);
    } catch {
      // PDF 解析失败也继续上传原文件，封面可手动补
    }
    const pdfPath = await api.uploadFile(file, ASSET_FOLDERS.research);
    if (!pdfPath) {
      setBusyPdf(false);
      return;
    }
    let image = item.image ?? '';
    if (cover) {
      const coverPath = await api.uploadFile(cover, ASSET_FOLDERS.research);
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
        <UploadButton api={api} folder={ASSET_FOLDERS.research} label="上传封面图" onUploaded={(p) => patch({ image: p })} />
        <FilePick label="上传 PDF · 封面取第一页" accept=".pdf,application/pdf" busy={busyPdf} icon={<FileUp size={14} />} onFile={onPdf} />
      </div>
      <p className="fieldHint">上传归档到 /assets/{ASSET_FOLDERS.research}/</p>
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
        <p className="fieldHint">
          自适应＝按图片真实比例完整展示；固定＝统一框高，超出部分裁剪或留边。也可以直接在卡片图片下缘
          <b>拖动手柄</b>调高度（双击手柄恢复自适应）。
        </p>
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
      <div className="editorField">
        <span className="fieldLabel">卡片宽度 {widthPct}%（也可像窗口一样拖卡片右缘，双击恢复 50%）</span>
        <input type="range" min={24} max={100} step={1} value={widthPct} onChange={(e) => patch({ widthPct: Number(e.target.value) })} />
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

// 字号档位（px）：覆盖注释小字到大标题
const SIZE_STEPS = [12, 13, 14, 15, 16, 18, 20, 23, 26, 30, 36, 46];

function FloatingToolbar({ disabled, onOpenSource }: { disabled: boolean; onOpenSource: (t: SourceTarget) => void }) {
  const [anchor, setAnchor] = useState<{ x: number; y: number; el: HTMLElement } | null>(null);
  const [color, setColor] = useState('#6fd7c6');
  const [showSizes, setShowSizes] = useState(false);
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
  const applySize = (px: number) => {
    restoreSel();
    exec(() => {
      document.execCommand('fontSize', false, '7');
      el.querySelectorAll('font[size="7"]').forEach((f) => {
        const span = document.createElement('span');
        span.style.fontSize = `${px}px`;
        while (f.firstChild) span.appendChild(f.firstChild);
        f.replaceWith(span);
      });
    });
  };
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
      <button
        type="button"
        className={cx('ftText', showSizes && 'ftOn')}
        title="字号（展开档位）"
        onClick={() => setShowSizes((s) => !s)}
      >
        <Type size={12} /> 字号
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
      {showSizes && (
        <span className="ftSizes">
          {SIZE_STEPS.map((px) => (
            <button key={px} type="button" className="ftText" title={`${px}px`} onClick={() => applySize(px)}>
              {px}
            </button>
          ))}
        </span>
      )}
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
    async (file: File, folder?: string) => {
      const tk = token.trim();
      if (!tk) {
        toast('请先在发布面板填入 GitHub Token');
        setDrawer({ type: 'publish' });
        return null;
      }
      toast(`正在上传 ${file.name} …`);
      const res = await uploadImageToGitHub(file, tk, folder);
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
