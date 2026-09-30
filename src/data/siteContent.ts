export type Locale = 'zh' | 'en' | 'ko';

export type ThemeMode = 'light' | 'dark';

export type LocalizedText = Record<Locale, string>;

export type ProfileLink = {
  label: string;
  value: string;
  href: string;
};

export type TimelineProject = {
  id: string;
  title: LocalizedText;
  period: string;
  summary: LocalizedText;
  images: string[];
  stack: string[];
  role: LocalizedText;
  outcome: LocalizedText;
  details: LocalizedText[];
  widthPct?: number;
  imageHeight?: number;
  stackColors?: string[];
};

export type GalleryProject = {
  id: string;
  title: LocalizedText;
  cover: string;
  category: LocalizedText;
  notes: LocalizedText[];
  stack: string[];
  role: LocalizedText;
  result: LocalizedText;
  description: LocalizedText;
  widthPct?: number;
  coverHeight?: number;
  hidden?: boolean;
};

export type InfoModule = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  tags: string[];
  images?: string[];
  imageHeight?: number;
  imagePos?: string[];
  widthPct?: number;
};

export type ResearchItem = {
  id: string;
  kind: string;
  title: LocalizedText;
  link: string;
  note: LocalizedText;
  image?: string;
  pdf?: string;
  imageMode?: 'auto' | 'cover' | 'contain';
  imageHeight?: number;
  widthPct?: number;
};

export type ResumeBlock = {
  images: string[];
  pdf: string;
};

export type TickerItem = {
  id: string;
  text: LocalizedText;
  image?: string;
  imageHeight?: number;
};

export type AvatarStyle = {
  shape?: 'full' | 'circle' | 'square';
  pos?: string;
  size?: number;
};

export type SiteContent = {
  profile: {
    name: string;
    avatar: string;
    avatars?: string[];
    avatarStyles?: AvatarStyle[];
    photoBackdrop?: string;
    mark?: string;
    siteTitle?: string;
    tickerLabel?: LocalizedText;
    ticker?: TickerItem[];
    headline: LocalizedText;
    intro: LocalizedText;
    research: LocalizedText;
    location: LocalizedText;
    links: ProfileLink[];
    resume: ResumeBlock;
    heroHeight?: number;
  };
  skills: {
    title: LocalizedText;
    groups: Array<{ name: LocalizedText; items: string[]; theme?: string; itemColors?: string[] }>;
  };
  timelineProjects: TimelineProject[];
  galleryProjects: GalleryProject[];
  courses: InfoModule[];
  major: InfoModule[];
  recentResearch: ResearchItem[];
  sectionTitles?: Record<string, LocalizedText>;
  uiStrings?: Record<string, LocalizedText>;
  palette?: string;
};

export const localeLabels: Record<Locale, string> = { zh: '中', en: 'EN', ko: '한' };

