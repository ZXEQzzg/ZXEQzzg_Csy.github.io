import { StrictMode, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  Github,
  Languages,
  Mail,
  Moon,
  PanelsTopLeft,
  Plus,
  Save,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  Upload,
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
} from './data/siteContent';
import './styles.css';

const contentStorageKey = 'zxeqzzg-portfolio-content-draft';

type SectionKey = 'intro' | 'skills' | 'experience' | 'gallery' | 'courses' | 'major';

const sectionLabels: Record<SectionKey, Record<Locale, string>> = {
  intro: { zh: '个人介绍', en: 'Profile', ko: '소개' },
  skills: { zh: '技术栈', en: 'Stack', ko: '스택' },
  experience: { zh: '主要项目经历', en: 'Projects', ko: '프로젝트' },
  gallery: { zh: '学术驱动项目', en: 'Academic Gallery', ko: '학술 갤러리' },
  courses: { zh: '课程介绍', en: 'Courses', ko: '수업' },
  major: { zh: '专业介绍', en: 'Major', ko: '전공' },
};

function getInitialContent(): SiteContent {
  const saved = window.localStorage.getItem(contentStorageKey);
  if (!saved) return defaultContent;

  try {
    return JSON.parse(saved) as SiteContent;
  } catch {
    return defaultContent;
  }
}

