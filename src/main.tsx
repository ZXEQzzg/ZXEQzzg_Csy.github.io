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
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
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
import { assetUrl, makeLocalizedText } from './utils/editorUtils';
import {
  ASSET_FOLDERS,
  AddGhost,
  AdminEditor,
  CardWidthHandle,
  Chips,
  EditableText,
  ItemToolbar,
  LT,
  LTList,
  ResearchMediaView,
  S,
  SR,
  UploadButton,
  clampWidthPct,
  contentStorageKey,
  cx,
  moveIn,
  setLT,
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

// 把旧草稿补齐到最新结构：老的 localStorage 草稿缺 avatar / images / resume /
// recentResearch 新字段，不补齐编辑器会崩，所以入口统一 normalize。
function migrateContent(parsed: SiteContent): SiteContent {
  const content = parsed;
  if (content.profile) {
    if (typeof content.profile.avatar !== 'string') content.profile.avatar = '';
    if (typeof content.profile.mark !== 'string') content.profile.mark = 'AI';
    if (typeof content.profile.siteTitle !== 'string') content.profile.siteTitle = 'ZXEQzzg Csy Portfolio';
    const r = content.profile.resume;
    content.profile.resume = {
      images: Array.isArray(r?.images) ? r.images : [],
      pdf: typeof r?.pdf === 'string' ? r.pdf : '',
    };
  }
  if (Array.isArray(content.timelineProjects)) {
    content.timelineProjects = content.timelineProjects.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
    }));
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

// 进场渐显：仅公开页启用；编辑模式全部直接可见，避免打扰编辑
function useReveal(enabled: boolean) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 }
    );
    nodes.filter((el) => !el.classList.contains('in')).forEach((el) => io.observe(el));
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
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [galleryModalId, setGalleryModalId] = useState<string | null>(null);

  const sections = (Object.keys(sectionLabels) as SectionKey[]).filter(
    (s) => s !== 'research' || content.recentResearch.length > 0 || Boolean(edit)
  );
  const activeSection = useActiveSection(sections);
  useReveal(animate);

  const openLightbox = (images: string[], index: number) => setLightbox({ images, index });
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
                <FileText size={14} /> 目前简历 · CV
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
              {content.profile.resume.images.length > 0 && (
                <button
                  type="button"
                  className="resumeView"
                  onClick={() => (edit ? edit.openDrawer({ type: 'resume' }) : openLightbox(content.profile.resume.images, 0))}
                >
                  <Eye size={15} /> 查看简历
                </button>
              )}
              {content.profile.resume.pdf &&
                (edit ? (
                  <button type="button" className="resumeDownload" onClick={() => edit.openDrawer({ type: 'resume' })}>
                    <Download size={15} /> 下载 PDF 简历
                  </button>
                ) : (
                  <a className="resumeDownload" href={assetUrl(content.profile.resume.pdf)} download target="_blank" rel="noreferrer">
                    <Download size={15} /> 下载 PDF 简历
                  </a>
                ))}
              {edit && content.profile.resume.images.length === 0 && !content.profile.resume.pdf && (
                <AddGhost className="row" label="设置简历图片 / PDF" onClick={() => edit.openDrawer({ type: 'resume' })} />
              )}
            </section>
          )}

          <section className="microPanel">
            <div>
              <span>{secLT(content, 'experience')[locale]}</span>
              <strong>{content.timelineProjects.length}</strong>
            </div>
            <div>
              <span>{secLT(content, 'gallery')[locale]}</span>
              <strong>{content.galleryProjects.length}</strong>
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
                <span className="railLabel">{secLT(content, section)[locale]}</span>
              </a>
            ))}
          </nav>

          <div className="mainFlow">
            <section id="intro" className="introBand reveal">
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
              <TickerStrip content={content} locale={locale} />
            </section>

            <SkillsSection content={content} locale={locale} />
            <ExperienceSection content={content} locale={locale} onOpenImages={openLightbox} />
            <GallerySection content={content} locale={locale} onOpenModal={setGalleryModalId} />

            <section id="major" className="moduleSection reveal">
              <SectionHeading index={4} icon={<GraduationCap size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="major" />} />
              <InfoGrid modules={content.major} locale={locale} listKey="major" addLabel="添加专业模块" />
            </section>

            <section id="courses" className="moduleSection reveal">
              <SectionHeading index={5} icon={<BookOpen size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="courses" />} />
              <InfoGrid modules={content.courses} locale={locale} listKey="courses" addLabel="添加课程" />
            </section>

            <ResearchSection content={content} locale={locale} onOpenImages={openLightbox} />

            <Footer content={content} locale={locale} />
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndex={(index) => setLightbox({ images: lightbox.images, index })}
        />
      )}
      {galleryProject && (
        <GalleryModal project={galleryProject} locale={locale} onClose={() => setGalleryModalId(null)} onOpenImage={openLightbox} />
      )}
    </main>
  );
}

