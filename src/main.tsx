import { StrictMode, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Github,
  Globe,
  Languages,
  Mail,
  Moon,
  PanelsTopLeft,
  Plus,
  Save,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  Send,
  AlertCircle,
  Eye,
  RefreshCw,
  X,
  User,
  Code,
  Image,
  GraduationCap,
} from 'lucide-react';
import {
  defaultContent,
  localeLabels,
  type GalleryProject,
  type Locale,
  type LocalizedText,
  type SiteContent,
  type ThemeMode,
  type TimelineProject,
  type InfoModule,
  type ProfileLink,
} from './data/siteContent';
import { assetUrl, makeLocalizedText, publishToGitHub, uploadImageToGitHub } from './utils/editorUtils';
import './styles.css';

const contentStorageKey = 'zxeqzzg-portfolio-content-draft';
const githubTokenKey = 'zxeqzzg-github-token';

type SectionKey = 'intro' | 'skills' | 'experience' | 'gallery' | 'courses' | 'major';

const sectionLabels: Record<SectionKey, Record<Locale, string>> = {
  intro: { zh: '个人介绍', en: 'Profile', ko: '소개' },
  skills: { zh: '技术栈', en: 'Stack', ko: '스택' },
  experience: { zh: '主要经历', en: 'Experience', ko: '주요 경력' },
  gallery: { zh: '学术驱动项目', en: 'Academic Gallery', ko: '학술 갤러리' },
  courses: { zh: '课程介绍', en: 'Courses', ko: '수업' },
  major: { zh: '专业介绍', en: 'Major', ko: '전공' },
};

// 把旧草稿补齐到最新结构：老的 localStorage 草稿没有 avatar / images 字段，
// 不补齐的话编辑器里 images.map / avatar 输入会炸，所以在入口统一 normalize。
function migrateContent(parsed: SiteContent): SiteContent {
  const content = parsed;
  if (content.profile && typeof content.profile.avatar !== 'string') {
    content.profile.avatar = '';
  }
  if (Array.isArray(content.timelineProjects)) {
    content.timelineProjects = content.timelineProjects.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
    }));
  }
  return content;
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

  if (isAdmin) {
    return (
      <AdminEditor
        content={content}
        locale={locale}
        theme={theme}
        setContent={setContent}
        setLocale={setLocale}
        setTheme={setTheme}
      />
    );
  }

  return <Portfolio content={content} locale={locale} theme={theme} setLocale={setLocale} setTheme={setTheme} />;
}

