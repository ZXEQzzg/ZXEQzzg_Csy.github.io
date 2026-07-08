import type { LocalizedText, SiteContent } from '../data/siteContent';

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
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type InfoModule = {`);
  lines.push(`  id: string;`);
  lines.push(`  title: LocalizedText;`);
  lines.push(`  body: LocalizedText;`);
  lines.push(`  tags: string[];`);
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
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type ResumeBlock = {`);
  lines.push(`  images: string[];`);
  lines.push(`  pdf: string;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export type SiteContent = {`);
  lines.push(`  profile: {`);
  lines.push(`    name: string;`);
  lines.push(`    avatar: string;`);
  lines.push(`    mark?: string;`);
  lines.push(`    siteTitle?: string;`);
  lines.push(`    headline: LocalizedText;`);
  lines.push(`    intro: LocalizedText;`);
  lines.push(`    research: LocalizedText;`);
  lines.push(`    location: LocalizedText;`);
  lines.push(`    links: ProfileLink[];`);
  lines.push(`    resume: ResumeBlock;`);
  lines.push(`  };`);
  lines.push(`  skills: {`);
  lines.push(`    title: LocalizedText;`);
  lines.push(`    groups: Array<{ name: LocalizedText; items: string[] }>;`);
  lines.push(`  };`);
  lines.push(`  timelineProjects: TimelineProject[];`);
  lines.push(`  galleryProjects: GalleryProject[];`);
  lines.push(`  courses: InfoModule[];`);
  lines.push(`  major: InfoModule[];`);
  lines.push(`  recentResearch: ResearchItem[];`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export const localeLabels: Record<Locale, string> = { zh: '中', en: 'EN', ko: '한' };`);
  lines.push(``);
  lines.push(`export const defaultContent: SiteContent = {`);

  lines.push(`  profile: {`);
  lines.push(`    name: ${q(data.profile.name)},`);
  lines.push(`    avatar: ${q(data.profile.avatar ?? '')},`);
  lines.push(`    mark: ${q(data.profile.mark ?? 'AI')},`);
  lines.push(`    siteTitle: ${q(data.profile.siteTitle ?? 'ZXEQzzg Csy Portfolio')},`);
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
  lines.push(`  },`);

  lines.push(`  skills: {`);
  lines.push(`    title: ${genLT(data.skills.title)},`);
  lines.push(`    groups: [`);
  for (const group of data.skills.groups) {
    lines.push(`      { name: ${genLT(group.name)}, items: ${genStrArr(group.items)} },`);
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
    lines.push(`    },`);
  }
  lines.push(`  ],`);

  lines.push(`  courses: [`);
  for (const c of data.courses) {
    lines.push(`    {`);
    lines.push(`      id: ${q(c.id)},`);
    lines.push(`      title: ${genLT(c.title)},`);
    lines.push(`      body: ${genLT(c.body)},`);
    lines.push(`      tags: ${genStrArr(c.tags)},`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);

  lines.push(`  major: [`);
  for (const m of data.major) {
    lines.push(`    {`);
    lines.push(`      id: ${q(m.id)},`);
    lines.push(`      title: ${genLT(m.title)},`);
    lines.push(`      body: ${genLT(m.body)},`);
    lines.push(`      tags: ${genStrArr(m.tags)},`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);

  lines.push(`  recentResearch: [`);
  for (const r of data.recentResearch ?? []) {
    const mode = r.imageMode === 'cover' || r.imageMode === 'contain' ? r.imageMode : 'auto';
    const height = Math.round(Number(r.imageHeight)) || 190;
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
    lines.push(`    },`);
  }
  lines.push(`  ],`);

  lines.push(`};`);

  return lines.join('\n');
}

// ===== 编辑页直传图片到仓库 public/assets/ =====
// 选图 → base64 → GitHub contents API PUT 到 public/assets/<唯一文件名> →
// 返回 /assets/<文件名>（走 assetUrl 拼 base）。文件名做安全化+唯一化，避免覆盖与特殊字符。
export async function uploadImageToGitHub(
  file: File,
  token: string
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
  const repoPath = `public/assets/${filename}`;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(binary);

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload image ${filename} from web editor`,
        content: base64,
        branch,
      }),
    });

    if (res.ok) {
      return { success: true, message: '图片上传成功', path: `/assets/${filename}` };
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