function makeLocalizedText(value = ''): LocalizedText {
  return { zh: value, en: value, ko: value };
}

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
  const [openProjectId, setOpenProjectId] = useState(content.timelineProjects[0]?.id ?? '');
  const sections = Object.keys(sectionLabels) as SectionKey[];

  return (
    <main className="appShell">
      <aside className="sidebar">
        <div className="identityBlock">
          <div className="mark">AI</div>
          <div>
            <p className="eyebrow">{content.profile.location[locale]}</p>
            <h1>{content.profile.name}</h1>
          </div>
        </div>

        <div className="sidebarScroller">
          <section className="profileCard">
            <p className="headline">{content.profile.headline[locale]}</p>
            <p>{content.profile.intro[locale]}</p>
            <p className="research">{content.profile.research[locale]}</p>
          </section>

          <section className="contactList">
            {content.profile.links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label === 'Email' ? <Mail size={16} /> : <Github size={16} />}
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
            <button className="iconButton" type="button" aria-label="Settings" title="Settings">
              <Settings size={18} />
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
                <span>{sectionLabels[section][locale]}</span>
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
              <div className="accordion">
                {content.timelineProjects.map((project) => (
                  <TimelineProjectCard
                    key={project.id}
                    project={project}
                    locale={locale}
                    isOpen={openProjectId === project.id}
                    onToggle={() => setOpenProjectId(openProjectId === project.id ? '' : project.id)}
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
    </main>
  );
}

function TimelineProjectCard({
  project,
  locale,
  isOpen,
  onToggle,
}: {
  project: TimelineProject;
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`projectPanel ${isOpen ? 'open' : ''}`}>
      <button type="button" onClick={onToggle}>
        <span>
          <small>{project.period}</small>
          <strong>{project.title[locale]}</strong>
        </span>
        <ChevronDown size={18} />
      </button>
      {isOpen && (
        <div className="projectBody">
          <p>{project.summary[locale]}</p>
          <div className="detailGrid">
            <InfoPill label="Stack" value={project.stack.join(' / ')} />
            <InfoPill label={locale === 'zh' ? '职责' : locale === 'ko' ? '역할' : 'Role'} value={project.role[locale]} />
            <InfoPill label={locale === 'zh' ? '成果' : locale === 'ko' ? '결과' : 'Outcome'} value={project.outcome[locale]} />
          </div>
          <ul>
            {project.details.map((item) => (
              <li key={item.en}>{item[locale]}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function GalleryGrid({ projects, locale }: { projects: GalleryProject[]; locale: Locale }) {
  return (
    <div className="academicGallery">
      {projects.map((project) => (
        <article className="galleryCard" key={project.id}>
          <img src={project.cover} alt={project.title[locale]} />
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
  const [selectedProjectId, setSelectedProjectId] = useState(content.galleryProjects[0]?.id ?? '');
  const selectedProject = content.galleryProjects.find((project) => project.id === selectedProjectId) ?? content.galleryProjects[0];

  function commit(nextContent: SiteContent, message = '已更新预览，记得保存草稿') {
    setContent(nextContent);
    setStatus(message);
  }

  function saveDraft() {
    window.localStorage.setItem(contentStorageKey, JSON.stringify(content));
    setStatus('草稿已保存在当前浏览器。正式发布需要接 GitHub API 或提交代码。');
  }

  function resetDraft() {
    window.localStorage.removeItem(contentStorageKey);
    setContent(defaultContent);
    setSelectedProjectId(defaultContent.galleryProjects[0]?.id ?? '');
    setStatus('已恢复默认内容。');
  }

  function addGalleryProject() {
    const index = content.galleryProjects.length + 1;
    const newProject: GalleryProject = {
      id: `academic-project-${Date.now()}`,
      title: {
        zh: `学术项目 ${String(index).padStart(2, '0')}`,
        en: `Academic Project ${String(index).padStart(2, '0')}`,
        ko: `학술 프로젝트 ${String(index).padStart(2, '0')}`,
      },
      cover: '/assets/ppt-cover-03.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        makeLocalizedText('第一行简介。'),
        makeLocalizedText('第二行说明。'),
        makeLocalizedText('第三行成果。'),
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: makeLocalizedText('待编辑'),
      result: makeLocalizedText('待编辑'),
      description: makeLocalizedText('待编辑项目描述。'),
    };
    commit({ ...content, galleryProjects: [...content.galleryProjects, newProject] }, '已加入新的学术项目卡片。');
    setSelectedProjectId(newProject.id);
  }

  function deleteGalleryProject(projectId: string) {
    const nextProjects = content.galleryProjects.filter((project) => project.id !== projectId);
    commit({ ...content, galleryProjects: nextProjects }, '已删除选中的学术项目卡片。');
    setSelectedProjectId(nextProjects[0]?.id ?? '');
  }

  function updateProfileField(field: 'name' | 'headline' | 'intro' | 'research' | 'location', value: string) {
    if (field === 'name') {
      commit({ ...content, profile: { ...content.profile, name: value } });
      return;
    }

    commit({
      ...content,
      profile: {
        ...content.profile,
        [field]: { ...content.profile[field], [locale]: value },
      },
    });
  }

  function updateGalleryField(projectId: string, field: 'title' | 'category' | 'cover', value: string) {
    const nextProjects = content.galleryProjects.map((project) => {
      if (project.id !== projectId) return project;
      if (field === 'cover') return { ...project, cover: value };
      return { ...project, [field]: { ...project[field], [locale]: value } };
    });
    commit({ ...content, galleryProjects: nextProjects });
  }

  function updateGalleryNote(projectId: string, noteIndex: number, value: string) {
    const nextProjects = content.galleryProjects.map((project) => {
      if (project.id !== projectId) return project;
      const notes = [...project.notes];
      notes[noteIndex] = { ...(notes[noteIndex] ?? makeLocalizedText()), [locale]: value };
      return { ...project, notes };
    });
    commit({ ...content, galleryProjects: nextProjects });
  }

  function updateGalleryCoverFromFile(projectId: string, file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateGalleryField(projectId, 'cover', String(reader.result));
      setStatus('图片已加入当前浏览器草稿。正式部署建议把图片放到 public/assets 后使用路径。');
    };
    reader.readAsDataURL(file);
  }

  const adminTools = (
    <section className="adminStudio">
      <div className="adminToolbar">
        <div>
          <p className="eyebrow">Private editing mode</p>
          <h2>你看到的是公开页面，只是多了编辑能力</h2>
        </div>
        <div className="adminActions">
          <button type="button" className="primaryButton" onClick={saveDraft}>
            <Save size={16} /> 保存草稿
          </button>
          <button type="button" className="ghostButton" onClick={resetDraft}>
            重置
          </button>
          <a className="ghostButton" href="/#">
            查看公开页
          </a>
        </div>
      </div>

      <div className="editorPanels">
        <section className="editPanel">
          <h3>个人介绍</h3>
          <label>
            名称
            <input value={content.profile.name} onChange={(event) => updateProfileField('name', event.target.value)} />
          </label>
          <label>
            标题
            <textarea value={content.profile.headline[locale]} onChange={(event) => updateProfileField('headline', event.target.value)} />
          </label>
          <label>
            简介
            <textarea value={content.profile.intro[locale]} onChange={(event) => updateProfileField('intro', event.target.value)} />
          </label>
          <label>
            研究方向
            <textarea value={content.profile.research[locale]} onChange={(event) => updateProfileField('research', event.target.value)} />
          </label>
        </section>

        <section className="editPanel">
          <div className="panelHeader">
            <h3>学术项目画廊</h3>
            <button type="button" className="compactButton" onClick={addGalleryProject}>
              <Plus size={15} /> 添加
            </button>
          </div>
          <div className="projectSelector">
            {content.galleryProjects.map((project) => (
              <button
                key={project.id}
                className={project.id === selectedProject?.id ? 'active' : ''}
                type="button"
                onClick={() => setSelectedProjectId(project.id)}
              >
                {project.title[locale]}
              </button>
            ))}
          </div>

          {selectedProject && (
            <div className="selectedEditor">
              <label>
                项目标题
                <input
                  value={selectedProject.title[locale]}
                  onChange={(event) => updateGalleryField(selectedProject.id, 'title', event.target.value)}
                />
              </label>
              <label>
                分类
                <input
                  value={selectedProject.category[locale]}
                  onChange={(event) => updateGalleryField(selectedProject.id, 'category', event.target.value)}
                />
              </label>
              <label>
                封面路径或图片链接
                <input value={selectedProject.cover} onChange={(event) => updateGalleryField(selectedProject.id, 'cover', event.target.value)} />
              </label>
              <label className="fileButton">
                <Upload size={15} /> 选择图片预览
                <input type="file" accept="image/*" onChange={(event) => updateGalleryCoverFromFile(selectedProject.id, event.target.files?.[0])} />
              </label>
              {[0, 1, 2].map((index) => (
                <label key={index}>
                  第 {index + 1} 行说明
                  <input
                    value={selectedProject.notes[index]?.[locale] ?? ''}
                    onChange={(event) => updateGalleryNote(selectedProject.id, index, event.target.value)}
                  />
                </label>
              ))}
              <button type="button" className="dangerButton" onClick={() => deleteGalleryProject(selectedProject.id)}>
                <Trash2 size={15} /> 删除这个项目
              </button>
            </div>
          )}
        </section>
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