// ===== Portfolio =====
function Portfolio({
  content,
  locale,
  theme,
  setLocale,
  setTheme,
  adminTools,
}: {
  content: SiteContent;
  locale: Locale;
  theme: ThemeMode;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  adminTools?: ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<SectionKey>('intro');
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const sections = Object.keys(sectionLabels) as SectionKey[];

  const openLightbox = (images: string[], index: number) => setLightbox({ images, index });

  return (
    <main className="appShell">
      <aside className="sidebar">
        <div className="sidebarScroller">
          <div className="profilePhoto">
            {content.profile.avatar ? (
              <img src={assetUrl(content.profile.avatar)} alt={content.profile.name} />
            ) : (
              <div className="profilePhotoFallback">
                <User size={30} />
                <span>个人照片</span>
              </div>
            )}
          </div>

          <div className="identityBlock">
            <div className="mark">AI</div>
            <div>
              <p className="eyebrow">{content.profile.location[locale]}</p>
              <h1>{content.profile.name}</h1>
            </div>
          </div>

          <section className="profileCard">
            <p className="headline">{content.profile.headline[locale]}</p>
            <p>{content.profile.intro[locale]}</p>
            <p className="research">{content.profile.research[locale]}</p>
          </section>

          <section className="contactList">
            {content.profile.links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label === 'Email' ? (
                  <Mail size={16} />
                ) : link.label === 'GitHub' ? (
                  <Github size={16} />
                ) : (
                  <Globe size={16} />
                )}
                <span>{link.value}</span>
              </a>
            ))}
          </section>

          <section className="microPanel">
            <div>
              <span>{sectionLabels.experience[locale]}</span>
              <strong>{content.timelineProjects.length}</strong>
            </div>
            <div>
              <span>{sectionLabels.gallery[locale]}</span>
              <strong>{content.galleryProjects.length}</strong>
            </div>
          </section>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="titleDock">
            <PanelsTopLeft size={18} />
            <span>ZXEQzzg Csy Portfolio</span>
          </div>
          <div className="settingsDock">
            <div className="segmented" aria-label="Language selector">
              <Languages size={15} />
              {(Object.keys(localeLabels) as Locale[]).map((item) => (
                <button
                  key={item}
                  className={item === locale ? 'active' : ''}
                  onClick={() => setLocale(item)}
                  type="button"
                >
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

        {adminTools}

        <div className="contentGrid">
          <nav className="sectionRail" aria-label="Portfolio sections">
            {sections.map((section) => (
              <a
                key={section}
                className={activeSection === section ? 'active' : ''}
                href={`#${section}`}
                onMouseEnter={() => setActiveSection(section)}
                onFocus={() => setActiveSection(section)}
              >
                <span className="railDot" aria-hidden="true" />
                <span className="railLabel">{sectionLabels[section][locale]}</span>
              </a>
            ))}
          </nav>

          <div className="mainFlow">
            <section id="intro" className="introBand" onMouseEnter={() => setActiveSection('intro')}>
              <p className="eyebrow">
                <Sparkles size={14} /> {sectionLabels.intro[locale]}
              </p>
              <h2>{content.profile.headline[locale]}</h2>
              <p>{content.profile.intro[locale]}</p>
            </section>

            <section id="skills" className="moduleSection" onMouseEnter={() => setActiveSection('skills')}>
              <SectionHeading icon={<BookOpen size={18} />} title={content.skills.title[locale]} />
              <div className="skillGrid">
                {content.skills.groups.map((group) => (
                  <article className="skillPanel" key={group.name.en}>
                    <h3>{group.name[locale]}</h3>
                    <div className="tagCloud">
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="experience" className="moduleSection" onMouseEnter={() => setActiveSection('experience')}>
              <SectionHeading icon={<BriefcaseBusiness size={18} />} title={sectionLabels.experience[locale]} />
              <div className="experienceList">
                {content.timelineProjects.map((project) => (
                  <TimelineProjectCard
                    key={project.id}
                    project={project}
                    locale={locale}
                    onOpenImages={openLightbox}
                  />
                ))}
              </div>
            </section>

            <section id="gallery" className="moduleSection" onMouseEnter={() => setActiveSection('gallery')}>
              <SectionHeading icon={<Sparkles size={18} />} title={sectionLabels.gallery[locale]} />
              <GalleryGrid projects={content.galleryProjects} locale={locale} />
            </section>

            <section id="courses" className="moduleSection" onMouseEnter={() => setActiveSection('courses')}>
              <SectionHeading icon={<BookOpen size={18} />} title={sectionLabels.courses[locale]} />
              <InfoGrid modules={content.courses} locale={locale} />
            </section>

            <section id="major" className="moduleSection" onMouseEnter={() => setActiveSection('major')}>
              <SectionHeading icon={<Sparkles size={18} />} title={sectionLabels.major[locale]} />
              <InfoGrid modules={content.major} locale={locale} />
            </section>
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
    </main>
  );
}

// ===== Sub-components =====
function TimelineProjectCard({
  project,
  locale,
  onOpenImages,
}: {
  project: TimelineProject;
  locale: Locale;
  onOpenImages: (images: string[], index: number) => void;
}) {
  return (
    <article className="projectPanel">
      <div className="projectHead">
        <small>{project.period}</small>
        <strong>{project.title[locale]}</strong>
      </div>
      <div className="projectBody">
        <p>{project.summary[locale]}</p>
        {project.images && project.images.length > 0 && (
          <ProjectImageStrip
            images={project.images}
            title={project.title[locale]}
            onOpenImages={onOpenImages}
          />
        )}
        <div className="detailGrid">
          <InfoPill label="Stack" value={project.stack.join(' / ')} />
          <InfoPill
            label={locale === 'zh' ? '职责' : locale === 'ko' ? '역할' : 'Role'}
            value={project.role[locale]}
          />
          <InfoPill
            label={locale === 'zh' ? '成果' : locale === 'ko' ? '결과' : 'Outcome'}
            value={project.outcome[locale]}
          />
        </div>
        <ul>
          {project.details.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// 项目图片模块：横向自适应滚动条，点击任意图放大到看图 lightbox
function ProjectImageStrip({
  images,
  title,
  onOpenImages,
}: {
  images: string[];
  title: string;
  onOpenImages: (images: string[], index: number) => void;
}) {
  return (
    <div className={`imageStrip ${images.length === 1 ? 'single' : ''}`}>
      {images.map((src, i) => (
        <button
          type="button"
          className="imageStripItem"
          key={`${src}-${i}`}
          onClick={() => onOpenImages(images, i)}
          aria-label={`${title} 图片 ${i + 1}`}
        >
          <img src={assetUrl(src)} alt={`${title} ${i + 1}`} loading="lazy" />
        </button>
      ))}
    </div>
  );
}

// 看图 lightbox：遮罩全屏、左右切换、Esc/方向键、点击遮罩关闭
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

function GalleryGrid({ projects, locale }: { projects: GalleryProject[]; locale: Locale }) {
  return (
    <div className="academicGallery">
      {projects.map((project) => (
        <article className="galleryCard" key={project.id}>
          <img src={assetUrl(project.cover)} alt={project.title[locale]} loading="lazy" />
          <div className="galleryCardBody">
            <p className="galleryCategory">{project.category[locale]}</p>
            <h3>{project.title[locale]}</h3>
            <div className="galleryNotes">
              {project.notes.slice(0, 3).map((note) => (
                <p key={note.en}>{note[locale]}</p>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="sectionHeading">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="infoPill">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function InfoGrid({ modules, locale }: { modules: SiteContent['courses']; locale: Locale }) {
  return (
    <div className="infoGrid">
      {modules.map((module) => (
        <article className="infoCard" key={module.id}>
          <h3>{module.title[locale]}</h3>
          <p>{module.body[locale]}</p>
          <div className="tagCloud">
            {module.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

// ===== Editor helpers =====
type EditorTab = 'profile' | 'skills' | 'timeline' | 'gallery' | 'courses' | 'major' | 'publish';

// 选图直传到仓库 assets，成功后回调返回 /assets/xxx 路径
function ImageUploadButton({
  token,
  onUploaded,
  setStatus,
  label = '上传图片',
}: {
  token: string;
  onUploaded: (path: string) => void;
  setStatus: (status: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <label className={`fileButton ${busy ? 'busy' : ''}`}>
      {busy ? <RefreshCw size={14} className="spin" /> : <Upload size={14} />}
      <span>{busy ? ' 上传中...' : ` ${label}`}</span>
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          if (!token.trim()) {
            setStatus('请先到「发布」标签填入 GitHub Token，再上传图片');
            return;
          }
          setBusy(true);
          setStatus(`正在上传 ${file.name} ...`);
          const res = await uploadImageToGitHub(file, token.trim());
          setBusy(false);
          if (res.success && res.path) {
            onUploaded(res.path);
            setStatus(`图片已上传并填入：${res.path}`);
          } else {
            setStatus(res.message);
          }
        }}
      />
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="editorField">
      <span className="fieldLabel">{label}</span>
      {multiline ? (
        <textarea className="fieldInput" value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
      ) : (
        <input className="fieldInput" type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function LocalizedTextInput({
  label,
  value,
  locale,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedText;
  locale: Locale;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return <TextInput label={label} value={value[locale]} onChange={onChange} multiline={multiline} />;
}

function StringArrayEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="editorField">
      <span className="fieldLabel">{label}</span>
      <div className="stringArrayEditor">
        {items.map((item, i) => (
          <div key={i} className="stringArrayItem">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="fieldInput"
            />
            <button
              type="button"
              className="iconDangerButton"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              title="删除"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className="compactButton" onClick={() => onChange([...items, ''])}>
          <Plus size={14} /> 添加
        </button>
      </div>
    </div>
  );
}

function LocalizedTextArrayEditor({
  label,
  items,
  locale,
  onChange,
}: {
  label: string;
  items: LocalizedText[];
  locale: Locale;
  onChange: (items: LocalizedText[]) => void;
}) {
  return (
    <div className="editorField">
      <span className="fieldLabel">{label}</span>
      <div className="stringArrayEditor">
        {items.map((item, i) => (
          <div key={i} className="stringArrayItem">
            <input
              type="text"
              value={item[locale]}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, [locale]: e.target.value };
                onChange(next);
              }}
              className="fieldInput"
            />
            <button
              type="button"
              className="iconDangerButton"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              title="删除"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className="compactButton" onClick={() => onChange([...items, makeLocalizedText()])}>
          <Plus size={14} /> 添加
        </button>
      </div>
    </div>
  );
}

// ===== AdminEditor =====
function AdminEditor({
  content,
  locale,
  theme,
  setContent,
  setLocale,
  setTheme,
}: {
  content: SiteContent;
  locale: Locale;
  theme: ThemeMode;
  setContent: (content: SiteContent) => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
}) {
  const [status, setStatus] = useState('本地草稿尚未保存');
  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem(githubTokenKey) || '');
  const [isPublishing, setIsPublishing] = useState(false);

  function commit(nextContent: SiteContent, message = '已更新预览') {
    setContent(nextContent);
    setStatus(message);
  }

  function saveDraft() {
    localStorage.setItem(contentStorageKey, JSON.stringify(content));
    setStatus('草稿已保存在当前浏览器');
  }

  function resetDraft() {
    localStorage.removeItem(contentStorageKey);
    setContent(defaultContent);
    setStatus('已恢复默认内容');
  }

  async function handlePublish() {
    if (!githubToken.trim()) {
      setStatus('请先输入 GitHub Token');
      setActiveTab('publish');
      return;
    }
    setIsPublishing(true);
    setStatus('正在推送至 GitHub...');
    const result = await publishToGitHub(content, githubToken.trim());
    setStatus(result.message);
    setIsPublishing(false);
  }

  // --- Profile editors ---
  function updateProfileField(
    field: 'name' | 'avatar' | 'headline' | 'intro' | 'research' | 'location',
    value: string
  ) {
    if (field === 'name' || field === 'avatar') {
      commit({ ...content, profile: { ...content.profile, [field]: value } });
      return;
    }
    const fieldValue = content.profile[field as keyof typeof content.profile];
    if (typeof fieldValue === 'object' && fieldValue !== null && 'zh' in fieldValue) {
      commit({
        ...content,
        profile: { ...content.profile, [field]: { ...(fieldValue as LocalizedText), [locale]: value } },
      });
    }
  }

  function updateProfileLink(index: number, field: keyof ProfileLink, value: string) {
    const nextLinks = [...content.profile.links];
    nextLinks[index] = { ...nextLinks[index], [field]: value };
    commit({ ...content, profile: { ...content.profile, links: nextLinks } });
  }

  function addProfileLink() {
    commit({
      ...content,
      profile: {
        ...content.profile,
        links: [...content.profile.links, { label: 'New', value: '', href: '#' }],
      },
    });
  }

  function removeProfileLink(index: number) {
    commit({
      ...content,
      profile: { ...content.profile, links: content.profile.links.filter((_, i) => i !== index) },
    });
  }

  // --- Skills editors ---
  function updateSkillsTitle(value: string) {
    commit({
      ...content,
      skills: { ...content.skills, title: { ...content.skills.title, [locale]: value } },
    });
  }

  function updateSkillGroupName(index: number, value: string) {
    const nextGroups = [...content.skills.groups];
    nextGroups[index] = { ...nextGroups[index], name: { ...nextGroups[index].name, [locale]: value } };
    commit({ ...content, skills: { ...content.skills, groups: nextGroups } });
  }

  function updateSkillGroupItems(index: number, items: string[]) {
    const nextGroups = [...content.skills.groups];
    nextGroups[index] = { ...nextGroups[index], items };
    commit({ ...content, skills: { ...content.skills, groups: nextGroups } });
  }

  function addSkillGroup() {
    const index = content.skills.groups.length + 1;
    commit({
      ...content,
      skills: {
        ...content.skills,
        groups: [...content.skills.groups, { name: makeLocalizedText(`技能组 ${index}`), items: [] }],
      },
    });
  }

  function removeSkillGroup(index: number) {
    commit({
      ...content,
      skills: { ...content.skills, groups: content.skills.groups.filter((_, i) => i !== index) },
    });
  }

  // --- Timeline editors ---
  function addTimelineProject() {
    const index = content.timelineProjects.length + 1;
    const newProject: TimelineProject = {
      id: `timeline-project-${Date.now()}`,
      title: makeLocalizedText(`项目 ${index}`),
      period: '2024 - 2025',
      summary: makeLocalizedText('项目简介'),
      images: [],
      stack: ['React', 'TypeScript'],
      role: makeLocalizedText('负责内容'),
      outcome: makeLocalizedText('项目成果'),
      details: [makeLocalizedText('细节描述')],
    };
    commit({ ...content, timelineProjects: [...content.timelineProjects, newProject] }, '已添加新的项目经历');
  }

  function removeTimelineProject(id: string) {
    commit(
      { ...content, timelineProjects: content.timelineProjects.filter((p) => p.id !== id) },
      '已删除项目经历'
    );
  }

  function updateTimelineField(id: string, field: 'period' | 'stack' | 'images', value: any) {
    const nextProjects = content.timelineProjects.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    commit({ ...content, timelineProjects: nextProjects });
  }

  function updateTimelineLocalized(
    id: string,
    field: 'title' | 'summary' | 'role' | 'outcome',
    value: string
  ) {
    const nextProjects = content.timelineProjects.map((p) =>
      p.id === id ? { ...p, [field]: { ...p[field], [locale]: value } } : p
    );
    commit({ ...content, timelineProjects: nextProjects });
  }

  function updateTimelineDetails(id: string, details: LocalizedText[]) {
    const nextProjects = content.timelineProjects.map((p) => (p.id === id ? { ...p, details } : p));
    commit({ ...content, timelineProjects: nextProjects });
  }

  // --- Gallery editors ---
  function addGalleryProject() {
    const index = content.galleryProjects.length + 1;
    const newProject: GalleryProject = {
      id: `academic-project-${Date.now()}`,
      title: { zh: `学术项目 ${index}`, en: `Academic Project ${index}`, ko: `학술 프로젝트 ${index}` },
      cover: '/assets/ppt-cover-01.svg',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [makeLocalizedText('简介'), makeLocalizedText('说明'), makeLocalizedText('成果')],
      stack: ['AI', 'Research'],
      role: makeLocalizedText('负责内容'),
      result: makeLocalizedText('项目成果'),
      description: makeLocalizedText('项目描述'),
    };
    commit({ ...content, galleryProjects: [...content.galleryProjects, newProject] }, '已添加学术项目');
  }

  function removeGalleryProject(id: string) {
    commit(
      { ...content, galleryProjects: content.galleryProjects.filter((p) => p.id !== id) },
      '已删除学术项目'
    );
  }

  function updateGalleryField(id: string, field: 'cover' | 'stack', value: any) {
    const nextProjects = content.galleryProjects.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    commit({ ...content, galleryProjects: nextProjects });
  }

  function updateGalleryLocalized(
    id: string,
    field: 'title' | 'category' | 'role' | 'result' | 'description',
    value: string
  ) {
    const nextProjects = content.galleryProjects.map((p) =>
      p.id === id ? { ...p, [field]: { ...p[field], [locale]: value } } : p
    );
    commit({ ...content, galleryProjects: nextProjects });
  }

  function updateGalleryNotes(id: string, notes: LocalizedText[]) {
    const nextProjects = content.galleryProjects.map((p) => (p.id === id ? { ...p, notes } : p));
    commit({ ...content, galleryProjects: nextProjects });
  }

  // --- Courses editors ---
  function addCourse() {
    const index = content.courses.length + 1;
    const newCourse: InfoModule = {
      id: `course-${Date.now()}`,
      title: makeLocalizedText(`课程 ${index}`),
      body: makeLocalizedText('课程描述'),
      tags: ['AI', 'Design'],
    };
    commit({ ...content, courses: [...content.courses, newCourse] }, '已添加课程');
  }

  function removeCourse(id: string) {
    commit({ ...content, courses: content.courses.filter((c) => c.id !== id) }, '已删除课程');
  }

  function updateCourseField(id: string, field: 'title' | 'body', value: string) {
    const nextCourses = content.courses.map((c) =>
      c.id === id ? { ...c, [field]: { ...c[field], [locale]: value } } : c
    );
    commit({ ...content, courses: nextCourses });
  }

  function updateCourseTags(id: string, tags: string[]) {
    const nextCourses = content.courses.map((c) => (c.id === id ? { ...c, tags } : c));
    commit({ ...content, courses: nextCourses });
  }

  // --- Major editors ---
  function addMajor() {
    const index = content.major.length + 1;
    const newMajor: InfoModule = {
      id: `major-${Date.now()}`,
      title: makeLocalizedText(`专业模块 ${index}`),
      body: makeLocalizedText('专业描述'),
      tags: ['Machine Learning'],
    };
    commit({ ...content, major: [...content.major, newMajor] }, '已添加专业模块');
  }

  function removeMajor(id: string) {
    commit({ ...content, major: content.major.filter((m) => m.id !== id) }, '已删除专业模块');
  }

  function updateMajorField(id: string, field: 'title' | 'body', value: string) {
    const nextMajor = content.major.map((m) =>
      m.id === id ? { ...m, [field]: { ...m[field], [locale]: value } } : m
    );
    commit({ ...content, major: nextMajor });
  }

  function updateMajorTags(id: string, tags: string[]) {
    const nextMajor = content.major.map((m) => (m.id === id ? { ...m, tags } : m));
    commit({ ...content, major: nextMajor });
  }

  // --- Tab rendering ---
  const tabs: { key: EditorTab; label: string; icon: ReactNode }[] = [
    { key: 'profile', label: '个人介绍', icon: <User size={16} /> },
    { key: 'skills', label: '技术栈', icon: <Code size={16} /> },
    { key: 'timeline', label: '项目经历', icon: <BriefcaseBusiness size={16} /> },
    { key: 'gallery', label: '学术画廊', icon: <Image size={16} /> },
    { key: 'courses', label: '课程介绍', icon: <BookOpen size={16} /> },
    { key: 'major', label: '专业介绍', icon: <GraduationCap size={16} /> },
    { key: 'publish', label: '发布', icon: <Send size={16} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="editPanel">
            <h3>个人介绍</h3>
            <TextInput
              label="姓名"
              value={content.profile.name}
              onChange={(v) => updateProfileField('name', v)}
            />
            <div className="editorField">
              <span className="fieldLabel">个人照片（选图上传到仓库，或手动填 /assets/ 路径；留空显示占位框）</span>
              <div className="uploadRow">
                {content.profile.avatar ? (
                  <img className="uploadPreview" src={assetUrl(content.profile.avatar)} alt="照片预览" />
                ) : (
                  <div className="uploadPreview placeholder">
                    <User size={20} />
                  </div>
                )}
                <ImageUploadButton
                  token={githubToken}
                  setStatus={setStatus}
                  onUploaded={(p) => updateProfileField('avatar', p)}
                  label="上传照片"
                />
              </div>
            </div>
            <TextInput
              label="照片路径"
              value={content.profile.avatar}
              onChange={(v) => updateProfileField('avatar', v)}
            />
            <LocalizedTextInput
              label="标题"
              value={content.profile.headline}
              locale={locale}
              onChange={(v) => updateProfileField('headline', v)}
            />
            <LocalizedTextInput
              label="简介"
              value={content.profile.intro}
              locale={locale}
              onChange={(v) => updateProfileField('intro', v)}
              multiline
            />
            <LocalizedTextInput
              label="研究方向"
              value={content.profile.research}
              locale={locale}
              onChange={(v) => updateProfileField('research', v)}
              multiline
            />
            <LocalizedTextInput
              label="所在地"
              value={content.profile.location}
              locale={locale}
              onChange={(v) => updateProfileField('location', v)}
            />

            <div className="editorField">
              <span className="fieldLabel">联系方式</span>
              {content.profile.links.map((link, i) => (
                <div key={i} className="nestedEditor">
                  <TextInput label="标签" value={link.label} onChange={(v) => updateProfileLink(i, 'label', v)} />
                  <TextInput label="值" value={link.value} onChange={(v) => updateProfileLink(i, 'value', v)} />
                  <TextInput label="链接" value={link.href} onChange={(v) => updateProfileLink(i, 'href', v)} />
                  <button type="button" className="dangerButton" onClick={() => removeProfileLink(i)}>
                    <Trash2 size={14} /> 删除
                  </button>
                </div>
              ))}
              <button type="button" className="compactButton" onClick={addProfileLink}>
                <Plus size={14} /> 添加联系方式
              </button>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="editPanel">
            <h3>技术栈</h3>
            <LocalizedTextInput
              label="标题"
              value={content.skills.title}
              locale={locale}
              onChange={updateSkillsTitle}
            />
            {content.skills.groups.map((group, i) => (
              <div key={i} className="nestedEditor">
                <LocalizedTextInput
                  label="组名称"
                  value={group.name}
                  locale={locale}
                  onChange={(v) => updateSkillGroupName(i, v)}
                />
                <StringArrayEditor label="技能列表" items={group.items} onChange={(items) => updateSkillGroupItems(i, items)} />
                <button type="button" className="dangerButton" onClick={() => removeSkillGroup(i)}>
                  <Trash2 size={14} /> 删除该组
                </button>
              </div>
            ))}
            <button type="button" className="compactButton" onClick={addSkillGroup}>
              <Plus size={14} /> 添加技能组
            </button>
          </div>
        );

      case 'timeline':
        return (
          <div className="editPanel">
            <h3>项目经历</h3>
            {content.timelineProjects.map((project) => (
              <div key={project.id} className="nestedEditor">
                <LocalizedTextInput
                  label="项目名称"
                  value={project.title}
                  locale={locale}
                  onChange={(v) => updateTimelineLocalized(project.id, 'title', v)}
                />
                <TextInput label="时间段" value={project.period} onChange={(v) => updateTimelineField(project.id, 'period', v)} />
                <LocalizedTextInput
                  label="简介"
                  value={project.summary}
                  locale={locale}
                  onChange={(v) => updateTimelineLocalized(project.id, 'summary', v)}
                  multiline
                />
                <StringArrayEditor
                  label="项目图片（选图上传或手动填 /assets/ 路径，可多张，拖动顺序即展示顺序）"
                  items={project.images}
                  onChange={(v) => updateTimelineField(project.id, 'images', v)}
                />
                <div className="uploadRow">
                  <ImageUploadButton
                    token={githubToken}
                    setStatus={setStatus}
                    onUploaded={(p) => updateTimelineField(project.id, 'images', [...project.images, p])}
                    label="上传项目图片"
                  />
                </div>
                <StringArrayEditor
                  label="技术栈"
                  items={project.stack}
                  onChange={(v) => updateTimelineField(project.id, 'stack', v)}
                />
                <LocalizedTextInput
                  label="职责"
                  value={project.role}
                  locale={locale}
                  onChange={(v) => updateTimelineLocalized(project.id, 'role', v)}
                />
                <LocalizedTextInput
                  label="成果"
                  value={project.outcome}
                  locale={locale}
                  onChange={(v) => updateTimelineLocalized(project.id, 'outcome', v)}
                />
                <LocalizedTextArrayEditor
                  label="详细描述"
                  items={project.details}
                  locale={locale}
                  onChange={(v) => updateTimelineDetails(project.id, v)}
                />
                <button type="button" className="dangerButton" onClick={() => removeTimelineProject(project.id)}>
                  <Trash2 size={14} /> 删除项目
                </button>
              </div>
            ))}
            <button type="button" className="compactButton" onClick={addTimelineProject}>
              <Plus size={14} /> 添加项目
            </button>
          </div>
        );

      case 'gallery':
        return (
          <div className="editPanel">
            <h3>学术画廊</h3>
            {content.galleryProjects.map((project) => (
              <div key={project.id} className="nestedEditor">
                <LocalizedTextInput
                  label="项目名称"
                  value={project.title}
                  locale={locale}
                  onChange={(v) => updateGalleryLocalized(project.id, 'title', v)}
                />
                <LocalizedTextInput
                  label="分类"
                  value={project.category}
                  locale={locale}
                  onChange={(v) => updateGalleryLocalized(project.id, 'category', v)}
                />
                <TextInput
                  label="封面路径"
                  value={project.cover}
                  onChange={(v) => updateGalleryField(project.id, 'cover', v)}
                />
                <LocalizedTextArrayEditor
                  label="项目说明"
                  items={project.notes}
                  locale={locale}
                  onChange={(v) => updateGalleryNotes(project.id, v)}
                />
                <StringArrayEditor
                  label="技术栈"
                  items={project.stack}
                  onChange={(v) => updateGalleryField(project.id, 'stack', v)}
                />
                <LocalizedTextInput
                  label="职责"
                  value={project.role}
                  locale={locale}
                  onChange={(v) => updateGalleryLocalized(project.id, 'role', v)}
                />
                <LocalizedTextInput
                  label="成果"
                  value={project.result}
                  locale={locale}
                  onChange={(v) => updateGalleryLocalized(project.id, 'result', v)}
                />
                <LocalizedTextInput
                  label="描述"
                  value={project.description}
                  locale={locale}
                  onChange={(v) => updateGalleryLocalized(project.id, 'description', v)}
                  multiline
                />
                <button type="button" className="dangerButton" onClick={() => removeGalleryProject(project.id)}>
                  <Trash2 size={14} /> 删除项目
                </button>
              </div>
            ))}
            <button type="button" className="compactButton" onClick={addGalleryProject}>
              <Plus size={14} /> 添加项目
            </button>
          </div>
        );

      case 'courses':
        return (
          <div className="editPanel">
            <h3>课程介绍</h3>
            {content.courses.map((course) => (
              <div key={course.id} className="nestedEditor">
                <LocalizedTextInput
                  label="课程名称"
                  value={course.title}
                  locale={locale}
                  onChange={(v) => updateCourseField(course.id, 'title', v)}
                />
                <LocalizedTextInput
                  label="描述"
                  value={course.body}
                  locale={locale}
                  onChange={(v) => updateCourseField(course.id, 'body', v)}
                  multiline
                />
                <StringArrayEditor label="标签" items={course.tags} onChange={(v) => updateCourseTags(course.id, v)} />
                <button type="button" className="dangerButton" onClick={() => removeCourse(course.id)}>
                  <Trash2 size={14} /> 删除课程
                </button>
              </div>
            ))}
            <button type="button" className="compactButton" onClick={addCourse}>
              <Plus size={14} /> 添加课程
            </button>
          </div>
        );

      case 'major':
        return (
          <div className="editPanel">
            <h3>专业介绍</h3>
            {content.major.map((m) => (
              <div key={m.id} className="nestedEditor">
                <LocalizedTextInput
                  label="模块名称"
                  value={m.title}
                  locale={locale}
                  onChange={(v) => updateMajorField(m.id, 'title', v)}
                />
                <LocalizedTextInput
                  label="描述"
                  value={m.body}
                  locale={locale}
                  onChange={(v) => updateMajorField(m.id, 'body', v)}
                  multiline
                />
                <StringArrayEditor label="标签" items={m.tags} onChange={(v) => updateMajorTags(m.id, v)} />
                <button type="button" className="dangerButton" onClick={() => removeMajor(m.id)}>
                  <Trash2 size={14} /> 删除模块
                </button>
              </div>
            ))}
            <button type="button" className="compactButton" onClick={addMajor}>
              <Plus size={14} /> 添加模块
            </button>
          </div>
        );

      case 'publish':
        return (
          <div className="editPanel">
            <h3>发布到 GitHub</h3>
            <div className="publishInfo">
              <AlertCircle size={16} />
              <p>发布功能会将当前编辑内容推送到 GitHub 仓库，自动触发 Actions 重新构建部署。</p>
            </div>
            <div className="editorField">
              <span className="fieldLabel">GitHub Personal Access Token</span>
              <input
                type="password"
                className="fieldInput"
                value={githubToken}
                onChange={(e) => {
                  setGithubToken(e.target.value);
                  localStorage.setItem(githubTokenKey, e.target.value);
                }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
              <p className="fieldHint">
                Token 需要 <code>repo</code> 权限。获取方式：GitHub Settings → Developer settings → Personal access tokens → Tokens
                (classic)
              </p>
            </div>
            <div className="publishActions">
              <button type="button" className="primaryButton" onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
                {isPublishing ? ' 发布中...' : ' 发布到 GitHub'}
              </button>
              <a
                className="ghostButton"
                href="https://github.com/ZXEQzzg/ZXEQzzg_Csy.github.io/actions"
                target="_blank"
                rel="noreferrer"
              >
                <Eye size={16} /> 查看 Actions 状态
              </a>
            </div>
          </div>
        );
    }
  };

  const adminTools = (
    <section className="adminStudio">
      <div className="adminToolbar">
        <div>
          <p className="eyebrow">Private editing mode</p>
          <h2>编辑模式 — 所有内容可编辑</h2>
        </div>
        <div className="adminActions">
          <button type="button" className="primaryButton" onClick={saveDraft}>
            <Save size={16} /> 保存草稿
          </button>
          <button type="button" className="ghostButton" onClick={resetDraft}>
            <RefreshCw size={16} /> 重置
          </button>
          <a className="ghostButton" href="/#">
            <Eye size={16} /> 查看公开页
          </a>
        </div>
      </div>

      <div className="editorLayout">
        <nav className="editorTabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="editorContent">{renderTabContent()}</div>
      </div>
      <p className="statusLine">{status}</p>
    </section>
  );

  return (
    <Portfolio
      content={content}
      locale={locale}
      theme={theme}
      setLocale={setLocale}
      setTheme={setTheme}
      adminTools={adminTools}
    />
  );
}

// ===== Mount =====
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
