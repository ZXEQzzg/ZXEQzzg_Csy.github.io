import {
  StrictMode,
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  Github,
  Globe,
  GraduationCap,
  ImagePlus,
  Languages,
  Mail,
  Maximize2,
  MessageCircle,
  Moon,
  Palette,
  PanelsTopLeft,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react';
import {
  defaultContent,
  localeLabels,
  type GalleryProject,
  type InfoModule,
  type Locale,
  type LocalizedText,
  type ProfileLink,
  type ResearchItem,
  type SiteContent,
  type ThemeMode,
  type TickerItem,
  type TimelineProject,
} from './data/siteContent';
import { assetUrl, makeLocalizedText, normAvatarStyle, validPalette } from './utils/editorUtils';
import {
  ASSET_FOLDERS,
  AddGhost,
  AdminEditor,
  BlurFill,
  CardWidthHandle,
  Chips,
  EditableText,
  ItemToolbar,
  LT,
  LTList,
  ResearchMediaView,
  RichText,
  S,
  SR,
  ThemeDots,
  UploadButton,
  clampWidthPct,
  contentStorageKey,
  cx,
  dragVertical,
  moveIn,
  plainText,
  setLT,
  toneClass,
  updIn,
  useEdit,
  useLockBody,
  useWidthDrag,
} from './editing';
import './styles.css';

type SectionKey = 'intro' | 'skills' | 'experience' | 'gallery' | 'major' | 'courses' | 'research';

const sectionLabels: Record<SectionKey, Record<Locale, string>> = {
  intro: { zh: '个人介绍', en: 'Profile', ko: '소개' },
  skills: { zh: '技术栈', en: 'Stack', ko: '스택' },
  experience: { zh: '主要经历', en: 'Experience', ko: '주요 경력' },
  gallery: { zh: '学术驱动项目', en: 'Academic Gallery', ko: '학술 갤러리' },
  major: { zh: '专业介绍', en: 'Major', ko: '전공' },
  courses: { zh: '课程介绍', en: 'Courses', ko: '수업' },
  research: { zh: '近期研究方向', en: 'Recent Research', ko: '최근 연구' },
};

// 站点主题色预设：键与 styles.css 的 :root[data-palette=*]、editorUtils 的
// PALETTE_KEYS 一致；a/b 仅用于选择器圆点预览
const SITE_PALETTES: Array<{ key: string; label: string; a: string; b: string }> = [
  { key: '', label: '默认 · 青金', a: '#6fd7c6', b: '#f2c46d' },
  { key: 'rose', label: '玫瑰 · 深红+白', a: '#bb2649', b: '#f7e3e8' },
  { key: 'meadow', label: '青草 · 草绿+淡蓝', a: '#3e9e46', b: '#8fd0ff' },
  { key: 'claude', label: 'Claude · 淡黄+花纹', a: '#d97757', b: '#f0eee5' },
  { key: 'violet', label: '暮紫 · 紫罗兰+霞粉', a: '#a89bff', b: '#f0a6ca' },
  { key: 'sunset', label: '落日 · 橘+暖金', a: '#ff8a5c', b: '#ffc76b' },
];

// 板块标题：优先用户在编辑器里改过的 sectionTitles，缺省回落到内置三语标题
const secLT = (content: SiteContent, key: SectionKey): LocalizedText =>
  (content.sectionTitles?.[key] as LocalizedText | undefined) ?? sectionLabels[key];

/** 可就地编辑的板块标题（写入 content.sectionTitles，导航/计数处同步更新） */
function SectionTitleLT({
  content,
  locale,
  k,
  as = 'h2',
  className,
}: {
  content: SiteContent;
  locale: Locale;
  k: SectionKey;
  as?: 'h2' | 'span';
  className?: string;
}) {
  const edit = useEdit();
  return (
    <LT
      value={secLT(content, k)}
      locale={locale}
      as={as}
      className={className}
      placeholder="板块标题"
      onChange={(v) =>
        edit?.set((c) => ({ ...c, sectionTitles: { ...(c.sectionTitles ?? {}), [k]: setLT(secLT(c, k), locale, v) } }))
      }
    />
  );
}

// 页面上零散 UI 文案（按钮/标签/角标/页脚等）：编辑器可改、可调色字号，
// 存 content.uiStrings，缺省回落内置三语文案
const UI_FALLBACKS: Record<string, LocalizedText> = {
  resumeLabel: { zh: '目前简历 · CV', en: 'Resume · CV', ko: '이력서 · CV' },
  resumeView: { zh: '查看简历', en: 'View resume', ko: '이력서 보기' },
  resumeDownload: { zh: '下载 PDF 简历', en: 'Download PDF', ko: 'PDF 다운로드' },
  galleryMore: { zh: '查看详情', en: 'Details', ko: '자세히 보기' },
  pillStack: { zh: 'Stack', en: 'Stack', ko: 'Stack' },
  pillRole: { zh: '职责', en: 'Role', ko: '역할' },
  pillOutcome: { zh: '成果', en: 'Outcome', ko: '결과' },
  footGithub: { zh: 'GitHub', en: 'GitHub', ko: 'GitHub' },
  footNote: { zh: 'Vite + React · GitHub Pages', en: 'Vite + React · GitHub Pages', ko: 'Vite + React · GitHub Pages' },
};

const uiLT = (content: SiteContent, k: string): LocalizedText =>
  (content.uiStrings?.[k] as LocalizedText | undefined) ?? UI_FALLBACKS[k] ?? makeLocalizedText(k);

function UIText({
  content,
  locale,
  k,
  as = 'span',
  className,
}: {
  content: SiteContent;
  locale: Locale;
  k: string;
  as?: 'span' | 'p';
  className?: string;
}) {
  const edit = useEdit();
  return (
    // display:contents 让包装 span 不产生盒子；编辑态拦住点击（stopPropagation 挡外层
    // 按钮回调，preventDefault 挡 <a> 的默认跳转——外层的守卫因冒泡被截而收不到事件）
    <span
      style={{ display: 'contents' }}
      onClick={
        edit
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : undefined
      }
    >
      <LT
        value={uiLT(content, k)}
        locale={locale}
        as={as}
        className={className}
        placeholder="文本"
        onChange={(v) => edit?.set((c) => ({ ...c, uiStrings: { ...(c.uiStrings ?? {}), [k]: setLT(uiLT(c, k), locale, v) } }))}
      />
    </span>
  );
}

// 板块外壳：标题行右侧的箭头按钮折叠/展开（折叠状态记在本浏览器 localStorage）。
// 收起用 display:none 直接切换——此前的 grid-rows 动画在线上出现内容无法恢复的问题，
// 稳定优先。
function CollapsibleSection({
  id,
  icon,
  titleNode,
  children,
}: {
  id: SectionKey;
  icon: ReactNode;
  titleNode: ReactNode;
  children: ReactNode;
}) {
  const secRef = useRef<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(`zx-sec-collapsed:${id}`) === '1';
    } catch {
      return false;
    }
  });
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(`zx-sec-collapsed:${id}`, next ? '1' : '0');
    } catch {
      // 隐私模式等场景写不进去也不影响本次会话
    }
    if (next) {
      // 收起一大段内容后页面高度骤减，视口可能落到别处，把板块标题拉回可视范围
      window.requestAnimationFrame(() => secRef.current?.scrollIntoView({ block: 'nearest' }));
    }
  };
  return (
    <section id={id} ref={secRef} className={cx('moduleSection', 'reveal', collapsed && 'secCollapsed')}>
      <div className="sectionHeading">
        <span className="headingIcon">{icon}</span>
        {titleNode}
        <span className="headingLine" aria-hidden="true" />
        <button
          type="button"
          className="secToggle"
          onClick={toggle}
          aria-expanded={!collapsed}
          title={collapsed ? '展开该板块' : '折叠该板块'}
        >
          <ChevronDown size={15} className="secChevron" aria-hidden="true" />
        </button>
      </div>
      <div className="secBody">{children}</div>
    </section>
  );
}

