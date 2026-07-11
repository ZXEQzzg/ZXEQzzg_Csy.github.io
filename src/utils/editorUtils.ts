import type { LocalizedText, SiteContent } from '../data/siteContent';

// 配色主题键（chip/卡片背景，含渐变）。编辑器 CHIP_THEMES 与 styles.css 的
// .tone-* 类名都以此为准，序列化时非法值回落为 ''（默认无配色）。
export const TONE_KEYS = ['teal', 'gold', 'violet', 'rose', 'sky', 'mint', 'sunset', 'ocean', 'candy', 'aurora'] as const;

export const validTone = (v: unknown): string => (typeof v === 'string' && (TONE_KEYS as readonly string[]).includes(v) ? v : '');

/** 图片位移 "x y"（object-position 百分比）规范化，非法回落居中 */
export const normPos = (v: unknown): string => {
  if (typeof v !== 'string') return '50 50';
  const parts = v.trim().split(/[\s,]+/).map(Number);
  const c = (n: number) => (Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n * 10) / 10)) : 50);
  return `${c(parts[0])} ${c(parts[1])}`;
};

export function makeLocalizedText(value = ''): LocalizedText {
  return { zh: value, en: value, ko: value };
}

// 把内容里的资源路径（如 /assets/xxx.png）解析成带 Vite base 前缀的可用 URL。
// 生产部署在 https://ZXEQzzg.github.io/ZXEQzzg_Csy.github.io/ 子路径下，
// 裸 /assets/... 会 404，必须拼上 import.meta.env.BASE_URL；空格/中韩文件名用 encodeURI 处理。
export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  // 兼容 public/assets/x、/assets/x、assets/x 三种写法：public/ 是源码目录，
  // 构建后从站点根提供，路径里不能带 public/，这里统一剥掉再拼 base。
  const clean = path.replace(/^\/+/, '').replace(/^public\//, '');
  return base + encodeURI(clean);
}

// ===== 序列化：SiteContent → TypeScript 文件字符串 =====
function q(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
}

function genLT(lt: LocalizedText): string {
  return `{ zh: ${q(lt.zh)}, en: ${q(lt.en)}, ko: ${q(lt.ko)} }`;
}

function genStrArr(arr: string[]): string {
  return `[${arr.map((s) => q(s)).join(', ')}]`;
}