// ===== 左栏个人照片轮播（多张：箭头/滑动切换，公开页点击看大图） =====
function ProfilePhotos({ content, onOpen }: { content: SiteContent; onOpen: (images: string[], index: number) => void }) {
  const edit = useEdit();
  const avatars = (content.profile.avatars ?? (content.profile.avatar ? [content.profile.avatar] : [])).filter(Boolean);
  const count = avatars.length;
  const [idx, setIdx] = useState(0);
  const cur = count ? Math.min(idx, count - 1) : 0;
  const swipeStart = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const go = (delta: number) => setIdx((cur + delta + count) % count);

  return (
    <div
      className={cx('profilePhoto', edit && 'canEdit', count > 0 && 'hasPhoto')}
      role="button"
      title={edit ? '管理个人照片' : count ? '查看大图' : undefined}
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
      {count > 0 ? (
        <div className="photoViewport">
          <div className="photoTrack" style={{ transform: `translateX(-${cur * 100}%)` }}>
            {avatars.map((a, i) => (
              <img key={`${a}-${i}`} src={assetUrl(a)} alt={`个人照片 ${i + 1}`} loading={i === 0 ? undefined : 'lazy'} draggable={false} />
            ))}
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

const clampTickerH = (v: unknown) => Math.min(200, Math.max(36, Math.round(Number(v)) || 72));

// 条目配图缩略：下缘拖拽调高，角标 × 移除
function TickerThumb({ item, onPatch }: { item: TickerItem; onPatch: (p: Partial<TickerItem>) => void }) {
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
      latest = Math.min(200, Math.max(36, Math.round(startH + (ev.clientY - startY))));
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
      <img ref={imgRef} src={assetUrl(item.image ?? '')} alt="" style={{ height }} draggable={false} />
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

function TickerStrip({ content, locale }: { content: SiteContent; locale: Locale }) {
  const edit = useEdit();
  const items = content.profile.ticker ?? [];
  const label = content.profile.tickerLabel ?? defaultTickerLabel;
  if (!edit && items.filter((t) => t.text[locale].trim()).length === 0) return null;

  const setTicker = (next: TickerItem[]) => edit?.set((c) => ({ ...c, profile: { ...c.profile, ticker: next } }));
  const addItem = (list: TickerItem[]) => [...list, { id: `ticker-${Date.now()}`, text: makeLocalizedText('') }];

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
              <span className={cx('tickerItem', t.image && 'withImg')} key={`${edit.session}:${locale}:${t.id}`}>
                {t.image ? <TickerThumb item={t} onPatch={patchItem} /> : <span className="tickerDot" />}
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

  const visible = items.filter((t) => t.text[locale].trim() || t.image);
  const loop = [...visible, ...visible];
  return (
    <div className="tickerWrap" style={{ '--tickerDur': `${Math.max(16, visible.length * 6)}s` } as CSSProperties}>
      {labelNode}
      <div className="tickerViewport">
        <div className="tickerTrack">
          {loop.map((t, i) => (
            <span className={cx('tickerItem', t.image && 'withImg')} key={`${t.id}-${i}`}>
              {t.image ? (
                <img src={assetUrl(t.image)} alt="" style={{ height: clampTickerH(t.imageHeight) }} loading="lazy" draggable={false} />
              ) : (
                <span className="tickerDot" />
              )}
              {t.text[locale].trim() && <span>{t.text[locale]}</span>}
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
  return (
    <section id="skills" className="moduleSection reveal">
      <SectionHeading
        index={1}
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
      />
      <div className="skillGrid">
        {groups.map((group, i) => (
          <article className="skillPanel" key={`${ver}:${i}`}>
            {edit && (
              <ItemToolbar
                index={i}
                total={groups.length}
                deleteLabel={`技能组「${group.name[locale]}」`}
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
              onChange={(v) => setGroups(groups.map((g, gi) => (gi === i ? { ...g, name: setLT(g.name, locale, v) } : g)))}
            />
            <Chips items={group.items} onChange={edit ? (items) => setGroups(groups.map((g, gi) => (gi === i ? { ...g, items } : g))) : undefined} />
          </article>
        ))}
        {edit && (
          <AddGhost
            className="card"
            label="添加技能组"
            onClick={() => {
              bump();
              setGroups([...groups, { name: makeLocalizedText('新技能组'), items: [] }]);
            }}
          />
        )}
      </div>
    </section>
  );
}

// ===== 主要经历 =====
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
    <section id="experience" className="moduleSection reveal">
      <SectionHeading index={2} icon={<BriefcaseBusiness size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="experience" />} />
      <div className="experienceList">
        {projects.map((project, i) => (
          <TimelineProjectCard key={project.id} project={project} index={i} total={projects.length} locale={locale} onOpenImages={onOpenImages} />
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
    </section>
  );
}

function TimelineProjectCard({
  project,
  index,
  total,
  locale,
  onOpenImages,
}: {
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
          deleteLabel={`项目「${project.title[locale]}」`}
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
            title={project.title[locale]}
            onOpen={(idx) => (edit ? edit.openDrawer({ type: 'timeline-media', id: project.id }) : onOpenImages(project.images, idx))}
          />
        ) : (
          edit && <AddGhost className="row" label="添加项目图片" onClick={() => edit.openDrawer({ type: 'timeline-media', id: project.id })} />
        )}
        <div className="detailGrid">
          <div className="infoPill">
            <span>Stack</span>
            <Chips className="pillChips" items={project.stack} onChange={edit ? (stack) => patch({ stack }) : undefined} />
          </div>
          <InfoPill label={locale === 'zh' ? '职责' : locale === 'ko' ? '역할' : 'Role'}>
            <LT value={project.role} locale={locale} as="p" placeholder="职责" onChange={(v) => patch({ role: setLT(project.role, locale, v) })} />
          </InfoPill>
          <InfoPill label={locale === 'zh' ? '成果' : locale === 'ko' ? '결과' : 'Outcome'}>
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

// 项目图片模块：横向自适应滚动条，点击放大（编辑模式点击进图片管理）
function ProjectImageStrip({ images, title, onOpen }: { images: string[]; title: string; onOpen: (index: number) => void }) {
  return (
    <div className={cx('imageStrip', images.length === 1 && 'single')}>
      {images.map((src, i) => (
        <button type="button" className="imageStripItem" key={`${src}-${i}`} onClick={() => onOpen(i)} aria-label={`${title} 图片 ${i + 1}`}>
          <img src={assetUrl(src)} alt={`${title} ${i + 1}`} loading="lazy" />
        </button>
      ))}
    </div>
  );
}

// ===== 看图 lightbox =====
function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: string[];
  index: number;
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
  const projects = content.galleryProjects;
  return (
    <section id="gallery" className="moduleSection reveal">
      <SectionHeading index={3} icon={<Sparkles size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="gallery" />} />
      <div className="academicGallery">
        {projects.map((project, i) => (
          <GalleryCard key={project.id} project={project} index={i} total={projects.length} locale={locale} onOpenModal={onOpenModal} />
        ))}
        {edit && (
          <AddGhost
            className="card tall"
            label="添加学术项目"
            onClick={() => edit.set((c) => ({ ...c, galleryProjects: [...c.galleryProjects, newGalleryProject(c.galleryProjects.length + 1)] }))}
          />
        )}
      </div>
    </section>
  );
}

function GalleryCard({
  project,
  index,
  total,
  locale,
  onOpenModal,
}: {
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
  return (
    <article
      ref={cardRef}
      className={cx('galleryCard', !edit && 'clickable', wBadge !== null && 'resizing')}
      style={{ '--w': widthPct } as CSSProperties}
      onClick={!edit ? () => onOpenModal(project.id) : undefined}
    >
      {edit && (
        <ItemToolbar
          index={index}
          total={total}
          deleteLabel={`学术项目「${project.title[locale]}」`}
          onMove={(dir) => edit.set((c) => ({ ...c, galleryProjects: moveIn(c.galleryProjects, index, dir) }))}
          onDelete={() => edit.set((c) => ({ ...c, galleryProjects: c.galleryProjects.filter((p) => p.id !== project.id) }))}
          buttons={[
            { icon: <ImagePlus size={14} />, title: '更换封面', onClick: () => edit.openDrawer({ type: 'gallery-cover', id: project.id }) },
            { icon: <Maximize2 size={14} />, title: '编辑详情弹窗内容', onClick: () => onOpenModal(project.id) },
          ]}
        />
      )}
      <div className="galleryCover">
        <img src={assetUrl(project.cover)} alt={project.title[locale]} loading="lazy" />
        {!edit && (
          <span className="galleryMore">
            <Maximize2 size={13} /> 查看详情
          </span>
        )}
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
  project,
  locale,
  onClose,
  onOpenImage,
}: {
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
  const show = (lt: LocalizedText) => Boolean(edit) || lt[locale].trim() !== '';

  return (
    <div className="modalOverlay" onClick={onClose} role="dialog" aria-modal="true">
      <article className="galleryModal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightboxClose inModal" onClick={onClose} aria-label="关闭">
          <X size={18} />
        </button>
        <div className="galleryModalCover" onClick={() => project.cover && onOpenImage([project.cover], 0)} title="点击看大图">
          <img src={assetUrl(project.cover)} alt={project.title[locale]} />
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
              <InfoPill label={locale === 'zh' ? '职责' : locale === 'ko' ? '역할' : 'Role'}>
                <LT value={project.role} locale={locale} as="p" placeholder="职责" onChange={(v) => patch({ role: setLT(project.role, locale, v) })} />
              </InfoPill>
            )}
            {show(project.result) && (
              <InfoPill label={locale === 'zh' ? '成果' : locale === 'ko' ? '결과' : 'Outcome'}>
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
    <section id="research" className="moduleSection reveal">
      <SectionHeading index={6} icon={<FlaskConical size={17} />} titleNode={<SectionTitleLT content={content} locale={locale} k="research" />} />
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
    </section>
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
          deleteLabel={`条目「${title}」`}
          onMove={(dir) => edit.set((c) => ({ ...c, recentResearch: moveIn(c.recentResearch, index, dir) }))}
          onDelete={() => edit.set((c) => ({ ...c, recentResearch: c.recentResearch.filter((r) => r.id !== item.id) }))}
          buttons={[{ icon: <ImagePlus size={14} />, title: '配图 / PDF / 展示样式', onClick: () => edit.openDrawer({ type: 'research-media', id: item.id }) }]}
        />
      )}
      <ResearchMediaView item={item} onClick={openMedia ?? (item.image ? () => onOpenImages([item.image!], 0) : undefined)} />
      <div className="researchBody">
        <div className="researchTop">
          <span className="researchKind" style={kindStyle(item.kind || '论文')}>
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
              {title}
            </a>
          ) : (
            title
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
function SectionHeading({ icon, title, titleNode, index }: { icon: ReactNode; title?: string; titleNode?: ReactNode; index: number }) {
  return (
    <div className="sectionHeading">
      <span className="headingIcon">{icon}</span>
      {titleNode ?? <h2>{title}</h2>}
      <span className="headingLine" aria-hidden="true" />
      <span className="secIndex">{String(index).padStart(2, '0')}</span>
    </div>
  );
}

function InfoPill({ label, children }: { label: string; children: ReactNode }) {
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
}: {
  modules: InfoModule[];
  locale: Locale;
  listKey: 'courses' | 'major';
  addLabel: string;
}) {
  const edit = useEdit();
  const setList = (next: InfoModule[]) => edit?.set((c) => ({ ...c, [listKey]: next } as SiteContent));
  return (
    <div className="infoGrid">
      {modules.map((m, i) => (
        <article className="infoCard" key={m.id}>
          {edit && (
            <ItemToolbar
              index={i}
              total={modules.length}
              deleteLabel={`「${m.title[locale]}」`}
              onMove={(dir) => setList(moveIn(modules, i, dir))}
              onDelete={() => setList(modules.filter((x) => x.id !== m.id))}
            />
          )}
          <LT value={m.title} locale={locale} as="h3" placeholder="标题" onChange={(v) => setList(updIn(modules, m.id, { title: setLT(m.title, locale, v) }))} />
          <LT rich value={m.body} locale={locale} as="p" placeholder="描述" onChange={(v) => setList(updIn(modules, m.id, { body: setLT(m.body, locale, v) }))} />
          <Chips items={m.tags} onChange={edit ? (tags) => setList(updIn(modules, m.id, { tags })) : undefined} />
        </article>
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

function Footer({ content, locale }: { content: SiteContent; locale: Locale }) {
  const plainName = content.profile.name.replace(/<[^>]+>/g, '').trim() || 'ZXEQzzg';
  return (
    <footer className="siteFooter reveal">
      <span>
        © {new Date().getFullYear()} {plainName}
      </span>
      <span className="footDot">·</span>
      <span>{content.profile.location[locale]}</span>
      <span className="footDot">·</span>
      <a href="https://github.com/ZXEQzzg" target="_blank" rel="noreferrer">
        <Github size={13} /> GitHub
      </a>
      <span className="footSpacer" />
      <span className="footMuted">Vite + React · GitHub Pages</span>
    </footer>
  );
}

// ===== Mount =====
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