// 把旧草稿补齐到最新结构：老的 localStorage 草稿缺 avatar / images / resume /
// recentResearch 新字段，不补齐编辑器会崩，所以入口统一 normalize。
function migrateContent(parsed: SiteContent): SiteContent {
  const content = parsed;
  if (content.profile) {
    if (typeof content.profile.avatar !== 'string') content.profile.avatar = '';
    if (typeof content.profile.mark !== 'string') content.profile.mark = 'AI';
    if (typeof content.profile.siteTitle !== 'string') content.profile.siteTitle = 'ZXEQzzg Csy Portfolio';
    if (typeof content.profile.heroHeight !== 'number') content.profile.heroHeight = 0;
    if (!Array.isArray(content.profile.avatarStyles)) content.profile.avatarStyles = [];
    if (typeof content.profile.photoBackdrop !== 'string') content.profile.photoBackdrop = '';
    const r = content.profile.resume;
    content.profile.resume = {
      images: Array.isArray(r?.images) ? r.images : [],
      pdf: typeof r?.pdf === 'string' ? r.pdf : '',
    };
  }
  if (content.skills && Array.isArray(content.skills.groups)) {
    content.skills.groups = content.skills.groups.map((g) => ({
      ...g,
      theme: typeof g.theme === 'string' ? g.theme : '',
      itemColors: Array.isArray(g.itemColors) ? g.itemColors : [],
    }));
  }
  if (Array.isArray(content.timelineProjects)) {
    content.timelineProjects = content.timelineProjects.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
      stackColors: Array.isArray(p.stackColors) ? p.stackColors : [],
    }));
  }
  for (const key of ['major', 'courses'] as const) {
    if (Array.isArray(content[key])) {
      content[key] = content[key].map((m) => ({
        ...m,
        images: Array.isArray(m.images) ? m.images : [],
        imagePos: Array.isArray(m.imagePos) ? m.imagePos : [],
      }));
    }
  }
  content.recentResearch = Array.isArray(content.recentResearch)
    ? content.recentResearch.map((r) => ({
        image: '',
        pdf: '',
        imageMode: 'auto' as const,
        imageHeight: 190,
        widthPct: 50,
        ...r,
        kind: typeof r.kind === 'string' ? r.kind : '',
        link: typeof r.link === 'string' ? r.link : '',
        note: r.note && typeof r.note === 'object' ? r.note : makeLocalizedText(''),
      }))
    : [];
  if (!content.sectionTitles || typeof content.sectionTitles !== 'object') content.sectionTitles = {};
  if (!content.uiStrings || typeof content.uiStrings !== 'object') content.uiStrings = {};
  if (typeof content.palette !== 'string') content.palette = '';
  if (content.profile) {
    content.profile.ticker = Array.isArray(content.profile.ticker)
      ? content.profile.ticker.map((t, i) => ({
          id: typeof t?.id === 'string' ? t.id : `ticker-${i}`,
          text: t?.text && typeof t.text === 'object' ? t.text : makeLocalizedText(''),
          image: typeof t?.image === 'string' ? t.image : '',
          imageHeight: typeof t?.imageHeight === 'number' ? t.imageHeight : 72,
        }))
      : [];
    if (!content.profile.tickerLabel || typeof content.profile.tickerLabel !== 'object') {
      content.profile.tickerLabel = { zh: '近期内容', en: 'Recent', ko: '최근 소식' };
    }
    content.profile.avatars = Array.isArray(content.profile.avatars)
      ? content.profile.avatars.filter((s) => typeof s === 'string' && s)
      : content.profile.avatar
        ? [content.profile.avatar]
        : [];
  }
  return content;
}

// 按联系方式标签选图标（中英都认）
function contactIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('email') || l.includes('mail') || l.includes('邮')) return <Mail size={16} />;
  if (l.includes('github')) return <Github size={16} />;
  if (l.includes('phone') || l.includes('tel') || l.includes('电话') || l.includes('手机')) return <Phone size={16} />;
  if (l.includes('wechat') || l.includes('weixin') || l.includes('微信')) return <MessageCircle size={16} />;
  return <Globe size={16} />;
}

// 联系方式 href 规范化：合法协议直接用，邮箱自动 mailto:，域名补 https://，
// 其余（电话/微信占位符「·」等）返回 null 渲染为不可点击行，避免点了跳 404。
function normalizeHref(link: ProfileLink): string | null {
  const href = (link.href || '').trim();
  const emailish = (s: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (emailish(href)) return `mailto:${href}`;
  if (emailish(link.value.trim())) return `mailto:${link.value.trim()}`;
  if (/^(www\.|[a-z0-9-]+(\.[a-z0-9-]+)+([/?#]|$))/i.test(href)) return `https://${href}`;
  return null;
}

function getInitialContent(): SiteContent {
  const saved = window.localStorage.getItem(contentStorageKey);
  if (!saved) return defaultContent;
  try {
    return migrateContent(JSON.parse(saved) as SiteContent);
  } catch {
    return defaultContent;
  }
}

// ===== App =====
function App() {
  const [content, setContent] = useState<SiteContent>(getInitialContent);
  const [locale, setLocale] = useState<Locale>('zh');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale === 'ko' ? 'ko' : 'en';
  }, [theme, locale]);

  // 站点主题色（发布内容的一部分，访客看到的是站主选的配色；与明暗切换叠加）
  useEffect(() => {
    const p = validPalette(content.palette);
    if (p) document.documentElement.dataset.palette = p;
    else delete document.documentElement.dataset.palette;
  }, [content.palette]);

  const site = (
    <Portfolio content={content} locale={locale} theme={theme} setLocale={setLocale} setTheme={setTheme} animate={!isAdmin} />
  );

  if (isAdmin) {
    return (
      <AdminEditor content={content} setContent={setContent} locale={locale}>
        {site}
      </AdminEditor>
    );
  }
  return site;
}

// ===== 滚动进度条 / 区块高亮 / 进场动画 =====
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return <div className="scrollProgress" aria-hidden="true" ref={ref} />;
}

function useActiveSection(ids: SectionKey[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? 'intro');
  const idsKey = ids.join(',');
  useEffect(() => {
    const list = idsKey.split(',').filter(Boolean);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          visible.set((e.target as HTMLElement).id, e.isIntersecting ? Math.max(e.intersectionRatio, 0.0001) : 0)
        );
        const current = list.find((id) => (visible.get(id) ?? 0) > 0);
        if (current) setActive(current);
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.2, 0.6] }
    );
    list.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [idsKey]);
  return active;
}

// 进场渐显：仅公开页启用；编辑模式全部直接可见，避免打扰编辑。
// ⚠️ 标记必须用 data 属性而非 classList：这些节点的 className 由 React 管理，
// 任何触发 className 重写的 setState（如折叠切换）都会把命令式加上的 'in' 类抹掉，
// 板块退回「进场前」的透明态且 IO 已 unobserve，只能刷新恢复。
// React 更新不会碰它不认识的 data 属性，data-in 可安全存活。
function useReveal(enabled: boolean) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const markIn = (el: HTMLElement) => {
      el.dataset.in = '1';
    };
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(markIn);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            markIn(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 }
    );
    nodes.filter((el) => el.dataset.in !== '1').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
}