export function serializeSiteContent(data: SiteContent): string {
  const lines: string[] = [];
  // 卡片行宽百分比：合法范围 24–100（保留 1 位小数），否则回落默认值
  const wp = (v: unknown, def: number): number => {
    const n = Math.round(Number(v) * 10) / 10;
    return Number.isFinite(n) && n >= 24 && n <= 100 ? n : def;
  };
  // 图片高度 px：范围内取整，否则回落默认值
  const hp = (v: unknown, def: number, min: number, max: number): number => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) && n >= min && n <= max ? n : def;
  };

  lines.push(`export type Locale = 'zh' | 'en' | 'ko';`);
  lines.push(``);
  lines.push(`export type ThemeMode = 'light' | 'dark';`);
  lines.push(``);
  lines.push(`export type LocalizedText = Record<Locale, string>;`);
  lines.push(``);
  lines.push(`export type ProfileLink = {`);
  lines.push(`  label: string;`);
  lines.push(`  value: string;`);
  lines.push(`  href: string;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type TimelineProject = {`);
  lines.push(`  id: string;`);
  lines.push(`  title: LocalizedText;`);
  lines.push(`  period: string;`);
  lines.push(`  summary: LocalizedText;`);
  lines.push(`  images: string[];`);
  lines.push(`  stack: string[];`);
  lines.push(`  role: LocalizedText;`);
  lines.push(`  outcome: LocalizedText;`);
  lines.push(`  details: LocalizedText[];`);
  lines.push(`  widthPct?: number;`);
  lines.push(`  imageHeight?: number;`);
  lines.push(`  stackColors?: string[];`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type GalleryProject = {`);
  lines.push(`  id: string;`);
  lines.push(`  title: LocalizedText;`);
  lines.push(`  cover: string;`);
  lines.push(`  category: LocalizedText;`);
  lines.push(`  notes: LocalizedText[];`);
  lines.push(`  stack: string[];`);
  lines.push(`  role: LocalizedText;`);
  lines.push(`  result: LocalizedText;`);
  lines.push(`  description: LocalizedText;`);
  lines.push(`  widthPct?: number;`);
  lines.push(`  coverHeight?: number;`);
  lines.push(`  hidden?: boolean;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type InfoModule = {`);
  lines.push(`  id: string;`);
  lines.push(`  title: LocalizedText;`);
  lines.push(`  body: LocalizedText;`);
  lines.push(`  tags: string[];`);
  lines.push(`  images?: string[];`);
  lines.push(`  imageHeight?: number;`);
  lines.push(`  imagePos?: string[];`);
  lines.push(`  widthPct?: number;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type ResearchItem = {`);
  lines.push(`  id: string;`);
  lines.push(`  kind: string;`);
  lines.push(`  title: LocalizedText;`);
  lines.push(`  link: string;`);
  lines.push(`  note: LocalizedText;`);
  lines.push(`  image?: string;`);
  lines.push(`  pdf?: string;`);
  lines.push(`  imageMode?: 'auto' | 'cover' | 'contain';`);
  lines.push(`  imageHeight?: number;`);
  lines.push(`  widthPct?: number;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type ResumeBlock = {`);
  lines.push(`  images: string[];`);
  lines.push(`  pdf: string;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type TickerItem = {`);
  lines.push(`  id: string;`);
  lines.push(`  text: LocalizedText;`);
  lines.push(`  image?: string;`);
  lines.push(`  imageHeight?: number;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type SiteContent = {`);
  lines.push(`  profile: {`);
  lines.push(`    name: string;`);
  lines.push(`    avatar: string;`);
  lines.push(`    avatars?: string[];`);
  lines.push(`    mark?: string;`);
  lines.push(`    siteTitle?: string;`);
  lines.push(`    tickerLabel?: LocalizedText;`);
  lines.push(`    ticker?: TickerItem[];`);
  lines.push(`    headline: LocalizedText;`);
  lines.push(`    intro: LocalizedText;`);
  lines.push(`    research: LocalizedText;`);
  lines.push(`    location: LocalizedText;`);
  lines.push(`    links: ProfileLink[];`);
  lines.push(`    resume: ResumeBlock;`);
  lines.push(`    heroHeight?: number;`);
  lines.push(`  };`);
  lines.push(`  skills: {`);
  lines.push(`    title: LocalizedText;`);
  lines.push(`    groups: Array<{ name: LocalizedText; items: string[]; theme?: string; itemColors?: string[] }>;`);
  lines.push(`  };`);
  lines.push(`  timelineProjects: TimelineProject[];`);
  lines.push(`  galleryProjects: GalleryProject[];`);
  lines.push(`  courses: InfoModule[];`);
  lines.push(`  major: InfoModule[];`);
  lines.push(`  recentResearch: ResearchItem[];`);
  lines.push(`  sectionTitles?: Record<string, LocalizedText>;`);
  lines.push(`  uiStrings?: Record<string, LocalizedText>;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export const localeLabels: Record<Locale, string> = { zh: '中', en: 'EN', ko: '한' };`);
  lines.push(``);
  lines.push(`export const defaultContent: SiteContent = {`);

  const avatars = (data.profile.avatars ?? (data.profile.avatar ? [data.profile.avatar] : [])).filter(Boolean);
  lines.push(`  profile: {`);
  lines.push(`    name: ${q(data.profile.name)},`);
  lines.push(`    avatar: ${q(avatars[0] ?? '')},`);
  lines.push(`    avatars: ${genStrArr(avatars)},`);
  lines.push(`    mark: ${q(data.profile.mark ?? 'AI')},`);
  lines.push(`    siteTitle: ${q(data.profile.siteTitle ?? 'ZXEQzzg Csy Portfolio')},`);
  lines.push(`    tickerLabel: ${genLT(data.profile.tickerLabel ?? { zh: '近期内容', en: 'Recent', ko: '최근 소식' })},`);
  lines.push(`    ticker: [`);
  for (const t of data.profile.ticker ?? []) {
    const th = Math.min(360, Math.max(36, Math.round(Number(t.imageHeight)) || 72));
    lines.push(`      { id: ${q(t.id)}, text: ${genLT(t.text)}, image: ${q(t.image ?? '')}, imageHeight: ${th} },`);
  }
  lines.push(`    ],`);
  lines.push(`    headline: ${genLT(data.profile.headline)},`);
  lines.push(`    intro: ${genLT(data.profile.intro)},`);
  lines.push(`    research: ${genLT(data.profile.research)},`);
  lines.push(`    location: ${genLT(data.profile.location)},`);
  lines.push(`    links: [`);
  for (const link of data.profile.links) {
    lines.push(`      { label: ${q(link.label)}, value: ${q(link.value)}, href: ${q(link.href)} },`);
  }
  lines.push(`    ],`);
  {
    const resume = data.profile.resume ?? { images: [], pdf: '' };
    lines.push(`    resume: { images: ${genStrArr(resume.images ?? [])}, pdf: ${q(resume.pdf ?? '')} },`);
  }
  {
    // 个人介绍框最小高度 px：0 = 自适应，其余钳制 200–900
    const n = Math.round(Number(data.profile.heroHeight));
    lines.push(`    heroHeight: ${Number.isFinite(n) && n >= 200 && n <= 900 ? n : 0},`);
  }
  lines.push(`  },`);

  lines.push(`  skills: {`);
  lines.push(`    title: ${genLT(data.skills.title)},`);
  lines.push(`    groups: [`);
  for (const group of data.skills.groups) {
    // itemColors 与 items 一一对齐（增删后长度可能不一致，序列化时补齐/截断）
    const colors = group.items.map((_, i) => validTone(group.itemColors?.[i]));
    lines.push(
      `      { name: ${genLT(group.name)}, items: ${genStrArr(group.items)}, theme: ${q(validTone(group.theme))}, itemColors: ${genStrArr(colors)} },`
    );
  }
  lines.push(`    ],`);
  lines.push(`  },`);

  lines.push(`  timelineProjects: [`);
  for (const tp of data.timelineProjects) {
    lines.push(`    {`);
    lines.push(`      id: ${q(tp.id)},`);
    lines.push(`      title: ${genLT(tp.title)},`);
    lines.push(`      period: ${q(tp.period)},`);
    lines.push(`      summary: ${genLT(tp.summary)},`);
    lines.push(`      images: ${genStrArr(tp.images ?? [])},`);
    lines.push(`      stack: ${genStrArr(tp.stack)},`);
    lines.push(`      role: ${genLT(tp.role)},`);
    lines.push(`      outcome: ${genLT(tp.outcome)},`);
    lines.push(`      details: [`);
    for (const d of tp.details) {
      lines.push(`        ${genLT(d)},`);
    }
    lines.push(`      ],`);
    lines.push(`      widthPct: ${wp(tp.widthPct, 100)},`);
    lines.push(`      imageHeight: ${hp(tp.imageHeight, 220, 120, 560)},`);
    lines.push(`      stackColors: ${genStrArr(tp.stack.map((_, i) => validTone(tp.stackColors?.[i])))},`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);

  lines.push(`  galleryProjects: [`);
  for (const gp of data.galleryProjects) {
    lines.push(`    {`);
    lines.push(`      id: ${q(gp.id)},`);
    lines.push(`      title: ${genLT(gp.title)},`);
    lines.push(`      cover: ${q(gp.cover)},`);
    lines.push(`      category: ${genLT(gp.category)},`);
    lines.push(`      notes: [`);
    for (const n of gp.notes) {
      lines.push(`        ${genLT(n)},`);
    }
    lines.push(`      ],`);
    lines.push(`      stack: ${genStrArr(gp.stack)},`);
    lines.push(`      role: ${genLT(gp.role)},`);
    lines.push(`      result: ${genLT(gp.result)},`);
    lines.push(`      description: ${genLT(gp.description)},`);
    lines.push(`      widthPct: ${wp(gp.widthPct, 33.3)},`);
    lines.push(`      coverHeight: ${hp(gp.coverHeight, 200, 120, 520)},`);
    lines.push(`      hidden: ${gp.hidden === true},`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);

  // 课程 / 专业模块共用 InfoModule：图片相关字段两边都发出（课程暂无编辑入口，为空数组）
  for (const [key, list] of [
    ['courses', data.courses],
    ['major', data.major],
  ] as const) {
    lines.push(`  ${key}: [`);
    for (const m of list) {
      const imgs = m.images ?? [];
      lines.push(`    {`);
      lines.push(`      id: ${q(m.id)},`);
      lines.push(`      title: ${genLT(m.title)},`);
      lines.push(`      body: ${genLT(m.body)},`);
      lines.push(`      tags: ${genStrArr(m.tags)},`);
      lines.push(`      images: ${genStrArr(imgs)},`);
      lines.push(`      imageHeight: ${hp(m.imageHeight, 200, 120, 520)},`);
      lines.push(`      imagePos: ${genStrArr(imgs.map((_, i) => normPos(m.imagePos?.[i])))},`);
      lines.push(`      widthPct: ${wp(m.widthPct, 33.3)},`);
      lines.push(`    },`);
    }
    lines.push(`  ],`);
  }

  lines.push(`  recentResearch: [`);
  for (const r of data.recentResearch ?? []) {
    const mode = r.imageMode === 'cover' || r.imageMode === 'contain' ? r.imageMode : 'auto';
    const height = Math.round(Number(r.imageHeight)) || 190;
    const widthPct = wp(r.widthPct, 50);
    lines.push(`    {`);
    lines.push(`      id: ${q(r.id)},`);
    lines.push(`      kind: ${q(r.kind)},`);
    lines.push(`      title: ${genLT(r.title)},`);
    lines.push(`      link: ${q(r.link)},`);
    lines.push(`      note: ${genLT(r.note)},`);
    lines.push(`      image: ${q(r.image ?? '')},`);
    lines.push(`      pdf: ${q(r.pdf ?? '')},`);
    lines.push(`      imageMode: ${q(mode)},`);
    lines.push(`      imageHeight: ${height},`);
    lines.push(`      widthPct: ${widthPct},`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);

  lines.push(`  sectionTitles: {`);
  for (const [key, lt] of Object.entries(data.sectionTitles ?? {})) {
    if (!lt) continue;
    lines.push(`    ${JSON.stringify(key)}: ${genLT(lt)},`);
  }
  lines.push(`  },`);

  lines.push(`  uiStrings: {`);
  for (const [key, lt] of Object.entries(data.uiStrings ?? {})) {
    if (!lt) continue;
    lines.push(`    ${JSON.stringify(key)}: ${genLT(lt)},`);
  }
  lines.push(`  },`);

  lines.push(`};`);

  return lines.join('\n');
}

// ===== 编辑页直传图片到仓库 public/assets/ =====
// 选图 → base64 → GitHub contents API PUT 到 public/assets/[分类文件夹/]<唯一文件名> →
// 返回 /assets/[文件夹/]<文件名>（走 assetUrl 拼 base）。文件名做安全化+唯一化。
// folder 为分类目录（如 'Main Experiences' / 'PaPer'），可含空格；不存在时 GitHub 会自动创建。
export async function uploadImageToGitHub(
  file: File,
  token: string,
  folder?: string
): Promise<{ success: boolean; message: string; path?: string }> {
  const owner = 'ZXEQzzg';
  const repo = 'ZXEQzzg_Csy.github.io';
  const branch = 'main';

  const dot = file.name.lastIndexOf('.');
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase().replace(/[^.a-z0-9]/g, '') : '';
  const stem =
    (dot >= 0 ? file.name.slice(0, dot) : file.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';
  const unique = Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  const filename = `${stem}-${unique}${ext}`;
  const dir = folder ? `${folder.replace(/^\/+|\/+$/g, '')}/` : '';
  const repoPath = `public/assets/${dir}${filename}`;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(binary);

    // 路径逐段 encode：分类文件夹名可能带空格（如 Main Experiences）
    const apiPath = repoPath.split('/').map(encodeURIComponent).join('/');
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload image ${dir}${filename} from web editor`,
        content: base64,
        branch,
      }),
    });

    if (res.ok) {
      return { success: true, message: '图片上传成功', path: `/assets/${dir}${filename}` };
    }
    const err = await res.json();
    return { success: false, message: `图片上传失败: ${err.message}` };
  } catch (error) {
    return {
      success: false,
      message: `网络错误: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ===== 发布到 GitHub =====
export async function publishToGitHub(
  data: SiteContent,
  token: string
): Promise<{ success: boolean; message: string }> {
  const owner = 'ZXEQzzg';
  const repo = 'ZXEQzzg_Csy.github.io';
  const path = 'src/data/siteContent.ts';
  const branch = 'main';

  try {
    const getResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!getResponse.ok) {
      const err = await getResponse.json();
      return { success: false, message: `获取文件失败: ${err.message}` };
    }

    const fileData = await getResponse.json();
    const sha = fileData.sha;

    const content = serializeSiteContent(data);
    const bytes = new TextEncoder().encode(content);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const encodedContent = btoa(binary);

    const putResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update content from web editor',
          content: encodedContent,
          sha,
          branch,
        }),
      }
    );

    if (putResponse.ok) {
      return {
        success: true,
        message: '推送成功！GitHub Actions 正在构建部署，请等待 1-2 分钟。',
      };
    } else {
      const err = await putResponse.json();
      return { success: false, message: `推送失败: ${err.message}` };
    }
  } catch (error) {
    return {
      success: false,
      message: `网络错误: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