export const defaultContent: SiteContent = {
  profile: {
    name: '<span style="font-size:0.85em">陈斯阳 | BURCE</span>',
    avatar: '/assets/I/toux-2urqqymri7783s.jpg',
    avatars: ['/assets/I/toux-2urqqymri7783s.jpg'],
    avatarStyles: [
      { shape: 'circle', pos: '50.2 42.2', size: 77 },
    ],
    photoBackdrop: '/assets/I/20260713035613-1jnu05mri8371o.png',
    mark: 'CV',
    siteTitle: 'ZXEQzzg_Csy.github.io | 个人经历 &amp; 作品集 Web',
    tickerLabel: { zh: '近期内容', en: 'Recent', ko: '최근 소식' },
    ticker: [
      { id: 'ticker-1783715176788', text: { zh: '“你好搭子” 最新更新 KWS 模块', en: 'New KWS module in "Hello, Buddy"', ko: '' }, image: '/assets/Recent/hidazi-x6o2hpmrfdznnn.png', imageHeight: 81 },
      { id: 'ticker-1783715350836', text: { zh: '”搭子“语音优化', en: 'Voice pipeline optimization for Buddy', ko: '' }, image: '/assets/Recent/0789ac0bffcb94ca59ead86c726bacc-i0t73emrfeadt1.jpg', imageHeight: 101 },
      { id: 'ticker-1783715737567', text: { zh: 'MatchMeta AI ⚽︎', en: 'MatchMate AI ⚽︎', ko: '' }, image: '/assets/Recent/fc89fd0fe754202699f1550be8a7d87-w7hr0emrfeb5kf.jpg', imageHeight: 99 },
      { id: 'ticker-1784885971822', text: { zh: '产品: b站 80W+播放', en: 'Product: 800K+ views on Bilibili', ko: '' }, image: '/assets/Recent/20260724173844-knr26rmryrrh24.png', imageHeight: 99 },
      { id: 'ticker-1784885976734', text: { zh: '世界杯的故事结束了!<br>', en: 'The World Cup story is over!<br>', ko: '' }, image: '/assets/Recent/20260724174132-vjusw4mryru0qq.jpg', imageHeight: 102 },
      { id: 'ticker-1784885977638', text: { zh: 'MatchMeta AI 产品介绍', en: 'MatchMate AI product introduction', ko: '' }, image: '/assets/Recent/15e7909b72bc213f3513824f5fe6392-23w8k8mryscsww.jpg', imageHeight: 99 },
    ],
    headline: { zh: '<span style="font-size: 23px;">AI / LLM 专业背景 - AI Agent 产品/交互方向 - HAII 方式 - 前沿客户端侧工程</span><div><span style="font-size: 23px;">AI 语音交互 - TTS / ASR / VAD / KWS / 声学仿真 · 评测</span></div>', en: '<span style="font-size: 23px;"></span><span style="font-size: 20px;"></span><span style="font-size: 18px;"></span><span style="font-size: 20px;"></span><span style="font-size: 16px;"></span><span style="font-size: 14px;"></span><span style="font-size: 23px;">AI / LLM background · AI Agent product &amp; interaction · HAII approach · frontier client-side engineering</span><div><span style="font-size: 20px;"></span><span style="font-size: 16px;"></span><span style="font-size: 14px;"></span><span style="font-size: 23px;">AI voice interaction · TTS / ASR / VAD / KWS / acoustic simulation &amp; evaluation</span></div>', ko: 'AI 전공 기반, 제품 디자인 감각, 연구 중심 프로젝트 경험' },
    intro: { zh: '<span style="font-size: 16px;">Hi！我是陈斯阳，毕业于 韩国全州大学人工智能专业 (22–26届) ProfKIM 研究室；过往经历中我专注于大语言模型相关应用研究与AI工程领域，具备从项目研究、产品分析到工程落地的能力。感谢了解，期待沟通~</span>', en: '<span style="font-size: 16px;">Hi! I\'m Chen Siyang. I graduated in Artificial Intelligence from Jeonju University, Korea (Class of 2022–2026), from Prof. KIM\'s lab. My experience centers on LLM application research and AI engineering, with the ability to carry work from project research and product analysis through to engineering delivery. Thanks for stopping by — I\'d be glad to connect.</span>', ko: 'AI 시스템이 실제 제품 환경에 들어가는 방식에 관심이 있으며 모델 성능, 사용자 경험, 설명 가능한 설계의 균형을 중시합니다.' },
    research: { zh: '<span style="font-size: 0.85em;"><span style="font-weight: bold; color: rgb(111, 215, 198);">研究方向</span><span style="color: rgb(111, 215, 198); font-weight: bold;">：</span>Agent 多领域应用 | Agent Memory | 语音（TTS/ASR/VAD/KWS/声学SIM）| LLM 全双工语音交互 | Agent HCI&nbsp;</span><div><span style="font-size: 0.85em;"><span style="font-weight: bold; color: rgb(111, 215, 198);">工程具备</span><span style="font-weight: bold; color: rgb(111, 215, 198);">：</span>AI 工程方式的前沿技术 | Agent与语音交互方式 | 快速搭建原型流 | 用户需求分析 | 技术交互类产品研究</span></div>', en: '<span style="font-size: 0.85em;"><span style="font-weight: bold; color: rgb(111, 215, 198);">Research</span><span style="color: rgb(111, 215, 198); font-weight: bold;">: </span>Multi-domain agent applications | Agent Memory | Voice (TTS/ASR/VAD/KWS/acoustic SIM) | LLM full-duplex voice interaction | Agent HCI&nbsp;</span><div><span style="font-size: 0.85em;"><span style="font-weight: bold; color: rgb(111, 215, 198);">Engineering</span><span style="font-weight: bold; color: rgb(111, 215, 198);">: </span>Frontier techniques in AI engineering | Agent and voice interaction paradigms | Rapid prototyping pipelines | User requirement analysis | Research on technically-driven interactive products</span></div>', ko: '연구 관심사: 멀티모달 인터랙션, 에이전트 애플리케이션, AI 보조 디자인, 데이터 기반 제품 분석.' },
    location: { zh: '🌐 中国 / 可远程协作', en: '🌐 China / Remote collaboration', ko: '중국 / 원격 협업 가능' },
    links: [
      { label: 'Email', value: 'ZXEQzzg@163.com', href: 'ZXEQzzg@163.com' },
      { label: 'GitHub', value: 'github.com/ZXEQzzg', href: 'https://github.com/ZXEQzzg' },
      { label: 'Portfolio', value: 'ZXEQzzg_Csy.github.io', href: 'https://ZXEQzzg-Csy.github.io' },
      { label: '电话', value: '+86 13248371107', href: '·' },
      { label: '微信', value: 'WeChat：John_H_Hua_Sheng', href: '·' },
    ],
    resume: { images: ['/assets/chensiyang-cvpm-ojzepnmsew6lh6.png'], pdf: '/assets/chensiyang-cvpm-xrm428msew4dgm.pdf' },
    heroHeight: 628,
  },
  skills: {
    title: { zh: '技术栈', en: 'Technical Stack', ko: '기술 스택' },
    groups: [
      { name: { zh: 'AI+  领域', en: 'AI+ Domains', ko: 'AI / 데이터' }, items: ['LLM', 'Agentic RAG', 'NLP', 'ASR', 'TTS ', 'VAD', 'Agent Tool', 'Function Calling', 'MCP', 'Skill', 'Prompt Eng', 'Context Eng', 'Agent Memory', 'KWS'], theme: 'teal', itemColors: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
      { name: { zh: '开发 | 工程 | Vibe Codding', en: 'Development | Engineering | Vibe Coding', ko: '제품 / 디자인' }, items: ['Python', 'Linux', 'Docker', 'Git', 'LangChain', 'Workflow', 'RAG 评估/测评', 'vibe IDE/CLI 开发 - Claude Code | Codex | KIRO | Gemini&amp;Antigravity | Trae | Copilot | Windsurf | CodeBuddy', 'GitHub Pages', 'FDE'], theme: 'violet', itemColors: ['', '', '', '', '', '', '', '', '', ''] },
      { name: { zh: 'AI+ 产品', en: 'AI+ Product', ko: '엔지니어링' }, items: ['AI  模型评估与选型', '需求分析 & PRD 撰写', 'Agent 产品设计', '产品交互', '⽤⼾场景分析', '结构 / ⾮结构化数据处理', 'Canva', 'Axure', '墨⼑', 'Figma'], theme: 'gold', itemColors: ['', '', '', '', '', '', '', '', '', ''] },
    ],
  },
  timelineProjects: [
    {
      id: 'design-research-dashboard',
      title: { zh: 'MatchMate AI - 看球搭子（上海交通大学人工智能学院）<span style="color: rgb(111, 215, 198);">⚽</span>', en: 'MatchMate AI — Football Companion (School of Artificial Intelligence, Shanghai Jiao Tong University)&nbsp;<span style="color: rgb(111, 215, 198);">⚽</span>', ko: '디자인 리서치 인사이트 대시보드' },
      period: '2026',
      summary: { zh: 'MatchMate · 足球 AI 搭子 —— 语音系统与智能播报模块产品设计/研发负责人<div>我们是来自上海交通大学人工智能学院的创业团队，MatchMate: AI 看球搭子 是我们打造一款<span style="color: rgb(111, 215, 198); font-weight: bold;">AI看球产品</span>，希望在信息爆炸、观点纷杂的媒体时代,能够借助AI的力量,把观众重新带回比赛本身。让每个人都能<span style="color: rgb(111, 215, 198); font-weight: bold;">边看边问</span>、<span style="color: rgb(111, 215, 198); font-weight: bold;">边看边懂</span>。🔊🎤<br>MatchMate 是一款<span style="font-weight: bold; color: rgb(111, 215, 198);">面向足球⚽︎观众的 实时 AI 陪伴与技术分析应用</span>，基于 SportMonks 实时数据/Zhibo8 事件流与大模型生成能力构建，为用户提供<span style="color: rgb(111, 215, 198); font-weight: bold;">赛前、赛中、赛后的个性化解说</span>，包含专业实时赛时数据、AI 数据预测、产品互动等多维度生态。我作为AI语音交互模块产品负责人，主导语音交互与赛场智能播报两大<span style="color: rgb(111, 215, 198); font-weight: bold;">「无手交互」能力的从0到1设计</span>，覆盖用户主动提问与系统主动播报全场景。</div>', en: 'MatchMate · Football AI Companion — product design / R&amp;D lead for the voice system and smart commentary modules<div>We are a startup team from the School of Artificial Intelligence at Shanghai Jiao Tong University. MatchMate: AI Football Companion is the <span style="color: rgb(111, 215, 198); font-weight: bold;">AI match-watching product</span> we built, hoping to use the power of AI to bring viewers back to the game itself in a media era of information overload and noisy opinions — so that anyone can <span style="color: rgb(111, 215, 198); font-weight: bold;">ask while watching</span> and <span style="color: rgb(111, 215, 198); font-weight: bold;">understand while watching</span>. 🔊🎤<br>MatchMate is a <span style="font-weight: bold; color: rgb(111, 215, 198);">real-time AI companion and technical analysis app for football ⚽︎ viewers</span>, built on SportMonks live data, Zhibo8 event streams, and LLM generation. It gives users <span style="color: rgb(111, 215, 198); font-weight: bold;">personalized commentary before, during, and after matches</span>, spanning professional live in-match data, AI-driven predictions, and interactive product experiences. As the product owner of the AI voice interaction module, I led the 0-to-1 design of two <span style="color: rgb(111, 215, 198); font-weight: bold;">hands-free interaction capabilities</span> — voice interaction and live smart commentary — covering both user-initiated questions and system-initiated announcements.</div>', ko: '인터뷰, 경쟁 분석, 수업 피드백을 추적 가능한 제품 판단으로 정리했습니다.' },
      images: ['/assets/Main Experiences/logopng-nrdgckmri7zv2d.png', '/assets/Main Experiences/fc89fd0fe754202699f1550be8a7d87-4d28dvmri7zqr7.jpg', '/assets/Main Experiences/image-quo3qamri8xpuc.png', '/assets/Main Experiences/20260711045201-o15nrumri8dqby.png', '/assets/Main Experiences/20260711034242-d3fbkimri8dus1.png', '/assets/Main Experiences/20260712062036-7x2kw8mri8dzto.png', '/assets/Main Experiences/20260709040853-goosbmmri84k6a.png', '/assets/Main Experiences/20260526000916-e2u1ismri8dcrd.png', '/assets/Main Experiences/20260529044555-ujkl73mri8dk9n.png', '/assets/Main Experiences/fbti-f4nncpmri8xze5.png', '/assets/Main Experiences/1-asr00smri8y5bo.png', '/assets/Main Experiences/2-tnvmbrmri8yate.png', '/assets/Main Experiences/3-5d8g5rmri8yeus.png', '/assets/Main Experiences/4-8q0b3cmri8yk97.png', '/assets/Main Experiences/15e7909b72bc213f3513824f5fe6392-tlj390mryrtbrg.jpg'],
      stack: ['足球/体育 AI 产品 C端', 'Memory Data', 'TTS', 'ASR', '语音交互设计', '语音唤醒', '语音产品设计', 'WebSocket · Web Audio/AudioWorklet · WASM/onnxruntime-web', 'sherpa-onnx_KWS', 'Silero_VAD', '&nbsp;火山引擎语音大模型<br>（双向流式 TTS/流式 ASR）', '⚽︎'],
      role: { zh: '端到端语音模块全链路涵 TTS、ASR、KWS、交互；<br><br>智能播报模块两大能力的从 0 到 1 设计与落地，覆盖「用户主动提问」与「系统主动播报」全场景；Memory流合并，覆盖用户主动提问与系统主动播报全场景。<br><br>覆盖交互设计、需求分析、技术选型、协议、链路搭建、前后端实现、测试模块开发与生产测试。', en: 'End-to-end ownership of the voice module pipeline, covering TTS, ASR, KWS, and interaction;<br><br>0-to-1 design and delivery of the smart commentary module&#39;s two core capabilities, covering the full range of "user-initiated questions" and "system-initiated announcements"; Memory stream merging across the same scenarios.<br><br>Scope covered interaction design, requirement analysis, technology selection, protocols, pipeline construction, front-end and back-end implementation, and test module development plus production testing.', ko: '리서치 프레임, 정보 계층, 시각화 컴포넌트, 인사이트 작성을 맡았습니다.' },
      outcome: { zh: 'TTS - 模型生成文本（被动/主动）做语音合成；涵 语音切片策略、交互流畅、TTS filler 方案、模型/声音选型、解耦原则<br><br><div>语音唤醒 - 设计三层半双工方案；设计RMS能量门——KWS|VAD——ASR<br><br></div><div>ASR - 自动（唤醒）/手动（按键）；涵 交互逻辑设计、模型/声音选型、测试平台搭建</div>', en: 'TTS — speech synthesis from model-generated text (passive and active), covering voice segmentation strategy, interaction fluency, the TTS filler approach, model and voice selection, and decoupling principles<br><br><div>Voice wake-up — designed a three-layer half-duplex scheme and an RMS energy gate: KWS | VAD | ASR<br><br></div><div>ASR — automatic (wake-word) and manual (push-to-talk), covering interaction logic design, model and voice selection, and test platform setup</div>', ko: '팀이 사용자 문제를 더 빠르게 찾고 설계 개선 방향으로 전환하도록 도왔습니다.' },
      details: [
        { zh: '针对"边看直播边互动"的碎片化场景，设计 Push-to-Talk 语音唤醒-语音输入-语音合成-智能播报 状态体系。', en: 'For the fragmented "interact while watching a live stream" scenario, designed a Push-to-Talk state system spanning voice wake-up → voice input → speech synthesis → smart commentary.', ko: '분산된 리서치 노트를 태그, 근거 체인, 우선순위로 구조화했습니다.' },
        { zh: '相关数据：103天 v1~v4版本、1727次代码提交、世界杯期间3倍新增用户、60w全网播放量、71%赛果预测准确率', en: 'Key figures: 103 days, v1–v4 releases, 1,727 code commits, 3× new-user growth during the World Cup, 600K+ total video views, and 71% match-result prediction accuracy.', ko: '' },
        { zh: 'URL：https://www.matchmate.chat/ （2026 FIFA World Cup / 联赛 / 欧冠）', en: 'URL: https://www.matchmate.chat/ (2026 FIFA World Cup / leagues / UEFA Champions League)', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 220,
      stackColors: ['', '', '', '', '', '', '', '', '', '', '', ''],
    },
    {
      id: 'agentic-study-planner',
      title: { zh: 'TCL 实业 - 鸿鹄实验室 🤖', en: 'TCL Industries — Honghu Lab 🤖', ko: 'AI 학습 계획 에이전트' },
      period: '2025',
      summary: { zh: '参与 TCL 家庭陪伴机器人 AiMe 的<span style="font-weight: bold; color: rgb(111, 215, 198);">全双工语音交互</span>模块研发。<div>围绕 TCL AI 语音机器人产品的各链路语音交互能力，涵盖&nbsp;<span style="color: rgb(111, 215, 198);">VAD检测</span>（三类模型选型优化）、<span style="color: rgb(111, 215, 198);">声学仿真</span>（WebRIR-Studio在线平台）、<span style="color: rgb(111, 215, 198);">语音增强</span>（WPE去混响评估）、<span style="color: rgb(111, 215, 198);">对话管理</span>（全双工四态数据构建）、<span style="color: rgb(111, 215, 198);">LLM打断识别</span>（Prompt Eng 多模型对比评测）</div>', en: 'Contributed to R&amp;D on the <span style="font-weight: bold; color: rgb(111, 215, 198);">full-duplex voice interaction</span> module of TCL&#39;s AiMe home companion robot.<div>Worked across the voice interaction capabilities of TCL&#39;s AI voice robot product line, covering&nbsp;<span style="color: rgb(111, 215, 198);">VAD detection</span> (selection and tuning across three model families), <span style="color: rgb(111, 215, 198);">acoustic simulation</span> (the WebRIR-Studio online platform), <span style="color: rgb(111, 215, 198);">speech enhancement</span> (WPE dereverberation evaluation), <span style="color: rgb(111, 215, 198);">dialogue management</span> (building full-duplex four-state data), and <span style="color: rgb(111, 215, 198);">LLM interruption detection</span> (multi-model comparative evaluation via prompt engineering)</div>', ko: '장기 학습 목표를 위한 계획 도구로, 작업 분해와 진행 추적, 피드백 요약을 결합했습니다.' },
      images: ['public/assets/PPTF.png', 'public/assets/TCLAiMe01.png', 'public/assets/TCLAiMe02.png', 'public/assets/WebRIR.jpg'],
      stack: ['LLM 打断设计', 'VAD ', 'NLP', '语音 ', '声学仿真', '全双工语音交互', 'HCI', 'WPE', 'LLM SFT seed data&nbsp;', 'LLM 训练数据', '🤖', '🎙️', '🤖', '🎙️', '🤖', '🎙️', '🤖', '🎙️'],
      role: { zh: '<span style="color: rgb(255, 155, 155);">- </span>AiMe 机器人需要中文全双工口语对话管理策略与数据，用于训练轻量级语义VAD。<br><span style="color: rgb(169, 163, 255);">- </span>声学组需验证不同房间尺寸、阵列间距、信噪比、混响时间对ASR/降噪算法的影响。<br><span style="color: rgb(242, 196, 109);">- </span>用户打断识别是影响智能语音交互自然性和用户体验的关键环节，需系统评估大模型在该场景下的表现。<br><span style="color: rgb(111, 215, 198);">- </span>为 AiMe 机器人选型并优化VAD模型。', en: '<span style="color: rgb(255, 155, 155);">- </span>The AiMe robot needed a Chinese full-duplex spoken dialogue management strategy and data for training a lightweight semantic VAD.<br><span style="color: rgb(169, 163, 255);">- </span>The acoustics team needed to verify how room size, array spacing, SNR, and reverberation time affect ASR and noise-reduction algorithms.<br><span style="color: rgb(242, 196, 109);">- </span>User interruption detection is a key factor in the naturalness of intelligent voice interaction and in user experience, and required a systematic evaluation of LLM performance in that scenario.<br><span style="color: rgb(111, 215, 198);">- </span>Selecting and optimizing VAD models for the AiMe robot.', ko: '제품 구조, 인터랙션 프로토타입, 프롬프트 흐름, 핵심 UI 구현을 담당했습니다.' },
      outcome: { zh: '<span style="color: rgb(255, 155, 155);">- </span>交付构建   [全双⼯对话系统策略 v1]   SFT 四态分布训练策略数据。<br><span style="color: rgb(169, 163, 255);">- </span>交付 WebRIR-Studio 在线平台，实现RIR生成-卷积-可视化一体化。<br><span style="color: rgb(242, 196, 109);">- </span>设计189条打断识别测试集，完成4款大模型对比实验，输出选型策略。<br><span style="color: rgb(111, 215, 198);">- </span>TEN/FSMN/Silero 三类 VAD 选型调优与WPE去混响评估，建立延迟-误差量化体系。<br>', en: '<span style="color: rgb(255, 155, 155);">- </span>Delivered the [Full-Duplex Dialogue System Strategy v1] build and SFT four-state distribution training strategy data.<br><span style="color: rgb(169, 163, 255);">- </span>Delivered the WebRIR-Studio online platform, integrating RIR generation, convolution, and visualization.<br><span style="color: rgb(242, 196, 109);">- </span>Designed a 189-sample interruption-detection test set, ran comparative experiments on four LLMs, and produced a model selection strategy.<br><span style="color: rgb(111, 215, 198);">- </span>Tuned and selected across the TEN/FSMN/Silero VAD families and evaluated WPE dereverberation, establishing a latency–error quantification framework.<br>', ko: '시연 가능한 프로토타입을 만들고 모호한 목표를 실행 계획으로 전환하는 흐름을 검증했습니다.' },
      details: [
        { zh: '语音前端：完成TEN/FSMN/Silero三类VAD算法横向评测与参数调优，建立延迟-误差量化评估体系，输出实时交互最优配置；完成27组极端RIR仿真与WPE去混响评估，验证RTF 0.45实时性与ΔSDR量化指标。', en: 'Voice front end: completed a side-by-side evaluation and parameter tuning of the TEN/FSMN/Silero VAD algorithms, built a latency–error quantitative evaluation framework, and delivered the optimal configuration for real-time interaction; ran 27 groups of extreme RIR simulations with WPE dereverberation evaluation, validating RTF 0.45 real-time performance and ΔSDR metrics.', ko: 'AI를 대체자가 아닌 보조자로 두어 사용자가 학습 리듬을 통제하도록 했습니다.' },
        { zh: '声学仿真：独立构建WebRIR-Studio在线仿真平台，实现RIR生成、卷积混音、2D/3D场景可视化一体化。', en: 'Acoustic simulation: independently built the WebRIR-Studio online simulation platform, integrating RIR generation, convolution mixing, and 2D/3D scene visualization.', ko: '' },
        { zh: '模型评测：设计189条多场景打断识别测试样本，完成4款大模型对比实验，输出选型建议与对话策略优化方案。', en: 'Model evaluation: designed 189 multi-scenario interruption-detection test samples, ran comparative experiments on four LLMs, and delivered model selection recommendations and dialogue strategy improvements.', ko: '' },
        { zh: '构建 SFT seed data 系统数据处理脚本，⾃动化处理覆盖 10k 原始语料与制作 100 条四态分布数据 策略，为机器⼈全双⼯对话系统奠定评估基准。对话数据：构建10k→100条论文级四态分布（Normal/RealINT/FakeINT/IncompleteQ）训练数据集。', en: 'Built SFT seed data processing scripts that automate handling of 10K raw utterances and a 100-sample four-state distribution strategy, establishing an evaluation baseline for the robot&#39;s full-duplex dialogue system. Dialogue data: built a 10K → 100 paper-grade four-state (Normal/RealINT/FakeINT/IncompleteQ) training dataset.', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 180,
      stackColors: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    },
    {
      id: 'timeline-project-1783547312494',
      title: { zh: '上海 bizfocus', en: 'Shanghai bizfocus', ko: '项目 3' },
      period: '2026',
      summary: { zh: '智能体设计 | To B 垂类 Agent/RAG 产品原型开发 | bizfocus 是一家专注于企业级AI/IT技术服务与数字化转型的高新技术企业。帮助企业将大模型与智能体能力真正接入业务流程、系统与企业知识。<br><div>本人主要负责面向B端企业客户的<span style="color: rgb(111, 215, 198);">智能体产品原型开发</span>与<span style="color: rgb(111, 215, 198);">智能体架构设计</span>。工作覆盖从需求分析、数据方案与处理、检索架构设计、工具链选型到多轮对话状态管理链路，参与<span style="color: rgb(111, 215, 198);">基于 LangGraph / LangChain / LlamaIndex / Dify 的企业级 Agentic RAG 系统构建</span>。</div>', en: 'Agent design | B2B vertical Agent/RAG product prototyping | bizfocus is a high-tech company focused on enterprise-grade AI/IT technical services and digital transformation, helping businesses bring LLM and agent capabilities into real workflows, systems, and corporate knowledge.<br><div>I was primarily responsible for <span style="color: rgb(111, 215, 198);">agent product prototyping</span> and <span style="color: rgb(111, 215, 198);">agent architecture design</span> for B2B enterprise clients. The work spanned requirement analysis, data strategy and processing, retrieval architecture design, toolchain selection, and multi-turn dialogue state management, participating in <span style="color: rgb(111, 215, 198);">enterprise-grade Agentic RAG system construction on LangGraph / LangChain / LlamaIndex / Dify</span>.</div>', ko: '项目简介' },
      images: ['/assets/Main Experiences/orion-7sjqjtmrfb8u5s.jpg', '/assets/Main Experiences/pmclo2-qdxwyymrfbe0tq.png', '/assets/Main Experiences/jalo-sn9zhxmrfbej55.png', '/assets/Main Experiences/blurred-image-ocd0wnmrfc1snw.png', '/assets/Main Experiences/blurred-image-1-nbvxglmrfc21db.png', '/assets/Main Experiences/blurred-image-2-kltm7xmrfc27ck.png'],
      stack: ['B端产品', '企业Agent', 'Agentic RAG', 'LangChain/LangGraph&nbsp;', '混合检索', '权限隔离', 'Function Calling', 'OCR&nbsp;', '多维复杂文档处理'],
      role: { zh: '为跨国快消企业好丽友（中国）构建面向中韩双语用户的<span style="color: rgb(111, 215, 198);">人事制度智能问答助手</span>。<br><br>面向上海电气旗下集优机械轴承业务，构建<br><span style="color: rgb(111, 215, 198);">轴承垂直领域的工程智能体系统</span>。<br><br>面向光伏组件精密工业制造场景，设计并构建基于 RAG 的<span style="color: rgb(111, 215, 198);">工业设备运维对话助手</span>。', en: 'Built a <span style="color: rgb(111, 215, 198);">bilingual (Chinese–Korean) HR policy Q&amp;A assistant</span> for the multinational FMCG company Orion (China).<br><br>For Shanghai Electric&#39;s Jiyou Machinery bearing business, built<br><span style="color: rgb(111, 215, 198);">an engineering agent system for the bearing vertical</span>.<br><br>For a precision photovoltaic module manufacturing scenario, designed and built a RAG-based <span style="color: rgb(111, 215, 198);">industrial equipment maintenance dialogue assistant</span>.', ko: '负责内容' },
      outcome: { zh: '完成三个B端智能体的原型设计：<br><br>好丽友人事智能体三路混合检索与7级权限隔离方案；<br>上海电气轴承智能体验证双通道检索与8个工程计算工具链交互；<br>晶澳运维智能体验证意图路由与图文混合文档解析方案。', en: 'Completed prototype design for three B2B agents:<br><br>Orion HR agent — three-way hybrid retrieval with a 7-level permission isolation scheme;<br>Shanghai Electric bearing agent — validated dual-channel retrieval and interaction with 8 engineering calculation tools;<br>JA Solar maintenance agent — validated intent routing and mixed text-and-image document parsing.', ko: '项目成果' },
      details: [
        { zh: '项目1 - 好丽友（中国）：系统基于 LangGraph 构建多轮对话智能体，核心挑战在于跨国企业人事制度的复杂权限体系、多语言输入以及制度条款的精准溯源。', en: 'Project 1 — Orion (China): a multi-turn dialogue agent built on LangGraph. The core challenges were the complex permission system of a multinational enterprise&#39;s HR policies, multilingual input, and precise provenance back to policy clauses.', ko: '' },
        { zh: '项目2 - 上海电气上海集优机械：系统需同时处理非结构化工程知识（设计手册、标准规范）与结构化产品参数（型号、载荷、寿命数据等），实现知识问答、参数查询、工程计算、选型推荐与应用指导的一体化服务。', en: 'Project 2 — Shanghai Electric / Shanghai Jiyou Machinery: the system had to handle both unstructured engineering knowledge (design manuals, standards and specifications) and structured product parameters (model, load, service-life data, etc.), delivering an integrated service for knowledge Q&amp;A, parameter lookup, engineering calculation, model selection recommendation, and application guidance.', ko: '' },
        { zh: '项目3 - 晶澳太阳能：工业场景文档类型复杂（操作手册、保养手册、气路图、流程图），且对回答安全性与可控性要求极高，设计建立端到端的多格式文档处理与智能问答管线。', en: 'Project 3 — JA Solar: industrial scenarios involve complex document types (operation manuals, maintenance manuals, pneumatic diagrams, flowcharts) and demand very high answer safety and controllability, so an end-to-end multi-format document processing and intelligent Q&amp;A pipeline was designed and built.', ko: '' },
        { zh: '注：相关图片均互联网获取与工作时合法环境下处理，原件未保留或传播，处理内容只做展示。', en: 'Note: the related images were obtained from the internet and handled in a lawful environment during work; the originals were neither retained nor distributed, and the processed content is shown for demonstration only.', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 170,
      stackColors: ['', '', '', '', '', '', '', '', ''],
    },
  ],
  galleryProjects: [
    {
      id: 'academic-project-1783703717535',
      title: { zh: 'UAV-NoiseSim: 基于无人机阵列自噪声的声场成像与声源识别', en: 'UAV-NoiseSim: Acoustic Field Imaging and Sound Source Identification Based on UAV Array Self-Noise', ko: '학술 프로젝트 11' },
      cover: '/assets/PPT/uav-noisesim-ebq1jlmrf7q380.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：UAV-NoiseSim 是一个面向无人机集群的声学感知与定位系统项目。其核心目标是开发一套在复杂仿真环境中，利用多无人机协作实现高精度声源定位（2D/3D）及声场成像的综合平台，并引入"自身噪声成像（Self-Noise Imaging）"这一创新概念。', en: 'Overview: UAV-NoiseSim is an acoustic sensing and localization system project for UAV swarms. Its core goal is an integrated platform that uses multi-UAV collaboration to achieve high-precision sound source localization (2D/3D) and acoustic field imaging in complex simulated environments, introducing the novel concept of "Self-Noise Imaging".', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783702352266',
      title: { zh: '基于 RAG 框架与 MCP 协议的实时跨平台新闻洞察解决方案', en: 'A Real-Time Cross-Platform News Insight Solution Based on the RAG Framework and MCP Protocol', ko: '학술 프로젝트 12' },
      cover: '/assets/PPT/rag-mcp-nbxkf1mrf7q8sy.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：基于 RAG 架构与 MCP 协议构建的 AI 原生实时新闻情报中枢。通过标准化接入全球多源新闻 API（Naver 等）与 MCP Tool（Exa） 并融合语言模型理解与生成能力，为媒体、企业及研究人员提供分钟级、结构化、可溯源的跨语言新闻洞察与决策支持。', en: 'Overview: An AI-native real-time news intelligence hub built on RAG architecture and the MCP protocol. By standardizing access to global multi-source news APIs (Naver and others) and MCP tools (Exa), and combining language model understanding with generation, it provides media, enterprises, and researchers with minute-level, structured, traceable cross-language news insight and decision support.', ko: '简介' },
      ],
      stack: ['Agent'],
      role: { zh: '针对大模型时效性知识滞后的核心痛点，设计基于 RAG + MCP 协议的实时新闻洞察 Agent，覆盖多源采集、智能摘要、事件关联分析，实现从单一API到混合数据源的自动化切换，实现新闻领域自动化跨平台检索。', en: 'Addressing the core pain point of lagging, time-sensitive LLM knowledge, designed a real-time news insight Agent based on RAG + the MCP protocol, covering multi-source collection, intelligent summarization, and event correlation analysis. It enables automated switching from a single API to mixed data sources and automated cross-platform news retrieval.', ko: '负责内容' },
      result: { zh: '结合 Eax MCP Tool 实现新闻摘要生成、事件关联分析与趋势预测。完成端到端自动化流程构建，实现跨平台新闻检索、生成与分析一体化，通过引入 MCP 协议替换传统单一 API 调用，显著降低运维成本。', en: 'Combined with the Exa MCP tool to deliver news summary generation, event correlation analysis, and trend forecasting. Completed an end-to-end automated pipeline that integrates cross-platform news retrieval, generation, and analysis; replacing traditional single-API calls with the MCP protocol significantly reduced operational overhead.', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704627504',
      title: { zh: '基于 RAG 框架与 MCP 协议的实时跨平台新闻洞察解决方案 (s2)', en: 'A Real-Time Cross-Platform News Insight Solution Based on the RAG Framework and MCP Protocol (s2)', ko: '학술 프로젝트 16' },
      cover: '/assets/PPT/rag-mcp-v5ch1gmrf7qir6.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：Anthropic 于 2024 年推出 MCP 这一标准化结构，也为大部分开发者提供了模型检索的一类解决方式，为解决了传统 LLM 知识滞后、幻觉及跨平台信息孤岛的痛点设计开发了该产品。随着LLM/Agent技术的快速迭代，模型的检索方式与框架也在不断优化与改变。', en: 'Overview: Anthropic introduced MCP in 2024 as a standardized structure, giving most developers one route to model retrieval. This product was designed and built to solve the pain points of traditional LLM knowledge lag, hallucination, and cross-platform information silos. As LLM/Agent technology iterates rapidly, retrieval methods and frameworks continue to be optimized and changed.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'multimodal-campus-guide',
      title: { zh: '基于语义的遗传算法特征选择', en: 'Semantic-Based Genetic Algorithm Feature Selection', ko: '멀티모달 캠퍼스 가이드' },
      cover: 'public/assets/Semantic-based GAFS.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：探索如何结合潜在语义分析（LSA）和遗传算法（GA）优化文档分类任务中的特征选择过程。通过研究 Semantic-based GAFS 论文的核心方法和实验设计，对其创新性和实用性进行全面剖析，并对相关技术进行实现与扩展。', en: 'Overview: Explores how to combine latent semantic analysis (LSA) and genetic algorithms (GA) to optimize feature selection in document classification tasks. By studying the core method and experimental design of the Semantic-based GAFS paper, it provides a full analysis of its novelty and practicality, and implements and extends the related techniques.', ko: 'AI와 서비스 디자인 역량을 함께 보여줍니다.' },
      ],
      stack: ['Multimodal AI', 'Service Design', 'Prototype'],
      role: { zh: '负责用户场景定义、体验流程、PPT 叙事结构与原型展示。', en: 'Responsible for user scenario definition, experience flow, PPT narrative structure, and prototype presentation.', ko: '사용자 시나리오, 경험 흐름, 발표 구조, 프로토타입 시연을 담당했습니다.' },
      result: { zh: '完成从问题定义到概念验证的完整展示材料。', en: 'Delivered complete presentation materials from problem definition to concept validation.', ko: '문제 정의부터 개념 검증까지의 전체 발표 자료를 완성했습니다.' },
      description: { zh: '以新生和访客为对象，探索语音、图像和位置上下文结合的校园信息服务。', en: 'Explored a campus information service combining voice, image, and location context, aimed at new students and visitors.', ko: '신입생과 방문자를 대상으로 음성, 이미지, 위치 맥락을 결합한 캠퍼스 정보 서비스를 탐색했습니다.' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'ai-product-ethics-review',
      title: { zh: 'GA 组合优化-二进制基因编码', en: 'GA Combinatorial Optimization — Binary Gene Encoding', ko: 'AI 제품 윤리 평가 프레임워크' },
      cover: 'public/assets/GAs_-CombinatorialOptimization -Binary Gene Encoding-세 가지 모형.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '연구 발표' },
      notes: [
        { zh: '简介：聚焦 GA 在组合优化问题中的应用，主要研究组合优化与二进制基因编码的问题理解与应用方法，包含三个主要问题解决（背包问题 / 排班问题 / 雷达布置问题）；优化容量、设计个体基因表示、平衡覆盖效果与资源消耗。', en: 'Overview: Focuses on the application of GA to combinatorial optimization problems, mainly studying problem understanding and application methods for combinatorial optimization and binary gene encoding. It covers three main problem solutions (knapsack problem / scheduling problem / radar placement problem): optimizing capacity, designing individual gene representations, and balancing coverage effectiveness against resource consumption.', ko: '' },
      ],
      stack: ['AI Ethics', 'Framework Design', 'Case Study'],
      role: { zh: '负责文献整理、评价维度设计、案例分析与视觉表达。', en: 'Responsible for literature review, evaluation dimension design, case analysis, and visual presentation.', ko: '문헌 조사, 평가 기준 설계, 사례 분석, 시각적 표현을 맡았습니다.' },
      result: { zh: '沉淀出可复用的 AI 产品风险检查清单。', en: 'Produced a reusable AI product risk checklist.', ko: 'AI 제품 평가에 재사용 가능한 위험 점검표를 만들었습니다.' },
      description: { zh: '围绕透明度、偏见、用户控制权和数据边界，构建面向产品团队的评估方法。', en: 'Built an evaluation method for product teams around transparency, bias, user control, and data boundaries.', ko: '투명성, 편향, 사용자 통제권, 데이터 경계를 중심으로 제품팀용 평가 방법을 구성했습니다.' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783271387635',
      title: { zh: '基于遗传算法 TSP 问题解决与交叉操作', en: 'Solving the TSP with Genetic Algorithms and Crossover Operations', ko: '학술 프로젝트 3' },
      cover: 'public/assets/GeneticAlgorithms -Crossover _TSP(0.0).png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：GA 在旅行商问题（TSP）中的应用与实现；研究 GA 的交叉操作，一种生成多样化子代解的关键机制。分析交叉策略，如何保留父代优秀特征的同时增加解的随机性；研究 GA 灵活性和实用性，特别是在路径优化问题中的强大能力。', en: 'Overview: The application and implementation of GA for the traveling salesman problem (TSP); studies GA crossover operations, a key mechanism for generating diverse offspring solutions. It analyzes crossover strategies — how to preserve good parental traits while increasing solution randomness — and examines the flexibility and practicality of GA, especially its power in route optimization problems.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704724713',
      title: { zh: 'LoRA 技术报告 (TA 报告)', en: 'LoRA Technical Report (TA Report)', ko: '학술 프로젝트 22' },
      cover: '/assets/PPT/lora-low-rank-adaption-202292004-vd1xlpmrf894s8.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：报告聚焦于 LoRA，作为微软研究院提出的代表性 PEFT 方法，通过低秩矩阵分解对权重增量进行参数化，在冻结预训练权重的前提下，以极少量可训练参数实现任务适配。报告系统性地阐释了 LoRA 如何通过低秩近似理论将大模型的下游适配问题。', en: 'Overview: The report focuses on LoRA, a representative PEFT method proposed by Microsoft Research that parameterizes weight increments through low-rank matrix decomposition, achieving task adaptation with a very small number of trainable parameters while keeping pretrained weights frozen. The report systematically explains how LoRA addresses the downstream adaptation problem of large models through low-rank approximation theory.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704629241',
      title: { zh: 'NLP-基于BERT和TextCNN新闻标题分类', en: 'NLP — News Headline Classification with BERT and TextCNN', ko: '학술 프로젝트 19' },
      cover: '/assets/PPT/bert-textcnn-cn-k2aeuymrf7quud.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：项目的目标是通过结合 BERT 和 TextCNN 模型，实现对中文新闻文本的高效分类。项目以 THUCNews 数据集为基础，数据标题涵盖金融、房地产、教育、科技等10个新闻类别，训练数据量达18万条，验证和测试数据各1万条，具有较高的规模和实用性。', en: 'Overview: The project goal was efficient classification of Chinese news text by combining BERT and TextCNN models. Built on the THUCNews dataset, the headlines cover 10 news categories including finance, real estate, education, and technology, with 180,000 training samples and 10,000 each for validation and test — a setup of considerable scale and practicality.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704629489',
      title: { zh: 'NLP-基于BERT和TextCNN新闻标题分类 (s2)', en: 'NLP — News Headline Classification with BERT and TextCNN (s2)', ko: '학술 프로젝트 20' },
      cover: '/assets/PPT/bert-textcnn-k3w9e2mrf7r63n.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：模型设计采用了 BERT 提取文本的全局语义特征，以及 TextCNN 提取局部特征的优势，形成了一种兼顾上下文理解和局部模式捕获的高效架构。BERT 模块用于生成深度语义表示，TextCNN 模块通过不同卷积核捕获关键特征，并结合全连接层完成分类任务。', en: 'Overview: The model design uses BERT to extract global semantic features from text and TextCNN to capture local features, forming an efficient architecture that balances contextual understanding with local pattern capture. The BERT module generates deep semantic representations, the TextCNN module captures key features through different convolution kernels, and a fully connected layer completes the classification task.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703717930',
      title: { zh: '强化学习贪吃蛇游戏比较DQN和A.C算法', en: 'Reinforcement Learning Snake Game — Comparing DQN and Actor-Critic', ko: '학술 프로젝트 12' },
      cover: '/assets/PPT/rl-ai-snake-9asnhwmrf76lih.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：利用强化学习方法，结合 DQN 和 Actor-Critic 算法实现了基于 Pygame 的贪吃蛇游戏智能体(RL语境下)。本研究通过对比DQN和A.C在贪吃蛇游戏中的强化学习效果。A.C算法在策略优化和环境适应性方面的优势，同时分析了两种方法的适用场景及优化方向。', en: 'Overview: Using reinforcement learning methods, DQN and Actor-Critic algorithms were combined to implement a Pygame-based snake game agent (in the RL sense). This study compares the reinforcement learning performance of DQN and A.C. in the snake game, examines the advantages of the A.C. algorithm in policy optimization and environment adaptability, and analyzes the applicable scenarios and optimization directions of both methods.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783581827816',
      title: { zh: '强化学习 (Dyna-Q 和 POPLIN)', en: 'Reinforcement Learning (Dyna-Q and POPLIN)', ko: '학술 프로젝트 9' },
      cover: '/assets/PPT/model-based-reinforcement-learning-dyna--xmsl41mrf6bnnd.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：研究了基于模型的强化学习方法，特别是 Dyna-Q 和 POPLIN 算法的实现和应用；通过构建环境模型；对比 Dyna-Q 和&nbsp;POPLIN 的动作，研究复杂环境中的学习性能；分析模型误差累积和优化不一致性的问题，分析改进方案。<br>', en: 'Overview: Studies model-based reinforcement learning methods, in particular the implementation and application of the Dyna-Q and POPLIN algorithms; builds environment models; compares the actions of Dyna-Q and&nbsp;POPLIN to study learning performance in complex environments; and analyzes the problems of model error accumulation and optimization inconsistency, along with improvement approaches.<br>', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704629745',
      title: { zh: '蒙特卡洛方法与时间差分学习', en: 'Monte Carlo Methods and Temporal-Difference Learning', ko: '학술 프로젝트 21' },
      cover: '/assets/PPT/monte-carlo-temporal-difference-learning-mjj2k7mrf7rk3g.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：对比了强化学习中的两种关键方法——蒙特卡洛方法和时间差分（TD）学习。分析两种方法在策略评估和改进中的适用场景；理解策略价值、局部更新、收敛速度等；并展示了 TD 学习在长期任务中的优势及其引入偏差的可能性。<br>', en: 'Overview: Compares two key methods in reinforcement learning — Monte Carlo methods and temporal-difference (TD) learning. It analyzes the applicable scenarios of each in policy evaluation and improvement; builds understanding of policy value, local updates, and convergence speed; and demonstrates the advantages of TD learning on long-horizon tasks along with its potential to introduce bias.<br>', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783702351369',
      title: { zh: 'Q-Learning 算法理解 &amp; 拓展', en: 'Understanding the Q-Learning Algorithm &amp; Extensions', ko: '학술 프로젝트 10' },
      cover: '/assets/PPT/q-learning-9sudiamrf6bxv2.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：本报告从理论原理到实践应用，再到前沿扩展，构建了完整的 Q-Learning 知识体系。经典 Q-Learning 虽受限于表格化表示，但其核心思想（时序差分更新、离线策略学习）仍是现代深度强化学习算法的理论基石。<br><br>', en: 'Overview: This report builds a complete Q-Learning knowledge system, from theoretical principles to practical application and on to frontier extensions. Although classic Q-Learning is limited by tabular representation, its core ideas (temporal-difference updates, off-policy learning) remain the theoretical cornerstone of modern deep reinforcement learning algorithms.<br><br>', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783284793108',
      title: { zh: '基于 AWS 的智能农业管理系统架构方案', en: 'AWS-Based Smart Agriculture Management System Architecture', ko: '학술 프로젝트 5' },
      cover: 'public/assets/PPT/agro-ict-aws-1-chkov8mrf6aeuj.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：在基于云计算的智能农业管理系统项目中，AWS 作为主要的云计算平台。关注于 AWS 环境下的智能农业管理系统架构，探讨如何运用云计算优化农业生产。<br><br><br>', en: 'Overview: In this cloud-computing-based smart agriculture management system project, AWS serves as the primary cloud platform. The work focuses on the architecture of a smart agriculture management system in an AWS environment and explores how cloud computing can be used to optimize agricultural production.<br><br><br>', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783284790924',
      title: { zh: '基于云计算的智能农业管理系统架构', en: 'Cloud-Computing-Based Smart Agriculture Management System Architecture', ko: '학술 프로젝트 4' },
      cover: '/assets/PPT/cloud-computing-smart-agricultural-manag-3m6pi2mrf69cx3.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：研究服务器架构与对比，探讨对架构的理解与使用的核心技术、各层级的理解、发展方向、技术应用。<br><br><br><br>', en: 'Overview: Studies and compares server architectures, exploring the understanding of architectures and the core technologies used, the understanding of each layer, development directions, and technical applications.<br><br><br><br>', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783581826807',
      title: { zh: '物联网-云计算-大数据应用服务与产业', en: 'IoT, Cloud Computing, and Big Data: Application Services and Industry', ko: '학술 프로젝트 7' },
      cover: '/assets/PPT/iot-dkre7bmrf6b5b2.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：主要探研究物联网（IoT）、云计算（Cloud Computing）和大数据（Big Data）在不同服务与行业中的规模型应用。以第四次工业革命为基准的基础服务方式研究。<br><br>', en: 'Overview: Mainly examines the large-scale applications of the Internet of Things (IoT), cloud computing, and Big Data across different services and industries. A study of foundational service models benchmarked against the Fourth Industrial Revolution.<br><br>', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783581827432',
      title: { zh: 'AI Living Lab-宏观智慧city研究', en: 'AI Living Lab — Macro Smart City Research', ko: '학술 프로젝트 8' },
      cover: '/assets/PPT/living-lab-202292004-w1xfpamrf6bbch.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：HCI到HAII再到CityAII，系统梳理了新加坡樟宜机场作为"智慧机场"标杆的 Living Lab 创新实践。樟宜机场 Living Lab 的"国家战略牵引—真实场景验证—商业生态闭环—全球标杆输出"模式。', en: 'Overview: From HCI to HAII and on to CityAII, this systematically reviews the Living Lab innovation practice that makes Singapore Changi Airport a benchmark "smart airport": the Changi Airport Living Lab model of national-strategy pull — real-scenario validation — a closed commercial ecosystem — global benchmark output.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704628185',
      title: { zh: '基于 ICBM 技术中引用的三种新服务', en: 'Three New Services Referenced in ICBM Technology', ko: '학술 프로젝트 17' },
      cover: '/assets/PPT/icbm-202292004-s4n84smrf87tlz.png',
      category: { zh: '学术驱动课题', en: 'Academic Topic', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：探讨ICBM的应用可能性。<br>三种架构：基于AR/VR的智能多功能平台-V isioninteraction、多样机器人系统管理与控制平台-Robo Link、多功能环境检测与数据管理系统-EcoTrack。', en: 'Overview: Explores the application possibilities of ICBM.<br>Three architectures: Visioninteraction, an AR/VR-based intelligent multi-function platform; Robo Link, a management and control platform for diverse robot systems; and EcoTrack, a multi-function environmental monitoring and data management system.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703719337',
      title: { zh: '利用LLM技术构建的青少年心理状态个性化问卷生成与评估系统 (s1)', en: 'LLM-Based Personalized Questionnaire Generation and Assessment System for Adolescent Mental State (s1)', ko: '학술 프로젝트 13' },
      cover: '/assets/PPT/a-bmcinjmrf772xl.png',
      category: { zh: '学术驱动项目-23年', en: 'Academic Project · 2023', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：一套能够动态生成问卷并精准评估心理状态的智能化系统。系统通过结合学生的背景信息生成个性化心理问卷，并分析回答数据以识别潜在问题。', en: 'Overview: An intelligent system capable of dynamically generating questionnaires and precisely assessing mental state. By combining students&#39; background information it generates personalized psychological questionnaires, and it analyzes response data to identify potential problems.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703719729',
      title: { zh: '利用LLM技术构建的青少年心理状态个性化问卷生成与评估系统 (s2)', en: 'LLM-Based Personalized Questionnaire Generation and Assessment System for Adolescent Mental State (s2)', ko: '학술 프로젝트 14' },
      cover: '/assets/PPT/b-seiu3vmrf779gh.png',
      category: { zh: '学术驱动项目-23年', en: 'Academic Project · 2023', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：创新点-传统心理问卷过于统一，难以准确反映每个学生的独特背景和需求。利用LLM技术，批量生成个性化与针对性心理问卷，可更好地了解学生心理状态。', en: 'Overview: Innovation — traditional psychological questionnaires are too uniform to accurately reflect each student&#39;s unique background and needs. Using LLM technology to generate personalized and targeted psychological questionnaires at scale makes it possible to better understand students&#39; mental state.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703720066',
      title: { zh: '利用LLM技术构建的青少年心理状态个性化问卷生成与评估系统 (s3)', en: 'LLM-Based Personalized Questionnaire Generation and Assessment System for Adolescent Mental State (s3)', ko: '학술 프로젝트 15' },
      cover: '/assets/PPT/c-id77pamrf77fig.png',
      category: { zh: '学术驱动项目-23年', en: 'Academic Project · 2023', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：目标-基于背景信息动态生成高针对性的心理问卷；分析问卷回答，识别学生的心理特征、情绪、趋势和潜在问题；提供精准的评估与干预建议。', en: 'Overview: Goals — dynamically generate highly targeted psychological questionnaires based on background information; analyze questionnaire responses to identify students&#39; psychological characteristics, emotions, trends, and potential problems; and provide precise assessment and intervention recommendations.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704725793',
      title: { zh: '生成式 AI 代码模型', en: 'Generative AI Code Models', ko: '학술 프로젝트 24' },
      cover: '/assets/PPT/ai-code-wsbaxgmrf89rrt.png',
      category: { zh: '学术驱动报告', en: 'Academic Report', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：介绍了 Copilot、Code Llama 与 AlphaCode 三种生成式 AI 代码模型的技术原理、核心特性与应用场景差异，展示 Copilot 在实际编程中的使用案例。', en: 'Overview: Introduces the technical principles, core features, and differing application scenarios of three generative AI code models — Copilot, Code Llama, and AlphaCode — and demonstrates real-world usage examples of Copilot in programming.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704725020',
      title: { zh: '生成式 AI 音频模型', en: 'Generative AI Audio Models', ko: '학술 프로젝트 23' },
      cover: '/assets/PPT/ai-osr5w9mrf89nig.png',
      category: { zh: '学术驱动报告', en: 'Academic Report', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：系统介绍当时主流的AI语音/音乐生成工具及其技术特点、应用场景和未来趋势。涵盖语音合成、音乐生成和文档音频化的技术路线。', en: 'Overview: A systematic introduction to the then-mainstream AI speech and music generation tools, their technical characteristics, application scenarios, and future trends. It covers the technical routes of speech synthesis, music generation, and document audio conversion.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704628441',
      title: { zh: 'Ubuntu 系统信息收集脚本', en: 'Ubuntu System Information Collection Script', ko: '학술 프로젝트 18' },
      cover: '/assets/PPT/linux-ubuntu-w29sk6mrf8z6zu.png',
      category: { zh: '学术驱动课题-23年', en: 'Academic Topic · 2023', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：课题-设计多功能 Shell 脚本，集成多种信息收集方法，用于快速收集和管理 Linux Ubuntu 系统的关键信息。<br><br>', en: 'Overview: Topic — design a multi-function Shell script that integrates several information collection methods for quickly gathering and managing key information from a Linux Ubuntu system.<br><br>', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783706768530',
      title: { zh: '嵌入场景 基于YOLO的无人机目标检测与追踪系统', en: 'Embedded Scenario: YOLO-Based UAV Object Detection and Tracking System', ko: '학술 프로젝트 27' },
      cover: '/assets/PPT/yolo-12-s09p5gmrf8z2gw.png',
      category: { zh: '学术驱动项目-23年', en: 'Academic Project · 2023', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：结合使用 YOLOv3-Tiny 与 djitellopy Tello 无人机训练自定义数据集，实现高精度检测。 嵌入式场景下的高精度目标识别与跟踪，实现视频流采集、图像处理及目标检测功能。', en: 'Overview: Combines YOLOv3-Tiny with a djitellopy Tello drone to train a custom dataset and achieve high-precision detection. High-precision object recognition and tracking in an embedded scenario, implementing video stream capture, image processing, and object detection.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783706764848',
      title: { zh: '针对老年人的专科医院选址 (s1)', en: 'Specialty Hospital Site Selection for the Elderly (s1)', ko: '학술 프로젝트 25' },
      cover: '/assets/PPT/20260711020252-lnebirmrf8yni5.png',
      category: { zh: '学术驱动项目-22年', en: 'Academic Project · 2022', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：基于数据分析与机器学习方法，针对老年人口医疗，设计的一套数据驱动的医院选址优化模型。通过标准化指标和加权评分模型，评估候选区域的适宜性并进行预测与分析。', en: 'Overview: Based on data analysis and machine learning methods, a data-driven hospital site selection optimization model designed for elderly healthcare. Through standardized indicators and a weighted scoring model, it assesses the suitability of candidate areas and performs prediction and analysis.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783706765224',
      title: { zh: '针对老年人的专科医院选址 (s2)', en: 'Specialty Hospital Site Selection for the Elderly (s2)', ko: '학술 프로젝트 26' },
      cover: '/assets/PPT/20260711020215-omvzc3mrf8yubo.png',
      category: { zh: '学术驱动项目-22年', en: 'Academic Project · 2022', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：引入ARIMA(时序预测)模型进行未来老年人口密度的时序预测，以及MLP Regressor(多层感知器回归模型)进行人口数据的回归分析，预测未来趋势和资源需求变化。', en: 'Overview: Introduces an ARIMA (time-series forecasting) model for time-series prediction of future elderly population density, together with an MLP Regressor (multilayer perceptron regression model) for regression analysis of population data, to predict future trends and changes in resource demand.', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: 'Responsibilities', ko: '负责内容' },
      result: { zh: '项目成果', en: 'Outcomes', ko: '项目成果' },
      description: { zh: '项目描述', en: 'Description', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
  ],
  courses: [
    {
      id: 'courses-1785005893895',
      title: { zh: '2022 2nd Semester', en: '2022 2nd Semester', ko: '新模块' },
      body: { zh: '<span style="color: rgb(111, 215, 198);">----------------------------------------</span>', en: '<span style="color: rgb(111, 215, 198);">----------------------------------------</span>', ko: '描述' },
      tags: ['Software Thinking | 软件思维&nbsp;', 'Image Processing | 图像处理（CV）', 'Basic programming and practice | 基础编程与实践', 'Problem solving algorithm | 算法', 'Artificial Intelligence Early Semester | ai人工智能ONE'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
    {
      id: 'courses-1785005894711',
      title: { zh: '2023 1st Semester', en: '2023 1st Semester', ko: '新模块' },
      body: { zh: '<span style="color: rgb(111, 215, 198);">----------------------------------------</span>', en: '<span style="color: rgb(111, 215, 198);">----------------------------------------</span>', ko: '描述' },
      tags: ['Python Programming and Practice | Python编程与实践', 'Introduction to Probability and Statistics | 概率统计导论', 'Data analysis basics | 数据分析基础', 'Foundation and utilization of artificial intelligence | 人工智能基础与应用'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
    {
      id: 'courses-1785005895343',
      title: { zh: '2023 2nd Semester', en: '2023 2nd Semester', ko: '新模块' },
      body: { zh: '<span style="color: rgb(111, 215, 198);">----------------------------------------</span>', en: '<span style="color: rgb(111, 215, 198);">----------------------------------------</span>', ko: '描述' },
      tags: ['Advanced Artificial Intelligence Mathematics | 高等人工智能数学', 'Machine learning | 机器学习', 'Deep learning | 深度学习', 'Linux operating System | Linux操作系统', 'Service learning | 服务学习-社会AI应用'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
    {
      id: 'courses-1785005895655',
      title: { zh: '2024 1st Semester', en: '2024 1st Semester', ko: '新模块' },
      body: { zh: '<span style="color: rgb(255, 155, 155);">----------------------------------------</span>', en: '<span style="color: rgb(255, 155, 155);">----------------------------------------</span>', ko: '描述' },
      tags: ['4th Industrial Revolution and Technology | 第四次工业革命与技术', 'Basic robot programming | 基础机器人编程', 'unsupervised learning | 无监督学习', 'Genetic Algorithm | 遗传算法', 'Cloud Computing | 云计算'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
    {
      id: 'courses-1785005896075',
      title: { zh: '2024 2nd Semester', en: '2024 2nd Semester', ko: '新模块' },
      body: { zh: '<span style="color: rgb(255, 155, 155);">----------------------------------------</span>', en: '<span style="color: rgb(255, 155, 155);">----------------------------------------</span>', ko: '描述' },
      tags: ['Reinforced Learning | 强化学习', 'Natural language processing | 自然语言处理', 'Advanced Neural Network | 高级神经网络', 'AI Living Lab I / AI生活实验室 I'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
    {
      id: 'courses-1785005912349',
      title: { zh: '2025 1nd &amp; 2nd Semester', en: '2025 1st &amp; 2nd Semester', ko: '新模块' },
      body: { zh: '<span style="color: rgb(255, 155, 155);">----------------------------------------</span>', en: '<span style="color: rgb(255, 155, 155);">----------------------------------------</span>', ko: '描述' },
      tags: ['Artificial Intelligence System | 人工智能系统（LLM）', 'Intelligence HCI | 智能人机交互', 'Research Project | 论文项目', 'Individual Project | 个人项目'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
  ],
  major: [
    {
      id: 'ai-major',
      title: { zh: '<span style="color: rgb(109, 198, 243);">JJU</span> AI 介绍', en: '<span style="color: rgb(109, 198, 243);">JJU</span> AI Program Introduction', ko: '인공지능 전공 배경' },
      body: { zh: '<span style="font-size: 0.85em;">‘韩国全州大学’ 人工智能系隶属于软件融合学院旗下。</span><div><span style="font-size: 0.85em;">全罗北道地区入选教育部“先进领域创新融合大学项目（人工智能领域）”的七所大学（系​​）之一。作为政府（教育部）指定的先进部门。</span></div><div><span style="font-size: 0.85em;">部门目标是培养具备第四次工业革命时代所需的专业人工智能知识和应用技能的创意人工智能专业人士。</span></div>', en: '<span style="font-size: 0.85em;">The Department of Artificial Intelligence at Jeonju University, Korea, sits under the College of Software Convergence.</span><div><span style="font-size: 0.85em;">It is one of the seven universities (departments) in Jeollabuk-do selected by the Ministry of Education for the "Advanced Field Innovation Convergence University Project (AI field)", and is a government (Ministry of Education) designated advanced department.</span></div><div><span style="font-size: 0.85em;">The department&#39;s goal is to cultivate creative AI professionals equipped with the specialized AI knowledge and applied skills required in the era of the Fourth Industrial Revolution.</span></div>', ko: '전공 학습은 머신러닝, 딥러닝, 자료구조, 알고리즘, 지능형 시스템 응용을 포함합니다. 기술 이해를 명확하고 미감 있으며 실용적인 제품 표현으로 전환하고자 합니다.' },
      tags: ['- 校被教育部选为“高科技领域创新融合大学项目（AI领域）”项目成员，是全北地区唯一提供奖学金和海外培训等多项福利的大学（系）。', '- 建立人工智能专业课程和最佳教育环境，系统学习人工智能（AI）及其应用，这正是第四次工业革命的核心。', '- 作为政府（教育部）指定的高科技部门，该部门开展富有创意且有趣的就业导向教育项目，如基于人工智能的智能无人机、机器人和聊天机器人的实施。'],
      images: ['/assets/Major/logo-w-dnembymri6a2so.png', '/assets/Major/jju001-ttsk85ms128cr7.jpg'],
      imageHeight: 184,
      imagePos: ['0 93.3', '0 97.6'],
      widthPct: 100,
    },
    {
      id: 'major-1783708320775',
      title: { zh: '<span style="color: rgb(155, 200, 228);">多伦多大学 UofT</span> - Mechanical &amp;e lndustrial Engineering | 维护优化与可靠性工程中心ML项目（C-MORE）', en: '<span style="color: rgb(155, 200, 228);">University of Toronto (UofT)</span> — Mechanical &amp; Industrial Engineering | ML Program at the Centre for Maintenance Optimization and Reliability Engineering (C-MORE)', ko: '新模块' },
      body: { zh: '<div><span style="font-size: 13.6px;">机器学习（ML）与强化学习（RL）领域的学术交流与专项学习。通过系统课程、实际项目实践及研讨会交流，探索强化学习技术在工业优化中的应用。</span></div><div><span style="font-size: 13.6px;">CHI-GUHN LEE PROFESSOR, MECHANICAL &amp; INDUSTRIAL DIRECTOR, C-MORE</span></div><div><span style="font-size: 13.6px;">Course dates : 2024(2M)</span></div>', en: '<div><span style="font-size: 13.6px;">Academic exchange and focused study in the fields of machine learning (ML) and reinforcement learning (RL). Through structured coursework, hands-on project practice, and seminar exchange, explored the application of reinforcement learning techniques to industrial optimization.</span></div><div><span style="font-size: 13.6px;">CHI-GUHN LEE, PROFESSOR, MECHANICAL &amp; INDUSTRIAL ENGINEERING; DIRECTOR, C-MORE</span></div><div><span style="font-size: 13.6px;">Course dates: 2024 (2 months)</span></div>', ko: '描述' },
      tags: [],
      images: ['/assets/Major/4753dc017b76beda8554fbf059c3f77-bo6nq6ms13npus.jpg', '/assets/Major/5c2053fd92af17b86277456aebf2d98-lv1kk0ms161lbl.jpg', '/assets/Major/43dfad83277e7a697127e957e550b8d-2qjar3ms16226m.jpg'],
      imageHeight: 172,
      imagePos: ['4.9 21', '97.7 64.2', '42.8 74.9'],
      widthPct: 100,
    },
    {
      id: 'major-1785026517450',
      title: { zh: 'NVIDIA - 首尔科技大学', en: 'NVIDIA — Seoul National University of Science and Technology (SeoulTech)', ko: '新模块' },
      body: { zh: '基于 Transformer 的自然语言处理应用程序构建；LLM_NLP 培训<br>Certification lD: aFrzLsXdTk-mE7KTYuIYGQ', en: 'Building natural language processing applications based on Transformers; LLM_NLP training<br>Certification ID: aFrzLsXdTk-mE7KTYuIYGQ', ko: '描述' },
      tags: [],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 31,
    },
    {
      id: 'major-1785027004205',
      title: { zh: 'AutoCar ⾃动驾驶比赛 - AI⿊客松⼀等奖&nbsp;', en: 'AutoCar Autonomous Driving Competition — AI Hackathon First Prize&nbsp;', ko: '新模块' },
      body: { zh: '韩国 Hanback Electronics 提供技术支持，实现自动驾驶车辆的自主导航与动态环境适应能力；获得“ AI 해커톤 AI를 활용한 auto Car 자율 주행 부문 「최우수상」', en: 'Technically supported by Hanback Electronics, Korea, implementing autonomous navigation and dynamic environment adaptation for an autonomous vehicle; awarded the "Grand Prize" (최우수상) in the AI Hackathon autonomous driving category (AI를 활용한 Auto Car 자율 주행 부문)', ko: '描述' },
      tags: [],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 35.6,
    },
    {
      id: 'major-1785027090253',
      title: { zh: '2023 世界⽆⼈机⾜球⼤赛 – 四强', en: '2023 World Drone Soccer Championship — Top 4', ko: '新模块' },
      body: { zh: '2023 第⼀届世界⽆⼈机⾜球⼤赛(FIDA World Championship)“KDSA University Division”&nbsp; <br>韩国高校组 - 四强 (首发)<br>', en: '2023 Inaugural World Drone Soccer Championship (FIDA World Championship), "KDSA University Division"&nbsp;<br>Korean university division — Top 4 (starting lineup)<br>', ko: '描述' },
      tags: [],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
  ],
  recentResearch: [
    {
      id: 'research-1783454578512',
      kind: '论文-DM',
      title: { zh: 'LLM-Enhanced Dialogue Management for Full-Duplex Spoken Dialogue Systems', en: 'LLM-Enhanced Dialogue Management for Full-Duplex Spoken Dialogue Systems', ko: '新条目' },
      link: 'https://arxiv.org/abs/2502.14145',
      note: { zh: 'LLM - 全双工语音交互设计（Ten）', en: 'LLM — full-duplex voice interaction design (Ten)', ko: '' },
      image: '/assets/pa-01-0ksj9qmrb3y8kd.png',
      pdf: '',
      imageMode: 'contain',
      imageHeight: 320,
      widthPct: 24,
    },
    {
      id: 'research-1783456194447',
      kind: '论文-DM',
      title: { zh: 'Language Model Can Listen While Speaking', en: 'Language Model Can Listen While Speaking', ko: '新条目' },
      link: 'https://arxiv.org/abs/2408.02622',
      note: { zh: 'LLM - 全双工语音交互设计（Ten）', en: 'LLM — full-duplex voice interaction design (Ten)', ko: '' },
      image: '/assets/PaPer/paper-language-model-can-listen-while-sp-guyvyhmria06zq.png',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 25,
    },
    {
      id: 'research-1783456196695',
      kind: '论文-DM',
      title: { zh: 'A Survey of Full-Duplex Spoken Dialogue Systems_Architectural Hierarchy, Interaction Ontology, and Decision State Machine', en: 'A Survey of Full-Duplex Spoken Dialogue Systems_Architectural Hierarchy, Interaction Ontology, and Decision State Machine', ko: '新条目' },
      link: 'https://arxiv.org/abs/2606.19453',
      note: { zh: 'LLM - 全双工语音交互设计（Ten）', en: 'LLM — full-duplex voice interaction design (Ten)', ko: '' },
      image: '/assets/PaPer/paper-a-survey-of-full-duplex-spoken-dia-pjupyfmria1kso.png',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 24,
    },
    {
      id: 'research-1784886615715',
      kind: '论文-AI预测',
      title: { zh: 'WorldCupArena: Fine-Grained Evaluation of Language Models and Deep-Research Agents on Football Forecasting', en: 'WorldCupArena: Fine-Grained Evaluation of Language Models and Deep-Research Agents on Football Forecasting', ko: '新条目' },
      link: 'https://arxiv.org/abs/2607.18084',
      note: { zh: '', en: '', ko: '' },
      image: '/assets/PaPer/worldcuparena-fine-grained-evaluation-of-hrt8s3mryrguo1.png',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 295,
      widthPct: 24,
    },
    {
      id: 'research-1787326883692',
      kind: '博客',
      title: { zh: 'SeedRealtime 音视频全双工大模型发布：走向全模态自然交互', en: 'SeedRealtime Audio-Visual Full-Duplex LLM Released: Toward Omni-Modal Natural Interaction', ko: '新条目' },
      link: '',
      note: { zh: 'SeedRealtime 用统一架构原生融合音频、视频与文本，能在连续的多模态信息流上实时交互，带来“边看、边听、边说”的全新体验。<br>三项核心突破：音视频联合理解、主动的交互能力、流畅的交互节奏。<br>项目主页：<span style="font-size: 0.86rem;">https://seed.bytedance.com/seedrealtime</span>', en: 'SeedRealtime natively fuses audio, video, and text within a unified architecture, enabling real-time interaction over continuous multimodal information streams and delivering a new experience of watching, listening, and speaking at the same time.<br>Three core breakthroughs: joint audio-visual understanding, proactive interaction capability, and fluid interaction pacing.<br>Project page: <span style="font-size: 0.86rem;">https://seed.bytedance.com/seedrealtime</span>', ko: '' },
      image: 'https://seed.bytedance.com/zh/blog/seedrealtime-audio-visual-full-duplex-llm-released-toward-omni-modal-natural-interaction?view_from=content_recommend',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1787258445852',
      kind: '博客',
      title: { zh: '美团技术团队 | 由浅入深讲解Agent评测', en: 'Meituan Tech Team | A Step-by-Step Guide to Agent Evaluation', ko: '新条目' },
      link: '',
      note: { zh: '本文由美团图灵Agent评测团队两年实战经验所得。<br><br><br><br>', en: 'This article draws on two years of hands-on experience from the Meituan Turing Agent Evaluation team.<br><br><br><br>', ko: '' },
      image: 'https://www.xiaohongshu.com/explore/6a794b740000000028000e4b?app_platform=ios&app_version=9.41.2&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CB9wPDBBy6GZlCSPlwf7sDkBBgs5463O4bTD2uxMcFC3Q=&author_share=1&xhsshare=WeixinSession&shareRedId=N0lHRTtGPUE2NzUyOTgwNjc7OTpFOTpK&apptime=1786353135&share_id=995517fdeae74f3288be0356f51d1bfb&code=83kE16rwVu5&wechatWid=ef1738f18f7be25215402f817e01e4de&wechatOrigin=menu',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1784887439598',
      kind: '博客',
      title: { zh: '产品介绍：MatchMate成长回顾｜你的AI看球搭子', en: 'Product Introduction: The MatchMate Story | Your AI Football Companion', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/FxMvbfNeU8FuGMWMHzynfg',
      note: { zh: '历时103天，MatchMate从一个实时AI看球Demo起步，逐步扩展到多比赛、语音、AI预测、玩法游戏，集线上互动和线下观赛为一体的AI辅助观赛综合体。<br><br>', en: 'Over the course of 103 days, MatchMate grew from a real-time AI match-watching demo into a multi-match experience with voice, AI prediction, and gameplay games — an AI-assisted viewing platform that brings online interaction and offline match-day viewing together.<br><br>', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1784887654964',
      kind: '博客',
      title: { zh: '产品介绍：「你好，搭子！」—— MatchMate 相关功能', en: 'Product Introduction: "Hello, Buddy!" — MatchMate Features', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/t3c_T4BSKE_HhGC-yvxpow',
      note: { zh: 'MatchMate AI看球搭子在世界杯期间和大家一起经历了许多迭代更新，包括语音唤醒、音色升级与线下第二现场等。将聊天转到了通话，将线上聚拢到了线下。从性能、玩法、细节上做了多处更新！<br><br>', en: 'During the World Cup, the MatchMate AI football companion went through many iterations with everyone, including voice wake-up, upgraded voice timbres, and offline second-screen events. Chat became voice calls, and online gatherings became offline ones. Many updates landed across performance, gameplay, and detail.<br><br>', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1784887599381',
      kind: '博客',
      title: { zh: '产品介绍：你的世界杯AI看球搭子来啦！使用指南请查收~', en: 'Product Introduction: Your World Cup AI Football Companion Is Here! Please Check the User Guide~', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/hIYPQI2vuLmZGF5QYvs05Q',
      note: { zh: '“MatchMate: AI看球搭子"是由上海交通大学人工智能学院学生创业团队打造的一套面向足球观赛场景的 AI 互动观赛系统。帮助过程中随时提问、追问、理解赛况，并实时获取、自动整理各类比赛数据，从被动观看进入更主动的观赛参与。', en: '"MatchMate: AI Football Companion" is an AI interactive match-watching system for football viewing scenarios, built by a student startup team from the School of Artificial Intelligence at Shanghai Jiao Tong University. It helps viewers ask and follow up on questions at any time, understand the match situation, and obtain and automatically organize all kinds of match data in real time — moving from passive watching into more active participation in the viewing experience.', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1784886617442',
      kind: '博客',
      title: { zh: '语音对话里的轮次判断：从级联到统一', en: 'Turn Detection in Spoken Dialogue: From Cascaded to Unified', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/kplZs2Nam_KTfnBzhvJFKw',
      note: { zh: '目前除了端到端对话系统之外，业界普遍在语音链路上外挂一个独立的轮次判断（turn detection）模型，充当"语义级 VAD"；该方案不侵入对话主干、工程可控且便于替换，已成为落地全双工系统的主流路线之一。五个代表性公开工作，按统一结构梳理其输入输出、模型架构与设计取舍。', en: 'Currently, beyond end-to-end dialogue systems, the industry commonly attaches an independent turn detection model to the speech pipeline to act as a "semantic-level VAD". Because this approach does not intrude on the dialogue backbone, is engineering-controllable, and is easy to replace, it has become one of the mainstream routes for shipping full-duplex systems. This piece reviews five representative public works, organizing their inputs and outputs, model architectures, and design trade-offs within a unified structure.', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1783581833184',
      kind: '博客',
      title: { zh: 'GFT：把 SFT 当成“极度稀疏奖励 + 不稳定重要性权重“的 RL 重做一遍', en: 'GFT: Revisiting SFT as RL with Extremely Sparse Rewards and Unstable Importance Weights', ko: '新条目' },
      link: 'https://blog.csdn.net/shibing624/article/details/161121458',
      note: { zh: '本文提出GFT方法,从RL视角重新审视SFT训练,发现SFT本质上是一种奖励极度稀疏且重要性权重不稳定的RL形式。<br><br>', en: 'This paper proposes the GFT method, re-examining SFT training from an RL perspective and finding that SFT is essentially a form of RL with extremely sparse rewards and unstable importance weights.<br><br>', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
  ],
  sectionTitles: {
    "experience": { zh: '主要经历', en: 'Experience', ko: '주요 경력' },
    "gallery": { zh: '学术驱动项目-个人', en: 'Academic Projects', ko: '학술 갤러리' },
    "intro": { zh: '个人简介', en: 'Profile', ko: '소개' },
    "major": { zh: '专业背景与经历介绍', en: 'Major Background', ko: '전공' },
    "courses": { zh: '相关课程', en: 'Related Courses', ko: '수업' },
  },
  uiStrings: {
    "pillStack": { zh: 'Stack', en: 'Stack', ko: 'Stack' },
    "resumeLabel": { zh: '当前简历 · CV', en: 'Current Resume · CV', ko: '이력서 · CV' },
    "galleryMore": { zh: '查看详情', en: 'View details', ko: '자세히 보기' },
    "pillOutcome": { zh: '功能落地与验证', en: 'Delivery &amp; Validation', ko: '결과' },
    "resumeView": { zh: '查看简历', en: 'View resume', ko: '이력서 보기' },
    "footNote": { zh: 'Vite + React · GitHub Pages / Vercel / Cloudflare Pages', en: 'Vite + React · GitHub Pages / Vercel / Cloudflare Pages', ko: 'Vite + React · GitHub Pages' },
    "pillRole": { zh: '产品定位与设计', en: 'Positioning &amp; Design', ko: '역할' },
  },
  palette: '',
};