// ===== Portfolio =====
function Portfolio({
  content,
  locale,
  theme,
  setLocale,
  setTheme,
  animate = true,
}: {
  content: SiteContent;
  locale: Locale;
  theme: ThemeMode;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  animate?: boolean;
}) {
  const edit = useEdit();
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; captions?: string[] } | null>(null);
  const [galleryModalId, setGalleryModalId] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [heroBadge, setHeroBadge] = useState<number | null>(null);
  const heroH = clampH(content.profile.heroHeight, 0, 200, 900);

  const sections = (Object.keys(sectionLabels) as SectionKey[]).filter(
    (s) => s !== 'research' || content.recentResearch.length > 0 || Boolean(edit)
  );
  const activeSection = useActiveSection(sections);
  useReveal(animate);

  const openLightbox = (images: string[], index: number, captions?: string[]) => setLightbox({ images, index, captions });
  const galleryProject = galleryModalId ? content.galleryProjects.find((p) => p.id === galleryModalId) ?? null : null;

  return (
    <main className="appShell">
      <ScrollProgress />
      <aside className="sidebar">
        <div className="sidebarScroller">
          <div className="identityBlock">
            <S
              value={content.profile.mark ?? 'AI'}
              as="div"
              className="mark"
              placeholder="AI"
              onChange={(v) => edit?.set((c) => ({ ...c, profile: { ...c.profile, mark: v } }))}
            />
            <div className="identityText">
              <LT
                value={content.profile.location}
                locale={locale}
                as="p"
                className="eyebrow"
                placeholder="所在地"
                onChange={(v) => edit?.set((c) => ({ ...c, profile: { ...c.profile, location: setLT(c.profile.location, locale, v) } }))}
              />
              <SR
                value={content.profile.name}
                as="h1"
                placeholder="姓名"
                onChange={(v) => edit?.set((c) => ({ ...c, profile: { ...c.profile, name: v } }))}
              />
            </div>
          </div>

          <ProfilePhotos content={content} onOpen={openLightbox} />

          <section className="contactList">
            {content.profile.links.map((link, i) => {
              const inner = (
                <>
                  {contactIcon(link.label)}
                  <S
                    value={link.value}
                    as="span"
                    placeholder="内容"
                    onChange={(v) =>
                      edit?.set((c) => ({
                        ...c,
                        profile: { ...c.profile, links: c.profile.links.map((l, li) => (li === i ? { ...l, value: v } : l)) },
                      }))
                    }
                  />
                  {edit && (
                    <button
                      type="button"
                      className="iconMiniButton rowTool"
                      title="编辑标签 / 链接 / 删除"
                      onClick={(e) => {
                        e.stopPropagation();
                        edit.openDrawer({ type: 'link', index: i });
                      }}
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                </>
              );
              const href = edit ? null : normalizeHref(link);
              return href ? (
                <a className="contactRow" key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div className="contactRow" key={i}>
                  {inner}
                </div>
              );
            })}
            {edit && (
              <AddGhost
                className="row"
                label="添加联系方式"
                onClick={() => {
                  const next = content.profile.links.length;
                  edit.set((c) => ({
                    ...c,
                    profile: { ...c.profile, links: [...c.profile.links, { label: 'Email', value: '', href: '' }] },
                  }));
                  edit.openDrawer({ type: 'link', index: next });
                }}
              />
            )}
          </section>

          {(edit || content.profile.resume.images.length > 0 || Boolean(content.profile.resume.pdf)) && (
            <section className="resumeBlock">
              <p className="blockLabel">
                <FileText size={14} /> <UIText content={content} locale={locale} k="resumeLabel" />
                {edit && (
                  <button
                    type="button"
                    className="iconMiniButton rowTool"
                    title="管理简历图片 / PDF"
                    onClick={() => edit.openDrawer({ type: 'resume' })}
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </p>
              {/* 编辑态渲染为 span：<button> 内的 contentEditable 在 Chrome 里无法聚焦编辑 */}
              {content.profile.resume.images.length > 0 &&
                (edit ? (
                  <span className="resumeView" role="button" onClick={() => edit.openDrawer({ type: 'resume' })}>
                    <Eye size={15} /> <UIText content={content} locale={locale} k="resumeView" />
                  </span>
                ) : (
                  <button type="button" className="resumeView" onClick={() => openLightbox(content.profile.resume.images, 0)}>
                    <Eye size={15} /> <UIText content={content} locale={locale} k="resumeView" />
                  </button>
                ))}
              {content.profile.resume.pdf &&
                (edit ? (
                  <span className="resumeDownload" role="button" onClick={() => edit.openDrawer({ type: 'resume' })}>
                    <Download size={15} /> <UIText content={content} locale={locale} k="resumeDownload" />
                  </span>
                ) : (
                  <a className="resumeDownload" href={assetUrl(content.profile.resume.pdf)} download target="_blank" rel="noreferrer">
                    <Download size={15} /> <UIText content={content} locale={locale} k="resumeDownload" />
                  </a>
                ))}
              {edit && content.profile.resume.images.length === 0 && !content.profile.resume.pdf && (
                <AddGhost className="row" label="设置简历图片 / PDF" onClick={() => edit.openDrawer({ type: 'resume' })} />
              )}
            </section>
          )}

          <section className="microPanel">
            <div>
              <RichText as="span" text={secLT(content, 'experience')[locale]} />
              <strong>{content.timelineProjects.length}</strong>
            </div>
            <div>
              <RichText as="span" text={secLT(content, 'gallery')[locale]} />
              <strong>{content.galleryProjects.filter((p) => p.hidden !== true).length}</strong>
            </div>
          </section>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="titleDock">
            <PanelsTopLeft size={18} />
            <S
              value={content.profile.siteTitle ?? 'ZXEQzzg Csy Portfolio'}
              as="span"
              placeholder="站点标题"
              onChange={(v) => edit?.set((c) => ({ ...c, profile: { ...c.profile, siteTitle: v } }))}
            />
          </div>
          <div className="settingsDock">
            {edit && (
              <div className="paletteDock" title="站点主题色：选好后随发布对访客生效">
                <Palette size={15} />
                {SITE_PALETTES.map((p) => (
                  <button
                    key={p.key || 'default'}
                    type="button"
                    className={cx('paletteDot', validPalette(content.palette) === p.key && 'on')}
                    title={p.label}
                    style={{ background: `linear-gradient(120deg, ${p.a}, ${p.b})` }}
                    onClick={() => edit.set((c) => ({ ...c, palette: p.key }))}
                  />
                ))}
              </div>
            )}
            <div className="segmented" aria-label="Language selector">
              <Languages size={15} />
              {(Object.keys(localeLabels) as Locale[]).map((item) => (
                <button key={item} className={item === locale ? 'active' : ''} onClick={() => setLocale(item)} type="button">
                  {localeLabels[item]}
                </button>
              ))}
            </div>
            <button
              className="iconButton"
              type="button"
              aria-label="Toggle theme"
              title="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div className="contentGrid">
          <nav className="sectionRail" aria-label="Portfolio sections">
            {sections.map((section) => (
              <a
                key={section}
                className={activeSection === section ? 'active' : ''}
                href={`#${section}`}
                onClick={(e) => {
                  // 阻止改 hash：编辑模式下 hash 变化会退出 #admin
                  e.preventDefault();
                  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span className="railDot" aria-hidden="true" />
                <RichText as="span" className="railLabel" text={secLT(content, section)[locale]} />
              </a>
            ))}
          </nav>

          <div className="mainFlow">
            <section
              id="intro"
              className="introBand reveal"
              ref={heroRef}
              style={heroH ? { minHeight: heroH } : undefined}
            >
              <p className="eyebrow">
                <Sparkles size={14} />
                <SectionTitleLT content={content} locale={locale} k="intro" as="span" />
              </p>
              <LT
                rich
                value={content.profile.headline}
                locale={locale}
                as="h2"
                className="heroHeadline"
                placeholder="一句话标题"
                onChange={(v) => edit?.set((c) => ({ ...c, profile: { ...c.profile, headline: setLT(c.profile.headline, locale, v) } }))}
              />
              <LT
                rich
                value={content.profile.intro}
                locale={locale}
                as="p"
                className="heroIntro"
                placeholder="个人简介"
                onChange={(v) => edit?.set((c) => ({ ...c, profile: { ...c.profile, intro: setLT(c.profile.intro, locale, v) } }))}
              />
              <LT
                rich
                value={content.profile.research}
                locale={locale}
                as="p"
                className="research"
                placeholder="研究方向"
                onChange={(v) => edit?.set((c) => ({ ...c, profile: { ...c.profile, research: setLT(c.profile.research, locale, v) } }))}
              />
              <TickerStrip content={content} locale={locale} onOpenImages={openLightbox} />
              {edit && (
                <span
                  className="resizeHandle heroResize"
                  title="拖动调整个人介绍框高度 · 双击恢复自适应"
                  onPointerDown={(e) => {
                    const el = heroRef.current;
                    if (!el) return;
                    dragVertical(e, {
                      start: el.getBoundingClientRect().height,
                      min: 200,
                      max: 900,
                      onLive: (v) => {
                        el.style.minHeight = `${v}px`;
                        setHeroBadge(v);
                      },
                      onEnd: (v) => {
                        el.style.minHeight = '';
                        setHeroBadge(null);
                        edit.set((c) => ({ ...c, profile: { ...c.profile, heroHeight: v } }));
                      },
                    });
                  }}
                  onDoubleClick={() => edit.set((c) => ({ ...c, profile: { ...c.profile, heroHeight: 0 } }))}
                />
              )}
              {heroBadge !== null && <span className="resizeBadge">{heroBadge}px</span>}
            </section>

            <SkillsSection content={content} locale={locale} />
            <ExperienceSection content={content} locale={locale} onOpenImages={openLightbox} />
            <GallerySection content={content} locale={locale} onOpenModal={setGalleryModalId} />

            <CollapsibleSection id="major" icon={<GraduationCap size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="major" />}>
              <InfoGrid modules={content.major} locale={locale} listKey="major" addLabel="添加专业模块" onOpenImages={openLightbox} />
            </CollapsibleSection>

            <CollapsibleSection id="courses" icon={<BookOpen size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="courses" />}>
              <InfoGrid modules={content.courses} locale={locale} listKey="courses" addLabel="添加课程" onOpenImages={openLightbox} />
            </CollapsibleSection>

            <ResearchSection content={content} locale={locale} onOpenImages={openLightbox} />

            <Footer content={content} locale={locale} />
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          captions={lightbox.captions}
          onClose={() => setLightbox(null)}
          onIndex={(index) => setLightbox({ ...lightbox, index })}
        />
      )}
      {galleryProject && (
        <GalleryModal
          content={content}
          project={galleryProject}
          locale={locale}
          onClose={() => setGalleryModalId(null)}
          onOpenImage={openLightbox}
        />
      )}
    </main>
  );
}

// ===== 左栏个人照片轮播 =====
// 多张：箭头/滑动切换，公开页点击看大图。每张可选形状（铺满/圆形/方形）；
// 圆/方为小于画框的头像，编辑态可直接按住拖动摆位置（avatarStyles.pos），
// 空出的区域显示背景装饰图（photoBackdrop）。
function ProfilePhotos({ content, onOpen }: { content: SiteContent; onOpen: (images: string[], index: number) => void }) {
  const edit = useEdit();
  const avatars = (content.profile.avatars ?? (content.profile.avatar ? [content.profile.avatar] : [])).filter(Boolean);
  const styles = avatars.map((_, i) => normAvatarStyle(content.profile.avatarStyles?.[i]));
  const backdrop = content.profile.photoBackdrop ?? '';
  const count = avatars.length;
  const [idx, setIdx] = useState(0);
  const cur = count ? Math.min(idx, count - 1) : 0;
  const swipeStart = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const go = (delta: number) => setIdx((cur + delta + count) % count);

  // 编辑态按住圆/方头像拖动摆位置：实时改 left/top，松手才提交 avatarStyles[i].pos
  const dragAvatar = (e: ReactPointerEvent<HTMLImageElement>, i: number) => {
    if (!edit) return;
    e.preventDefault();
    e.stopPropagation();
    const img = e.currentTarget;
    const cell = img.parentElement;
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const [sx0, sy0] = styles[i].pos.split(' ').map(Number);
    const startX = e.clientX;
    const startY = e.clientY;
    let latest = { x: sx0, y: sy0 };
    let moved = false;
    img.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      moved = true;
      const c = (n: number) => Math.min(100, Math.max(0, Math.round(n * 10) / 10));
      latest = {
        x: c(sx0 + ((ev.clientX - startX) / Math.max(1, rect.width)) * 100),
        y: c(sy0 + ((ev.clientY - startY) / Math.max(1, rect.height)) * 100),
      };
      img.style.left = `${latest.x}%`;
      img.style.top = `${latest.y}%`;
    };
    const onUp = () => {
      img.removeEventListener('pointermove', onMove);
      img.removeEventListener('pointerup', onUp);
      img.removeEventListener('pointercancel', onUp);
      if (moved) {
        suppressClick.current = true;
        edit.set((c) => {
          const list = (c.profile.avatars ?? []).map((_, x) => normAvatarStyle(c.profile.avatarStyles?.[x]));
          return {
            ...c,
            profile: {
              ...c.profile,
              avatarStyles: list.map((s, si) => (si === i ? { ...s, pos: `${latest.x} ${latest.y}` } : s)),
            },
          };
        });
      }
    };
    img.addEventListener('pointermove', onMove);
    img.addEventListener('pointerup', onUp);
    img.addEventListener('pointercancel', onUp);
  };

  return (
    <div
      className={cx('profilePhoto', edit && 'canEdit', (count > 0 || Boolean(backdrop)) && 'hasPhoto')}
      role="button"
      title={edit ? '管理个人照片（圆/方头像可直接拖动摆位置）' : count ? '查看大图' : undefined}
      onClick={() => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        if (edit) edit.openDrawer({ type: 'avatar' });
        else if (count) onOpen(avatars, cur);
      }}
      onPointerDown={(e) => {
        if (count > 1) swipeStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (start === null || count < 2) return;
        const dx = e.clientX - start;
        if (Math.abs(dx) > 36) {
          suppressClick.current = true;
          go(dx < 0 ? 1 : -1);
        }
      }}
    >
      {count > 0 || backdrop ? (
        <div className="photoViewport">
          {backdrop && <img className="photoBackdrop" src={assetUrl(backdrop)} alt="" draggable={false} />}
          <div className="photoTrack" style={{ transform: `translateX(-${cur * 100}%)` }}>
            {avatars.map((a, i) => {
              const st = styles[i];
              const [px, py] = st.pos.split(' ').map(Number);
              return (
                <div className="photoCell" key={`${a}-${i}`}>
                  {st.shape === 'full' ? (
                    <img
                      className="photoFull"
                      src={assetUrl(a)}
                      alt={`个人照片 ${i + 1}`}
                      loading={i === 0 ? undefined : 'lazy'}
                      draggable={false}
                    />
                  ) : (
                    <img
                      className={cx('photoShaped', st.shape)}
                      src={assetUrl(a)}
                      alt={`个人照片 ${i + 1}`}
                      loading={i === 0 ? undefined : 'lazy'}
                      draggable={false}
                      style={{ left: `${px}%`, top: `${py}%`, width: `${st.size}%` }}
                      onPointerDown={(e) => dragAvatar(e, i)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="profilePhotoFallback">
          <User size={30} />
          <span>个人照片</span>
        </div>
      )}
      {count > 1 && (
        <>
          <button
            type="button"
            className="photoNav prev"
            aria-label="上一张"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="photoNav next"
            aria-label="下一张"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <ChevronRight size={16} />
          </button>
          <span className="photoDots" aria-hidden="true">
            {avatars.map((_, i) => (
              <i key={i} className={i === cur ? 'on' : ''} />
            ))}
          </span>
        </>
      )}
      {edit && (
        <span className="photoEditHint">
          <ImagePlus size={14} /> 管理照片
        </span>
      )}
    </div>
  );
}

// ===== 近期内容滚动条（个人介绍板块内，右→左循环） =====
const defaultTickerLabel: LocalizedText = { zh: '近期内容', en: 'Recent', ko: '최근 소식' };

const clampTickerH = (v: unknown) => Math.min(360, Math.max(36, Math.round(Number(v)) || 72));

// 带配图的条目一律「图上字下」堆叠（不设高度阈值——默认 72px 也堆叠）
const tickerStacked = (t: TickerItem) => Boolean(t.image);

// 条目配图缩略：下缘拖拽调高，角标 × 移除
function TickerThumb({
  item,
  onPatch,
  onZoom,
}: {
  item: TickerItem;
  onPatch: (p: Partial<TickerItem>) => void;
  onZoom?: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hBadge, setHBadge] = useState<number | null>(null);
  const height = clampTickerH(item.imageHeight);

  const startDrag = (e: ReactPointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const img = imgRef.current;
    if (!img) return;
    const handle = e.currentTarget as HTMLElement;
    const startY = e.clientY;
    const startH = img.getBoundingClientRect().height;
    let latest = Math.round(startH);
    handle.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      latest = Math.min(360, Math.max(36, Math.round(startH + (ev.clientY - startY))));
      img.style.height = `${latest}px`;
      setHBadge(latest);
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      img.style.height = '';
      setHBadge(null);
      onPatch({ imageHeight: latest });
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  };

  return (
    <span className="tickerThumb">
      <img
        ref={imgRef}
        src={assetUrl(item.image ?? '')}
        alt=""
        style={{ height }}
        draggable={false}
        title="点击放大预览"
        onClick={(e) => {
          e.stopPropagation();
          onZoom?.();
        }}
      />
      <span className="tickerThumbGrip" title="拖动调整图片大小" onPointerDown={startDrag} />
      <button
        type="button"
        className="tickerThumbX"
        title="移除配图"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          onPatch({ image: '' });
        }}
      >
        <X size={10} />
      </button>
      {hBadge !== null && <span className="tickerThumbBadge">{hBadge}px</span>}
    </span>
  );
}

function TickerStrip({
  content,
  locale,
  onOpenImages,
}: {
  content: SiteContent;
  locale: Locale;
  onOpenImages: (images: string[], index: number, captions?: string[]) => void;
}) {
  const edit = useEdit();
  const items = content.profile.ticker ?? [];
  const label = content.profile.tickerLabel ?? defaultTickerLabel;
  if (!edit && items.filter((t) => plainText(t.text[locale]).trim() || t.image).length === 0) return null;

  const setTicker = (next: TickerItem[]) => edit?.set((c) => ({ ...c, profile: { ...c.profile, ticker: next } }));
  const addItem = (list: TickerItem[]) => [...list, { id: `ticker-${Date.now()}`, text: makeLocalizedText('') }];

  // 点图放大：弹窗里可左右翻所有带图条目，文字作为说明显示在大图下方
  const openZoom = (t: TickerItem) => {
    const withImg = items.filter((x) => x.image);
    const zi = withImg.findIndex((x) => x.id === t.id);
    onOpenImages(
      withImg.map((x) => x.image!),
      Math.max(0, zi),
      withImg.map((x) => x.text[locale])
    );
  };

  const labelNode = (
    <span className="tickerLabel">
      <Activity size={12} />
      <LT
        value={label}
        locale={locale}
        as="span"
        placeholder="近期内容"
        onChange={(v) =>
          edit?.set((c) => ({ ...c, profile: { ...c.profile, tickerLabel: setLT(c.profile.tickerLabel ?? defaultTickerLabel, locale, v) } }))
        }
      />
    </span>
  );

  if (edit) {
    return (
      <div className="tickerWrap editing">
        {labelNode}
        <div className="tickerEditList">
          {items.map((t) => {
            const patchItem = (p: Partial<TickerItem>) => setTicker(items.map((x) => (x.id === t.id ? { ...x, ...p } : x)));
            return (
              <span className={cx('tickerItem', t.image && 'withImg', tickerStacked(t) && 'stacked')} key={`${edit.session}:${locale}:${t.id}`}>
                {t.image ? <TickerThumb item={t} onPatch={patchItem} onZoom={() => openZoom(t)} /> : <span className="tickerDot" />}
                <EditableText
                  value={t.text[locale]}
                  placeholder="内容"
                  onChange={(v) => patchItem({ text: setLT(t.text, locale, v) })}
                  onEnter={(v) =>
                    setTicker(addItem(items.map((x) => (x.id === t.id ? { ...x, text: setLT(x.text, locale, v) } : x))))
                  }
                />
                <UploadButton
                  compact
                  folder={ASSET_FOLDERS.ticker}
                  label={t.image ? '更换配图' : '上传配图'}
                  icon={<ImagePlus size={12} />}
                  onUploaded={(p) => patchItem({ image: p })}
                />
                <button
                  type="button"
                  className="chipX"
                  title="删除条目"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setTicker(items.filter((x) => x.id !== t.id))}
                >
                  <X size={11} />
                </button>
              </span>
            );
          })}
          <button type="button" className="chipAdd" title="添加条目" onClick={() => setTicker(addItem(items))}>
            <Plus size={12} />
          </button>
        </div>
      </div>
    );
  }

  const visible = items.filter((t) => plainText(t.text[locale]).trim() || t.image);
  const loop = [...visible, ...visible];
  return (
    <div className="tickerWrap" style={{ '--tickerDur': `${Math.max(16, visible.length * 6)}s` } as CSSProperties}>
      {labelNode}
      <div className="tickerViewport">
        <div className="tickerTrack">
          {loop.map((t, i) => (
            <span className={cx('tickerItem', t.image && 'withImg', tickerStacked(t) && 'stacked')} key={`${t.id}-${i}`}>
              {t.image ? (
                <img
                  src={assetUrl(t.image)}
                  alt=""
                  style={{ height: clampTickerH(t.imageHeight) }}
                  loading="lazy"
                  draggable={false}
                  title="点击放大"
                  onClick={() => openZoom(t)}
                />
              ) : (
                <span className="tickerDot" />
              )}
              {plainText(t.text[locale]).trim() !== '' && <RichText as="span" text={t.text[locale]} />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 技能 =====
function SkillsSection({ content, locale }: { content: SiteContent; locale: Locale }) {
  const edit = useEdit();
  // 分组没有 id，结构变化（增删/排序）时 +1 重挂，避免 index-key 下可编辑文本错位
  const [ver, bump] = useReducer((x: number) => x + 1, 0);
  const groups = content.skills.groups;
  const setGroups = (next: SiteContent['skills']['groups']) => edit?.set((c) => ({ ...c, skills: { ...c.skills, groups: next } }));
  // 注意基于最新状态合并：Chips 增删会连续回调 onChange + onColors 两次，
  // 若基于渲染闭包的 groups 计算，第二次会覆盖第一次
  const patchGroup = (i: number, p: Partial<SiteContent['skills']['groups'][number]>) =>
    edit?.set((c) => ({
      ...c,
      skills: { ...c.skills, groups: c.skills.groups.map((g, gi) => (gi === i ? { ...g, ...p } : g)) },
    }));
  return (
    <CollapsibleSection
      id="skills"
      icon={<BookOpen size={17} />}
      titleNode={
        <LT
          value={content.skills.title}
          locale={locale}
          as="h2"
          placeholder="板块标题"
          onChange={(v) => edit?.set((c) => ({ ...c, skills: { ...c.skills, title: setLT(c.skills.title, locale, v) } }))}
        />
      }
    >
      <div className="skillGrid">
        {groups.map((group, i) => (
          <article className={cx('skillPanel', toneClass(group.theme || undefined))} key={`${ver}:${i}`}>
            {edit && (
              <ItemToolbar
                index={i}
                total={groups.length}
                deleteLabel={`技能组「${plainText(group.name[locale])}」`}
                onMove={(dir) => {
                  bump();
                  setGroups(moveIn(groups, i, dir));
                }}
                onDelete={() => {
                  bump();
                  setGroups(groups.filter((_, x) => x !== i));
                }}
              />
            )}
            <LT
              value={group.name}
              locale={locale}
              as="h3"
              placeholder="分组名"
              onChange={(v) => patchGroup(i, { name: setLT(group.name, locale, v) })}
            />
            <Chips
              items={group.items}
              colors={group.itemColors}
              onChange={edit ? (items) => patchGroup(i, { items }) : undefined}
              onColors={edit ? (itemColors) => patchGroup(i, { itemColors }) : undefined}
            />
            {edit && (
              <div className="panelThemeRow">
                <span className="panelThemeLabel">大框配色</span>
                <ThemeDots value={group.theme ?? ''} onPick={(k) => patchGroup(i, { theme: k })} />
              </div>
            )}
          </article>
        ))}
        {edit && (
          <AddGhost
            className="card"
            label="添加技能组"
            onClick={() => {
              bump();
              setGroups([...groups, { name: makeLocalizedText('新技能组'), items: [], theme: '', itemColors: [] }]);
            }}
          />
        )}
      </div>
    </CollapsibleSection>
  );
}

// ===== 主要经历 =====
/** 像素高度钳制：范围内取整，非法回落默认 */
const clampH = (v: unknown, def: number, min: number, max: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= min && n <= max ? n : def;
};

function newTimelineProject(n: number): TimelineProject {
  return {
    id: `timeline-project-${Date.now()}`,
    title: makeLocalizedText(`项目 ${n}`),
    period: '2026',
    summary: makeLocalizedText('项目简介'),
    images: [],
    stack: ['AI'],
    role: makeLocalizedText('负责内容'),
    outcome: makeLocalizedText('项目成果'),
    details: [makeLocalizedText('细节描述')],
  };
}

function ExperienceSection({
  content,
  locale,
  onOpenImages,
}: {
  content: SiteContent;
  locale: Locale;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  const projects = content.timelineProjects;
  return (
    <CollapsibleSection id="experience" icon={<BriefcaseBusiness size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="experience" />}>
      <div className="experienceList">
        {projects.map((project, i) => (
          <TimelineProjectCard
            key={project.id}
            content={content}
            project={project}
            index={i}
            total={projects.length}
            locale={locale}
            onOpenImages={onOpenImages}
          />
        ))}
        {edit && (
          <AddGhost
            className="card"
            label="添加项目经历"
            onClick={() =>
              edit.set((c) => ({ ...c, timelineProjects: [...c.timelineProjects, newTimelineProject(c.timelineProjects.length + 1)] }))
            }
          />
        )}
      </div>
    </CollapsibleSection>
  );
}

function TimelineProjectCard({
  content,
  project,
  index,
  total,
  locale,
  onOpenImages,
}: {
  content: SiteContent;
  project: TimelineProject;
  index: number;
  total: number;
  locale: Locale;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  const patch = (p: Partial<TimelineProject>) => edit?.set((c) => ({ ...c, timelineProjects: updIn(c.timelineProjects, project.id, p) }));
  const widthPct = clampWidthPct(project.widthPct, 100);
  const { cardRef, wBadge, startResize } = useWidthDrag(widthPct, (w) => patch({ widthPct: w }));
  return (
    <article ref={cardRef} className={cx('projectPanel', wBadge !== null && 'resizing')} style={{ '--w': widthPct } as CSSProperties}>
      {edit && (
        <ItemToolbar
          index={index}
          total={total}
          deleteLabel={`项目「${plainText(project.title[locale])}」`}
          onMove={(dir) => edit.set((c) => ({ ...c, timelineProjects: moveIn(c.timelineProjects, index, dir) }))}
          onDelete={() => edit.set((c) => ({ ...c, timelineProjects: c.timelineProjects.filter((p) => p.id !== project.id) }))}
          buttons={[
            {
              icon: <ImagePlus size={14} />,
              title: '管理项目图片',
              onClick: () => edit.openDrawer({ type: 'timeline-media', id: project.id }),
            },
          ]}
        />
      )}
      <div className="projectHead">
        <S value={project.period} as="small" placeholder="时间段" onChange={(v) => patch({ period: v })} />
        <LT value={project.title} locale={locale} as="strong" placeholder="项目名称" onChange={(v) => patch({ title: setLT(project.title, locale, v) })} />
      </div>
      <div className="projectBody">
        <LT
          rich
          value={project.summary}
          locale={locale}
          as="p"
          placeholder="项目简介"
          onChange={(v) => patch({ summary: setLT(project.summary, locale, v) })}
        />
        {project.images.length > 0 ? (
          <ProjectImageStrip
            images={project.images}
            title={plainText(project.title[locale])}
            height={clampH(project.imageHeight, 220, 120, 560)}
            onOpen={(idx) => (edit ? edit.openDrawer({ type: 'timeline-media', id: project.id }) : onOpenImages(project.images, idx))}
            onHeight={edit ? (h) => patch({ imageHeight: h }) : undefined}
          />
        ) : (
          edit && <AddGhost className="row" label="添加项目图片" onClick={() => edit.openDrawer({ type: 'timeline-media', id: project.id })} />
        )}
        <div className="detailGrid">
          <div className="infoPill">
            <span>
              <UIText content={content} locale={locale} k="pillStack" />
            </span>
            <Chips
              className="pillChips"
              items={project.stack}
              colors={project.stackColors}
              onChange={edit ? (stack) => patch({ stack }) : undefined}
              onColors={edit ? (stackColors) => patch({ stackColors }) : undefined}
            />
          </div>
          <InfoPill label={<UIText content={content} locale={locale} k="pillRole" />}>
            <LT value={project.role} locale={locale} as="p" placeholder="职责" onChange={(v) => patch({ role: setLT(project.role, locale, v) })} />
          </InfoPill>
          <InfoPill label={<UIText content={content} locale={locale} k="pillOutcome" />}>
            <LT value={project.outcome} locale={locale} as="p" placeholder="成果" onChange={(v) => patch({ outcome: setLT(project.outcome, locale, v) })} />
          </InfoPill>
        </div>
        <LTList items={project.details} locale={locale} as="ul" className="projectDetails" addLabel="添加细节" onChange={edit ? (details) => patch({ details }) : undefined} />
      </div>
      {edit && <CardWidthHandle start={startResize} reset={() => patch({ widthPct: 100 })} />}
      {wBadge !== null && <span className="resizeBadge">{wBadge}%</span>}
    </article>
  );
}

// 项目图片模块：每格宽度按图片真实比例自适应（同一高度下横图宽、竖图窄），
// 横向滚动；留边时同图模糊铺底。编辑态可拖图片区下缘调高度（与卡片宽度互不影响）。
function ProjectImageStrip({
  images,
  title,
  height,
  onOpen,
  onHeight,
}: {
  images: string[];
  title: string;
  height: number;
  onOpen: (index: number) => void;
  onHeight?: (h: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [badge, setBadge] = useState<number | null>(null);
  return (
    <div className="imageStripWrap" ref={wrapRef} style={{ '--imgH': `${height}px` } as CSSProperties}>
      <div className={cx('imageStrip', images.length === 1 && 'single')}>
        {images.map((src, i) => (
          <button type="button" className="imageStripItem" key={`${src}-${i}`} onClick={() => onOpen(i)} aria-label={`${title} 图片 ${i + 1}`}>
            <BlurFill src={src} />
            <img src={assetUrl(src)} alt={`${title} ${i + 1}`} loading="lazy" draggable={false} />
          </button>
        ))}
      </div>
      {onHeight && (
        <span
          className="resizeHandle"
          title="拖动调整图片高度 · 双击恢复 220px"
          onPointerDown={(e) =>
            dragVertical(e, {
              start: height,
              min: 120,
              max: 560,
              onLive: (v) => {
                wrapRef.current?.style.setProperty('--imgH', `${v}px`);
                setBadge(v);
              },
              onEnd: (v) => {
                wrapRef.current?.style.removeProperty('--imgH');
                setBadge(null);
                onHeight(v);
              },
            })
          }
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onHeight(220);
          }}
        />
      )}
      {badge !== null && <span className="resizeBadge">{badge}px</span>}
    </div>
  );
}

// ===== 看图 lightbox =====
function Lightbox({
  images,
  index,
  captions,
  onClose,
  onIndex,
}: {
  images: string[];
  index: number;
  /** 与 images 对应的说明文字（HTML），显示在大图下方（如近期内容的条目文字） */
  captions?: string[];
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const count = images.length;
  const go = (delta: number) => onIndex((index + delta + count) % count);
  useLockBody(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndex((index + 1) % count);
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, count, onClose, onIndex]);

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" className="lightboxClose" onClick={onClose} aria-label="关闭">
        <X size={22} />
      </button>
      {count > 1 && (
        <button
          type="button"
          className="lightboxNav prev"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label="上一张"
        >
          <ChevronLeft size={26} />
        </button>
      )}
      <figure className="lightboxStage" onClick={(e) => e.stopPropagation()}>
        <img src={assetUrl(images[index])} alt={`图片 ${index + 1}`} />
        {captions && plainText(captions[index] ?? '').trim() !== '' && (
          <RichText as="p" className="lightboxCaption" text={captions[index]} />
        )}
        {count > 1 && (
          <figcaption className="lightboxCount">
            {index + 1} / {count}
          </figcaption>
        )}
      </figure>
      {count > 1 && (
        <button
          type="button"
          className="lightboxNav next"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label="下一张"
        >
          <ChevronRight size={26} />
        </button>
      )}
    </div>
  );
}

// ===== 学术画廊 =====
function newGalleryProject(n: number): GalleryProject {
  return {
    id: `academic-project-${Date.now()}`,
    title: { zh: `学术项目 ${n}`, en: `Academic Project ${n}`, ko: `학술 프로젝트 ${n}` },
    cover: '/assets/ppt-cover-01.svg',
    category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
    notes: [makeLocalizedText('简介'), makeLocalizedText('说明'), makeLocalizedText('成果')],
    stack: ['AI', 'Research'],
    role: makeLocalizedText('负责内容'),
    result: makeLocalizedText('项目成果'),
    description: makeLocalizedText('项目描述'),
  };
}

function GallerySection({
  content,
  locale,
  onOpenModal,
}: {
  content: SiteContent;
  locale: Locale;
  onOpenModal: (id: string) => void;
}) {
  const edit = useEdit();
  // 编辑态显示全部（隐藏的半透明可复原）；公开页过滤掉 hidden
  const projects = edit ? content.galleryProjects : content.galleryProjects.filter((p) => p.hidden !== true);
  return (
    <CollapsibleSection id="gallery" icon={<Sparkles size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="gallery" />}>
      <div className="academicGallery">
        {projects.map((project, i) => (
          <GalleryCard
            key={project.id}
            content={content}
            project={project}
            index={i}
            total={projects.length}
            locale={locale}
            onOpenModal={onOpenModal}
          />
        ))}
        {edit && (
          <AddGhost
            className="card tall"
            label="添加学术项目"
            onClick={() => edit.set((c) => ({ ...c, galleryProjects: [...c.galleryProjects, newGalleryProject(c.galleryProjects.length + 1)] }))}
          />
        )}
      </div>
    </CollapsibleSection>
  );
}

function GalleryCard({
  content,
  project,
  index,
  total,
  locale,
  onOpenModal,
}: {
  content: SiteContent;
  project: GalleryProject;
  index: number;
  total: number;
  locale: Locale;
  onOpenModal: (id: string) => void;
}) {
  const edit = useEdit();
  const patch = (p: Partial<GalleryProject>) => edit?.set((c) => ({ ...c, galleryProjects: updIn(c.galleryProjects, project.id, p) }));
  const widthPct = clampWidthPct(project.widthPct, 33.3);
  const { cardRef, wBadge, startResize } = useWidthDrag(widthPct, (w) => patch({ widthPct: w }));
  const coverH = clampH(project.coverHeight, 200, 120, 520);
  const coverRef = useRef<HTMLDivElement>(null);
  const [coverBadge, setCoverBadge] = useState<number | null>(null);
  const hidden = project.hidden === true;
  return (
    <article
      ref={cardRef}
      className={cx('galleryCard', !edit && 'clickable', wBadge !== null && 'resizing', edit && hidden && 'isHidden')}
      style={{ '--w': widthPct } as CSSProperties}
      onClick={!edit ? () => onOpenModal(project.id) : undefined}
    >
      {edit && (
        <ItemToolbar
          index={index}
          total={total}
          deleteLabel={`学术项目「${plainText(project.title[locale])}」`}
          onMove={(dir) => edit.set((c) => ({ ...c, galleryProjects: moveIn(c.galleryProjects, index, dir) }))}
          onDelete={() => edit.set((c) => ({ ...c, galleryProjects: c.galleryProjects.filter((p) => p.id !== project.id) }))}
          buttons={[
            { icon: <ImagePlus size={14} />, title: '更换封面', onClick: () => edit.openDrawer({ type: 'gallery-cover', id: project.id }) },
            { icon: <Maximize2 size={14} />, title: '编辑详情弹窗内容', onClick: () => onOpenModal(project.id) },
            {
              icon: hidden ? <Eye size={14} /> : <EyeOff size={14} />,
              title: hidden ? '恢复对访客展示' : '对访客隐藏（编辑页仍可见，可随时恢复）',
              onClick: () => patch({ hidden: !hidden }),
            },
          ]}
        />
      )}
      {edit && hidden && (
        <span className="hiddenBadge">
          <EyeOff size={11} /> 已对访客隐藏
        </span>
      )}
      <div className="galleryCover" ref={coverRef} style={{ '--coverH': `${coverH}px` } as CSSProperties}>
        {project.cover && <BlurFill src={project.cover} />}
        <img src={assetUrl(project.cover)} alt={plainText(project.title[locale])} loading="lazy" draggable={false} />
        {/* 编辑态也渲染：角标文字本身可就地编辑（body[data-editing] 下常显） */}
        <span className="galleryMore">
          <Maximize2 size={13} /> <UIText content={content} locale={locale} k="galleryMore" />
        </span>
        {edit && (
          <span
            className="resizeHandle"
            title="拖动调整封面高度 · 双击恢复 200px"
            onPointerDown={(e) =>
              dragVertical(e, {
                start: coverH,
                min: 120,
                max: 520,
                onLive: (v) => {
                  coverRef.current?.style.setProperty('--coverH', `${v}px`);
                  setCoverBadge(v);
                },
                onEnd: (v) => {
                  coverRef.current?.style.removeProperty('--coverH');
                  setCoverBadge(null);
                  patch({ coverHeight: v });
                },
              })
            }
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => {
              e.stopPropagation();
              patch({ coverHeight: 200 });
            }}
          />
        )}
        {coverBadge !== null && <span className="resizeBadge">{coverBadge}px</span>}
      </div>
      <div className="galleryCardBody">
        <LT
          value={project.category}
          locale={locale}
          as="p"
          className="galleryCategory"
          placeholder="分类"
          onChange={(v) => patch({ category: setLT(project.category, locale, v) })}
        />
        <LT value={project.title} locale={locale} as="h3" placeholder="项目名称" onChange={(v) => patch({ title: setLT(project.title, locale, v) })} />
        <LTList
          items={project.notes}
          locale={locale}
          as="div"
          className="galleryNotes"
          max={3}
          addLabel="添加说明"
          onChange={edit ? (notes) => patch({ notes }) : undefined}
        />
      </div>
      {edit && <CardWidthHandle start={startResize} reset={() => patch({ widthPct: 33.3 })} />}
      {wBadge !== null && <span className="resizeBadge">{wBadge}%</span>}
    </article>
  );
}

// 画廊详情弹窗：展示（并可就地编辑）此前从未露出的 description/role/result/stack
function GalleryModal({
  content,
  project,
  locale,
  onClose,
  onOpenImage,
}: {
  content: SiteContent;
  project: GalleryProject;
  locale: Locale;
  onClose: () => void;
  onOpenImage: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  useLockBody(true);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // lightbox 叠在详情弹窗上时，Esc 先只关 lightbox
      if (e.key === 'Escape' && !document.querySelector('.lightbox')) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const patch = (p: Partial<GalleryProject>) => edit?.set((c) => ({ ...c, galleryProjects: updIn(c.galleryProjects, project.id, p) }));
  const show = (lt: LocalizedText) => Boolean(edit) || plainText(lt[locale]).trim() !== '';

  return (
    <div className="modalOverlay" onClick={onClose} role="dialog" aria-modal="true">
      <article className="galleryModal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightboxClose inModal" onClick={onClose} aria-label="关闭">
          <X size={18} />
        </button>
        <div className="galleryModalCover" onClick={() => project.cover && onOpenImage([project.cover], 0)} title="点击看大图">
          {project.cover && <BlurFill src={project.cover} />}
          <img src={assetUrl(project.cover)} alt={plainText(project.title[locale])} />
        </div>
        <div className="galleryModalBody">
          <LT
            value={project.category}
            locale={locale}
            as="p"
            className="galleryCategory"
            placeholder="分类"
            onChange={(v) => patch({ category: setLT(project.category, locale, v) })}
          />
          <LT value={project.title} locale={locale} as="h3" placeholder="项目名称" onChange={(v) => patch({ title: setLT(project.title, locale, v) })} />
          {show(project.description) && (
            <LT
              rich
              value={project.description}
              locale={locale}
              as="p"
              className="modalDesc"
              placeholder="项目描述"
              onChange={(v) => patch({ description: setLT(project.description, locale, v) })}
            />
          )}
          <LTList items={project.notes} locale={locale} as="div" className="galleryNotes" addLabel="添加说明" onChange={edit ? (notes) => patch({ notes }) : undefined} />
          <div className="modalPills">
            {show(project.role) && (
              <InfoPill label={<UIText content={content} locale={locale} k="pillRole" />}>
                <LT value={project.role} locale={locale} as="p" placeholder="职责" onChange={(v) => patch({ role: setLT(project.role, locale, v) })} />
              </InfoPill>
            )}
            {show(project.result) && (
              <InfoPill label={<UIText content={content} locale={locale} k="pillOutcome" />}>
                <LT value={project.result} locale={locale} as="p" placeholder="成果" onChange={(v) => patch({ result: setLT(project.result, locale, v) })} />
              </InfoPill>
            )}
          </div>
          <Chips items={project.stack} onChange={edit ? (stack) => patch({ stack }) : undefined} />
        </div>
      </article>
    </div>
  );
}

// ===== 近期研究方向 =====
function newResearchItem(): ResearchItem {
  return {
    id: `research-${Date.now()}`,
    kind: '论文',
    title: makeLocalizedText('新条目'),
    link: '',
    note: makeLocalizedText(''),
    image: '',
    pdf: '',
    imageMode: 'auto',
    imageHeight: 190,
  };
}

const KIND_PALETTE = ['#6fd7c6', '#f2c46d', '#a9a3ff', '#ff9b9b', '#8fd0ff'];
function kindStyle(kind: string): CSSProperties {
  let h = 0;
  for (const ch of kind) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const c = KIND_PALETTE[h % KIND_PALETTE.length];
  return { color: c, background: `color-mix(in srgb, ${c} 15%, transparent)` };
}

function ResearchSection({
  content,
  locale,
  onOpenImages,
}: {
  content: SiteContent;
  locale: Locale;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  const items = content.recentResearch;
  if (!edit && items.length === 0) return null;
  return (
    <CollapsibleSection id="research" icon={<FlaskConical size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="research" />}>
      <div className="researchGrid">
        {items.map((item, i) => (
          <ResearchCard key={item.id} item={item} index={i} total={items.length} locale={locale} onOpenImages={onOpenImages} />
        ))}
        {edit && (
          <AddGhost
            className="card"
            label="添加条目（论文 / 博客 / 项目）"
            onClick={() => edit.set((c) => ({ ...c, recentResearch: [...c.recentResearch, newResearchItem()] }))}
          />
        )}
      </div>
    </CollapsibleSection>
  );
}

function ResearchCard({
  item,
  index,
  total,
  locale,
  onOpenImages,
}: {
  item: ResearchItem;
  index: number;
  total: number;
  locale: Locale;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  const patch = (p: Partial<ResearchItem>) => edit?.set((c) => ({ ...c, recentResearch: updIn(c.recentResearch, item.id, p) }));
  const title = item.title[locale];
  const openMedia = edit ? () => edit.openDrawer({ type: 'research-media', id: item.id }) : undefined;

  // 像窗口一样横向拉卡片：拖右缘改行宽百分比
  const widthPct = clampWidthPct(item.widthPct, 50);
  const { cardRef, wBadge, startResize } = useWidthDrag(widthPct, (w) => patch({ widthPct: w }));

  return (
    <article ref={cardRef} className={cx('researchCard', wBadge !== null && 'resizing')} style={{ '--w': widthPct } as CSSProperties}>
      {edit && (
        <ItemToolbar
          index={index}
          total={total}
          deleteLabel={`条目「${plainText(title)}」`}
          onMove={(dir) => edit.set((c) => ({ ...c, recentResearch: moveIn(c.recentResearch, index, dir) }))}
          onDelete={() => edit.set((c) => ({ ...c, recentResearch: c.recentResearch.filter((r) => r.id !== item.id) }))}
          buttons={[{ icon: <ImagePlus size={14} />, title: '配图 / PDF / 展示样式', onClick: () => edit.openDrawer({ type: 'research-media', id: item.id }) }]}
        />
      )}
      <ResearchMediaView item={item} onClick={openMedia ?? (item.image ? () => onOpenImages([item.image!], 0) : undefined)} />
      <div className="researchBody">
        <div className="researchTop">
          <span className="researchKind" style={kindStyle(plainText(item.kind) || '论文')}>
            <S value={item.kind} as="span" placeholder="类型" onChange={(v) => patch({ kind: v })} />
          </span>
          <span className="researchIcons">
            {item.pdf &&
              (edit ? (
                <button type="button" className="researchLink" title="PDF（点击进设置）" onClick={openMedia}>
                  <FileText size={15} />
                </button>
              ) : (
                <a className="researchLink" href={assetUrl(item.pdf)} target="_blank" rel="noreferrer" title="打开 PDF">
                  <FileText size={15} />
                </a>
              ))}
            {edit ? (
              <button type="button" className="researchLink" title="设置外部链接" onClick={openMedia}>
                <ExternalLink size={15} />
              </button>
            ) : (
              item.link && (
                <a className="researchLink" href={item.link} target="_blank" rel="noreferrer" aria-label="打开链接">
                  <ExternalLink size={15} />
                </a>
              )
            )}
          </span>
        </div>
        <h3 className="researchTitle">
          {edit ? (
            <LT value={item.title} locale={locale} as="span" placeholder="标题" onChange={(v) => patch({ title: setLT(item.title, locale, v) })} />
          ) : item.link ? (
            <a href={item.link} target="_blank" rel="noreferrer">
              <RichText as="span" text={title} />
            </a>
          ) : (
            <RichText as="span" text={title} />
          )}
        </h3>
        {(edit || item.note[locale]) && (
          <LT
            rich
            value={item.note}
            locale={locale}
            as="p"
            className="researchNote"
            placeholder="备注 / 收获"
            onChange={(v) => patch({ note: setLT(item.note, locale, v) })}
          />
        )}
      </div>
      {edit && <CardWidthHandle start={startResize} reset={() => patch({ widthPct: 50 })} />}
      {wBadge !== null && <span className="resizeBadge">{wBadge}%</span>}
    </article>
  );
}

// ===== 公共小组件 =====
function InfoPill({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="infoPill">
      <span>{label}</span>
      {children}
    </div>
  );
}

function InfoGrid({
  modules,
  locale,
  listKey,
  addLabel,
  onOpenImages,
}: {
  modules: InfoModule[];
  locale: Locale;
  listKey: 'courses' | 'major';
  addLabel: string;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  // 专业介绍：卡片可拖宽（自由宽度布局）+ 支持配图；课程保持三列网格
  const media = listKey === 'major';
  const setList = (next: InfoModule[]) => edit?.set((c) => ({ ...c, [listKey]: next } as SiteContent));
  const patchIn = (id: string, p: Partial<InfoModule>) =>
    edit?.set((c) => ({ ...c, [listKey]: updIn(c[listKey], id, p) } as SiteContent));
  // 基于最新模块状态计算补丁：上传等异步回调不能用渲染闭包里的旧数组整组覆盖
  const patchWithIn = (id: string, fn: (cur: InfoModule) => Partial<InfoModule>) =>
    edit?.set((c) => ({ ...c, [listKey]: c[listKey].map((x) => (x.id === id ? { ...x, ...fn(x) } : x)) } as SiteContent));
  return (
    <div className={cx('infoGrid', media && 'freeGrid')}>
      {modules.map((m, i) => (
        <InfoCard
          key={m.id}
          m={m}
          index={i}
          total={modules.length}
          locale={locale}
          media={media}
          setList={setList}
          modules={modules}
          patch={(p) => patchIn(m.id, p)}
          patchWith={(fn) => patchWithIn(m.id, fn)}
          onOpenImages={onOpenImages}
        />
      ))}
      {edit && (
        <AddGhost
          className="card"
          label={addLabel}
          onClick={() =>
            setList([...modules, { id: `${listKey}-${Date.now()}`, title: makeLocalizedText('新模块'), body: makeLocalizedText('描述'), tags: [] }])
          }
        />
      )}
    </div>
  );
}

function InfoCard({
  m,
  index,
  total,
  locale,
  media,
  modules,
  setList,
  patch,
  patchWith,
  onOpenImages,
}: {
  m: InfoModule;
  index: number;
  total: number;
  locale: Locale;
  media: boolean;
  modules: InfoModule[];
  setList: (next: InfoModule[]) => void;
  patch: (p: Partial<InfoModule>) => void;
  patchWith: (fn: (cur: InfoModule) => Partial<InfoModule>) => void;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  const widthPct = clampWidthPct(m.widthPct, 33.3);
  const { cardRef, wBadge, startResize } = useWidthDrag(widthPct, (w) => patch({ widthPct: w }));
  return (
    <article
      ref={cardRef}
      className={cx('infoCard', media && wBadge !== null && 'resizing')}
      style={media ? ({ '--w': widthPct } as CSSProperties) : undefined}
    >
      {edit && (
        <ItemToolbar
          index={index}
          total={total}
          deleteLabel={`「${plainText(m.title[locale])}」`}
          onMove={(dir) => setList(moveIn(modules, index, dir))}
          onDelete={() => setList(modules.filter((x) => x.id !== m.id))}
        />
      )}
      <LT value={m.title} locale={locale} as="h3" placeholder="标题" onChange={(v) => patch({ title: setLT(m.title, locale, v) })} />
      <LT rich value={m.body} locale={locale} as="p" placeholder="描述" onChange={(v) => patch({ body: setLT(m.body, locale, v) })} />
      {media && <InfoMedia m={m} patch={patch} patchWith={patchWith} onOpenImages={onOpenImages} />}
      <Chips items={m.tags} onChange={edit ? (tags) => patch({ tags }) : undefined} />
      {edit && media && <CardWidthHandle start={startResize} reset={() => patch({ widthPct: 33.3 })} />}
      {media && wBadge !== null && <span className="resizeBadge">{wBadge}%</span>}
    </article>
  );
}

// 专业介绍配图：固定框高（可拖下缘调 120–520px），编辑态直接按住图片拖动做
// 「位移」——改 object-position 选取展示区域；公开页点击看大图
function InfoMedia({
  m,
  patch,
  patchWith,
  onOpenImages,
}: {
  m: InfoModule;
  patch: (p: Partial<InfoModule>) => void;
  patchWith: (fn: (cur: InfoModule) => Partial<InfoModule>) => void;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const edit = useEdit();
  const images = m.images ?? [];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [badge, setBadge] = useState<string | null>(null);
  const height = clampH(m.imageHeight, 200, 120, 520);

  // "x y" 百分比解析：缺失/空串回落居中（与序列化端默认一致），单值缺省补 50
  const parsePos = (raw: string | undefined) => {
    const s = (raw ?? '').trim();
    if (!s) return { x: 50, y: 50 };
    const parts = s.split(/[\s,]+/).map(Number);
    const c = (n: number) => (Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50);
    return { x: c(parts[0]), y: c(parts[1]) };
  };
  const posOf = (i: number) => parsePos(m.imagePos?.[i]);
  const posArrOf = (cur: InfoModule) => (cur.images ?? []).map((_, i) => {
    const p = parsePos(cur.imagePos?.[i]);
    return `${p.x} ${p.y}`;
  });
  const appendImage = (p: string) =>
    patchWith((cur) => ({ images: [...(cur.images ?? []), p], imagePos: [...posArrOf(cur), '50 50'] }));

  if (images.length === 0) {
    return edit ? (
      <div className="uploadRow">
        <UploadButton folder={ASSET_FOLDERS.major} label="上传配图" onUploaded={appendImage} />
      </div>
    ) : null;
  }

  const panStart = (e: ReactPointerEvent<HTMLImageElement>, i: number) => {
    if (!edit) return;
    e.preventDefault();
    e.stopPropagation();
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const start = posOf(i);
    const sx = e.clientX;
    const sy = e.clientY;
    let latest = start;
    let moved = false;
    img.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      moved = true;
      const dx = ((ev.clientX - sx) / Math.max(1, rect.width)) * 130;
      const dy = ((ev.clientY - sy) / Math.max(1, rect.height)) * 130;
      const c = (n: number) => Math.min(100, Math.max(0, Math.round(n * 10) / 10));
      latest = { x: c(start.x - dx), y: c(start.y - dy) };
      img.style.objectPosition = `${latest.x}% ${latest.y}%`;
      setBadge(`位移 ${Math.round(latest.x)} · ${Math.round(latest.y)}`);
    };
    const onUp = () => {
      img.removeEventListener('pointermove', onMove);
      img.removeEventListener('pointerup', onUp);
      img.removeEventListener('pointercancel', onUp);
      setBadge(null);
      if (moved) {
        patchWith((cur) => {
          const next = posArrOf(cur);
          if (i < next.length) next[i] = `${latest.x} ${latest.y}`;
          return { imagePos: next };
        });
      }
    };
    img.addEventListener('pointermove', onMove);
    img.addEventListener('pointerup', onUp);
    img.addEventListener('pointercancel', onUp);
  };

  return (
    <div className="infoMedia" ref={wrapRef} style={{ '--infoH': `${height}px` } as CSSProperties}>
      {images.map((src, i) => {
        const p = posOf(i);
        return (
          <div
            className={cx('infoMediaItem', !edit && 'clickable')}
            key={`${src}-${i}`}
            role={!edit ? 'button' : undefined}
            title={edit ? '按住图片拖动可调整显示位置（位移）' : '点击看大图'}
            onClick={() => !edit && onOpenImages(images, i)}
          >
            <img
              src={assetUrl(src)}
              alt=""
              loading="lazy"
              draggable={false}
              style={{ objectPosition: `${p.x}% ${p.y}%` }}
              onPointerDown={(e) => panStart(e, i)}
            />
            {edit && (
              <button
                type="button"
                className="infoMediaX"
                title="移除该图"
                onClick={() =>
                  patchWith((cur) => ({
                    images: (cur.images ?? []).filter((_, xi) => xi !== i),
                    imagePos: posArrOf(cur).filter((_, xi) => xi !== i),
                  }))
                }
              >
                <X size={11} />
              </button>
            )}
          </div>
        );
      })}
      {edit && (
        <>
          <span className="infoMediaAdd">
            <UploadButton
              compact
              folder={ASSET_FOLDERS.major}
              label="继续上传配图"
              icon={<ImagePlus size={13} />}
              onUploaded={appendImage}
            />
          </span>
          <span
            className="resizeHandle"
            title="拖动调整图片框高度 · 双击恢复 200px"
            onPointerDown={(e) =>
              dragVertical(e, {
                start: height,
                min: 120,
                max: 520,
                onLive: (v) => {
                  wrapRef.current?.style.setProperty('--infoH', `${v}px`);
                  setBadge(`${v}px`);
                },
                onEnd: (v) => {
                  wrapRef.current?.style.removeProperty('--infoH');
                  setBadge(null);
                  patch({ imageHeight: v });
                },
              })
            }
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => {
              e.stopPropagation();
              patch({ imageHeight: 200 });
            }}
          />
        </>
      )}
      {badge !== null && <span className="resizeBadge">{badge}</span>}
    </div>
  );
}

function Footer({ content, locale }: { content: SiteContent; locale: Locale }) {
  const edit = useEdit();
  const plainName = plainText(content.profile.name).trim() || 'ZXEQzzg';
  return (
    <footer className="siteFooter reveal">
      <span>
        © {new Date().getFullYear()} {plainName}
      </span>
      <span className="footDot">·</span>
      <RichText as="span" text={content.profile.location[locale]} />
      <span className="footDot">·</span>
      <a href="https://github.com/ZXEQzzg" target="_blank" rel="noreferrer" onClick={edit ? (e) => e.preventDefault() : undefined}>
        <Github size={13} /> <UIText content={content} locale={locale} k="footGithub" />
      </a>
      <span className="footSpacer" />
      <span className="footMuted">
        <UIText content={content} locale={locale} k="footNote" />
      </span>
    </footer>
  );
}

// ===== Mount =====
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
