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
    siteTitle: 'ZXEQzzg_Csy.github.io - 个人经历Web',
    tickerLabel: { zh: '近期内容', en: 'Recent', ko: '최근 소식' },
    ticker: [
      { id: 'ticker-1783715176788', text: { zh: '“你好搭子” 最新更新 KWS 模块', en: '', ko: '' }, image: '/assets/Recent/hidazi-x6o2hpmrfdznnn.png', imageHeight: 81 },
      { id: 'ticker-1783715350836', text: { zh: '”搭子“语音优化', en: '', ko: '' }, image: '/assets/Recent/0789ac0bffcb94ca59ead86c726bacc-i0t73emrfeadt1.jpg', imageHeight: 101 },
      { id: 'ticker-1783715737567', text: { zh: 'MatchMeta AI ⚽︎', en: '', ko: '' }, image: '/assets/Recent/fc89fd0fe754202699f1550be8a7d87-w7hr0emrfeb5kf.jpg', imageHeight: 99 },
      { id: 'ticker-1784885971822', text: { zh: '产品: b站 80W+播放', en: '', ko: '' }, image: '/assets/Recent/20260724173844-knr26rmryrrh24.png', imageHeight: 99 },
      { id: 'ticker-1784885976734', text: { zh: '世界杯的故事结束了!<br>', en: '', ko: '' }, image: '/assets/Recent/20260724174132-vjusw4mryru0qq.jpg', imageHeight: 102 },
      { id: 'ticker-1784885977638', text: { zh: 'MMai 产品介绍', en: '', ko: '' }, image: '/assets/Recent/15e7909b72bc213f3513824f5fe6392-23w8k8mryscsww.jpg', imageHeight: 99 },
    ],
    headline: { zh: '<span style="font-size: 23px;">AI / LLM 专业背景 - AI Agent 产品/交互方向 - HAII 方式 - 前沿客户端侧工程</span><div><span style="font-size: 23px;">AI 语音交互 - TTS | ASR | VAD | KWS | 声学仿真&nbsp;</span></div>', en: 'AI background, product design sense, research-driven project practice', ko: 'AI 전공 기반, 제품 디자인 감각, 연구 중심 프로젝트 경험' },
    intro: { zh: '<span style="font-size: 16px;">Hi！我是陈斯阳，毕业于韩国全州大学人工智能专业（2022–2026届），在研究端与工作端我专注于大语言模型相关应用研究与AI工程领域，具备从项目研究、产品分析到工程落地的能力。感谢你的了解，期待与你沟通~</span>', en: 'I focus on how AI systems move into real product contexts, balancing model capability, user experience, and explainable design.', ko: 'AI 시스템이 실제 제품 환경에 들어가는 방식에 관심이 있으며 모델 성능, 사용자 경험, 설명 가능한 설계의 균형을 중시합니다.' },
    research: { zh: '<span style="font-size: 0.85em;"><span style="font-weight: bold; color: rgb(111, 215, 198);">研究方向</span><span style="color: rgb(111, 215, 198); font-weight: bold;">：</span>Agent 多领域应用 | Agent Memory | 语音（TTS/ASR/VAD/KWS/声学SIM）| LLM 全双工语音交互 | Agent HCI&nbsp;</span><div><span style="font-size: 0.85em;"><span style="font-weight: bold; color: rgb(111, 215, 198);">工程具备</span><span style="font-weight: bold; color: rgb(111, 215, 198);">：</span>AI 工程方式的前沿技术 | Agent与语音交互方式 | 快速搭建原型流 | 用户需求分析 | 技术交互类产品研究</span></div>', en: 'Research interests: multimodal interaction, agentic applications, AI-assisted design, and data-driven product analysis.', ko: '연구 관심사: 멀티모달 인터랙션, 에이전트 애플리케이션, AI 보조 디자인, 데이터 기반 제품 분석.' },
    location: { zh: '中国 / 可远程协作', en: 'China / Remote collaboration', ko: '중국 / 원격 협업 가능' },
    links: [
      { label: 'Email', value: 'ZXEQzzg@163.com', href: 'ZXEQzzg@163.com' },
      { label: 'GitHub', value: 'github.com/ZXEQzzg', href: 'https://github.com/ZXEQzzg' },
      { label: 'Portfolio', value: 'ZXEQzzg_Csy.github.io', href: 'https://ZXEQzzg-Csy.github.io' },
      { label: '电话', value: '+86 13248371107', href: '·' },
      { label: '微信', value: 'WeChat：John_H_Hua_Sheng', href: '·' },
    ],
    resume: { images: ['public/assets/--个人简历_CHENSIYANG--_PM.jpg'], pdf: '/assets/chensiyang-pm-ar8re1mrb2m3cz.pdf' },
    heroHeight: 628,
  },
  skills: {
    title: { zh: '技术栈', en: 'Technical Stack', ko: '기술 스택' },
    groups: [
      { name: { zh: 'AI+  领域', en: 'AI / Data', ko: 'AI / 데이터' }, items: ['LLM', 'Agentic RAG', 'NLP', 'ASR', 'TTS ', 'VAD', 'Agent Tool', 'Function Calling', 'MCP', 'Skill', 'Prompt Eng', 'Context Eng', 'Agent Memory', 'KWS'], theme: 'teal', itemColors: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
      { name: { zh: '开发 | 工程 | Vibe Codding', en: 'Product / Design', ko: '제품 / 디자인' }, items: ['Python', 'Linux', 'DoAcker', 'Git', 'LangChain', 'Workflow', 'RAG 评估/测评', 'vibe IDE/CLI 开发 - Claude Code | Codex | KIRO | Gemini&amp;Antigravity | Trae | Copilot | Windsurf | CodeBuddy', 'GitHub Pages', 'FDE'], theme: 'violet', itemColors: ['', '', '', '', '', '', '', '', '', ''] },
      { name: { zh: 'AI+ 产品', en: 'Engineering', ko: '엔지니어링' }, items: ['AI  模型评估与选型', '需求分析 & PRD 撰写', 'Agent 产品设计', '产品交互', '⽤⼾场景分析', '结构 / ⾮结构化数据处理', 'Canva', 'Axure', '墨⼑', 'Figma'], theme: 'gold', itemColors: ['', '', '', '', '', '', '', '', '', ''] },
    ],
  },
  timelineProjects: [
    {
      id: 'design-research-dashboard',
      title: { zh: 'MatchMate AI - 看球搭子（上海交通大学人工智能学院）<span style="color: rgb(111, 215, 198);">⚽</span>', en: 'Design Research Insight Dashboard', ko: '디자인 리서치 인사이트 대시보드' },
      period: '2026',
      summary: { zh: 'MatchMate · 足球 AI 搭子 —— 语音系统与智能播报模块产品设计/研发负责人<div>我们是来自上海交通大学人工智能学院的创业团队，MatchMate: AI 看球搭子 是我们打造一款<span style="color: rgb(111, 215, 198); font-weight: bold;">AI看球产品</span>，希望在信息爆炸、观点纷杂的媒体时代,能够借助AI的力量,把观众重新带回比赛本身。让每个人都能<span style="color: rgb(111, 215, 198); font-weight: bold;">边看边问</span>、<span style="color: rgb(111, 215, 198); font-weight: bold;">边看边懂</span>。<br>MatchMate 是一款<span style="font-weight: bold; color: rgb(111, 215, 198);">面向足球⚽︎观众的 实时 AI 陪伴与技术分析应用</span>，基于 SportMonks 实时数据/Zhibo8 事件流与大模型生成能力构建，为用户提供<span style="color: rgb(111, 215, 198); font-weight: bold;">赛前、赛中、赛后的个性化解说</span>，包含专业实时赛时数据、AI 数据预测、产品互动等多维度生态。我作为AI语音交互模块产品负责人，主导语音交互与赛场智能播报两大<span style="color: rgb(111, 215, 198); font-weight: bold;">「无手交互」能力的从0到1设计</span>，覆盖用户主动提问与系统主动播报全场景。</div>', en: 'Organized interviews, competitive research, and course feedback into traceable product decisions.', ko: '인터뷰, 경쟁 분석, 수업 피드백을 추적 가능한 제품 판단으로 정리했습니다.' },
      images: ['/assets/Main Experiences/logopng-nrdgckmri7zv2d.png', '/assets/Main Experiences/fc89fd0fe754202699f1550be8a7d87-4d28dvmri7zqr7.jpg', '/assets/Main Experiences/image-quo3qamri8xpuc.png', '/assets/Main Experiences/20260711045201-o15nrumri8dqby.png', '/assets/Main Experiences/20260711034242-d3fbkimri8dus1.png', '/assets/Main Experiences/20260712062036-7x2kw8mri8dzto.png', '/assets/Main Experiences/20260709040853-goosbmmri84k6a.png', '/assets/Main Experiences/20260526000916-e2u1ismri8dcrd.png', '/assets/Main Experiences/20260529044555-ujkl73mri8dk9n.png', '/assets/Main Experiences/fbti-f4nncpmri8xze5.png', '/assets/Main Experiences/1-asr00smri8y5bo.png', '/assets/Main Experiences/2-tnvmbrmri8yate.png', '/assets/Main Experiences/3-5d8g5rmri8yeus.png', '/assets/Main Experiences/4-8q0b3cmri8yk97.png', '/assets/Main Experiences/15e7909b72bc213f3513824f5fe6392-tlj390mryrtbrg.jpg'],
      stack: ['足球/体育 AI 产品 C端', 'Memory Data', 'TTS', 'ASR', '语音交互设计', '语音唤醒', '语音产品设计', 'WebSocket · Web Audio/AudioWorklet · WASM/onnxruntime-web', 'sherpa-onnx_WKS', 'Silero_VAD', '&nbsp;火山引擎语音大模型<br>（双向流式 TTS/流式 ASR）', '⚽︎'],
      role: { zh: '端到端语音模块全链路涵 TTS、ASR、KWS、交互；<br><br>智能播报模块两大能力的从 0 到 1 设计与落地，覆盖「用户主动提问」与「系统主动播报」全场景；<br><br>覆盖交互设计、需求分析、技术选型、协议、链路搭建、前后端实现、测试模块开发与生产测试。', en: 'Led research framing, information hierarchy, visualization components, and insight writing.', ko: '리서치 프레임, 정보 계층, 시각화 컴포넌트, 인사이트 작성을 맡았습니다.' },
      outcome: { zh: 'TTS - 模型生成文本（被动/主动）做语音合成；涵 语音切片策略、交互流畅、TTS filler 方案、模型/声音选型、解耦原则<br><br><div>语音唤醒 - 设计三层半双工方案；设计能量门——KWS|VAD——ASR<br><br></div><div>ASR - 自动（唤醒）/手动（按键）；涵 交互逻辑设计、模型/声音选型、测试平台搭建</div>', en: 'Helped the team identify user pain points faster and convert findings into design iteration directions.', ko: '팀이 사용자 문제를 더 빠르게 찾고 설계 개선 방향으로 전환하도록 도왔습니다.' },
      details: [
        { zh: '针对"边看直播边互动"的碎片化场景，设计 Push-to-Talk 语音唤醒-语音输入-语音合成-智能播报 状态体系。', en: 'Replaced loose research notes with tags, evidence chains, and priority levels.', ko: '분산된 리서치 노트를 태그, 근거 체인, 우선순위로 구조화했습니다.' },
        { zh: '相关数据：103天 v1~v4版本、1727次代码提交、世界杯期间3倍新增用户、60w全网播放量、71%赛果预测准确率', en: '', ko: '' },
        { zh: 'URL：https://www.matchmate.chat/ （2026 FIFA World Cup / 联赛 / 欧冠）', en: '', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 220,
      stackColors: ['', '', '', '', '', '', '', '', '', '', '', ''],
    },
    {
      id: 'agentic-study-planner',
      title: { zh: 'TCL 实业 - 鸿鹄实验室 🤖', en: 'AI Study Planning Agent', ko: 'AI 학습 계획 에이전트' },
      period: '2025',
      summary: { zh: '参与 TCL 家庭陪伴机器人 AiMe 的<span style="font-weight: bold; color: rgb(111, 215, 198);">全双工语音交互</span>模块研发。', en: 'A planning tool for long-term study goals with task decomposition, progress tracking, and reflective feedback.', ko: '장기 학습 목표를 위한 계획 도구로, 작업 분해와 진행 추적, 피드백 요약을 결합했습니다.' },
      images: ['public/assets/PPTF.png', 'public/assets/TCLAiMe01.png', 'public/assets/TCLAiMe02.png', 'public/assets/WebRIR.jpg'],
      stack: ['LLM 打断设计', 'VAD ', 'NLP', '语音 ', '声学仿真', '全双工语音交互', 'HCI', 'WPE', 'LLM SFT seed data&nbsp;'],
      role: { zh: '混响消除 / 语音激活检测 / 语音识别 / 语音打断等', en: 'Owned product structure, interaction prototype, prompt workflow, and core UI implementation.', ko: '제품 구조, 인터랙션 프로토타입, 프롬프트 흐름, 핵심 UI 구현을 담당했습니다.' },
      outcome: { zh: '算法的参数调优、性能优化，构建横向对⽐实验框架 / 搭建  WebRIR-Studio  在线仿真平台并上线 / 全双⼯对话系统策略 v1', en: 'Built a demonstrable prototype and validated the path from vague goals to executable plans.', ko: '시연 가능한 프로토타입을 만들고 모호한 목표를 실행 계획으로 전환하는 흐름을 검증했습니다.' },
      details: [
        { zh: '主要负责各模块的数据仿真及性能测试，优化端到端链路的时延和稳定性，提升对话的自然度和准确率。', en: 'Reduced maintenance cost with phase goals, task cards, and reflection summaries.', ko: '단계 목표, 작업 카드, 회고 요약의 세 계층으로 관리 부담을 낮췄습니다.' },
        { zh: '通过房间脉冲响应（RIR）模拟与加权预测误差（WPE）去混响实验，验证在不同声源距离和角度条件下的语音增强效果', en: 'Positioned AI as assistance rather than replacement, preserving user control over learning rhythm.', ko: 'AI를 대체자가 아닌 보조자로 두어 사용자가 학습 리듬을 통제하도록 했습니다.' },
        { zh: '构建  SFT seed data  系统数据处理脚本，⾃动化处理覆盖  10k  原始语料与制作  100  条四态分布数据 策略，为机器⼈全双⼯对话系统奠定评估基准。', en: '', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 180,
      stackColors: ['', '', '', '', '', '', '', '', ''],
    },
    {
      id: 'timeline-project-1783547312494',
      title: { zh: '上海 bizfocus', en: '项目 3', ko: '项目 3' },
      period: '2026',
      summary: { zh: '智能体设计 | To B 垂类 Agent/RAG 产品原型开发 | bizfocus 是一家专注于企业级AI/IT技术服务与数字化转型的高新技术企业。帮助企业将大模型与智能体能力真正接入业务流程、系统与企业知识。<br><div>本人主要负责面向B端企业客户的<span style="color: rgb(111, 215, 198);">智能体产品原型开发</span>与<span style="color: rgb(111, 215, 198);">智能体架构设计</span>。工作覆盖从需求分析、数据方案与处理、检索架构设计、工具链选型到多轮对话状态管理链路，参与基于 LangGraph / LangChain / LlamaIndex / Dify 的企业级 Agentic RAG 系统构建。</div>', en: '项目简介', ko: '项目简介' },
      images: ['/assets/Main Experiences/orion-7sjqjtmrfb8u5s.jpg', '/assets/Main Experiences/pmclo2-qdxwyymrfbe0tq.png', '/assets/Main Experiences/jalo-sn9zhxmrfbej55.png', '/assets/Main Experiences/blurred-image-ocd0wnmrfc1snw.png', '/assets/Main Experiences/blurred-image-1-nbvxglmrfc21db.png', '/assets/Main Experiences/blurred-image-2-kltm7xmrfc27ck.png'],
      stack: ['B端产品', '企业Agent', 'Agentic RAG', 'LangChain/LangGraph&nbsp;', '混合检索', '权限隔离', 'Function Calling', 'OCR&nbsp;', '多维复杂文档处理'],
      role: { zh: '为跨国快消企业好丽友（中国）构建面向中韩双语用户的人事制度智能问答助手。<br><br>面向上海电气旗下集优机械轴承业务，构建轴承垂直领域的工程智能体系统。<br><br>面向光伏组件精密工业制造场景，设计并构建基于 RAG 的工业设备运维对话助手。', en: '负责内容', ko: '负责内容' },
      outcome: { zh: '完成三个B端智能体的原型设计：<br><br>好丽友人事智能体验证三路混合检索与7级权限隔离方案；<br>上海电气轴承智能体验证双通道检索与8个工程计算工具链交互；<br>晶澳运维智能体验证意图路由与图文混合文档解析方案。', en: '项目成果', ko: '项目成果' },
      details: [
        { zh: '好丽友（中国）：系统基于 LangGraph 构建多轮对话智能体，核心挑战在于跨国企业人事制度的复杂权限体系、多语言输入以及制度条款的精准溯源。', en: '', ko: '' },
        { zh: '上海电气上海集优机械：系统需同时处理非结构化工程知识（设计手册、标准规范）与结构化产品参数（型号、载荷、寿命数据等），实现知识问答、参数查询、工程计算、选型推荐与应用指导的一体化服务。', en: '', ko: '' },
        { zh: '晶澳太阳能：工业场景文档类型复杂（操作手册、保养手册、气路图、流程图），且对回答安全性与可控性要求极高，设计建立端到端的多格式文档处理与智能问答管线。', en: '', ko: '' },
        { zh: '注：相关图片均互联网获取与工作时合法环境下处理，原件未保留与传播，只做记录。', en: '', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 170,
      stackColors: ['', '', '', '', '', '', '', '', ''],
    },
  ],
  galleryProjects: [
    {
      id: 'academic-project-1783703717535',
      title: { zh: 'UAV-NoiseSim: 基于无人机阵列自噪声的声场成像与声源识别', en: 'Academic Project 11', ko: '학술 프로젝트 11' },
      cover: '/assets/PPT/uav-noisesim-ebq1jlmrf7q380.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：UAV-NoiseSim 是一个面向无人机集群的声学感知与定位系统项目。其核心目标是开发一套在复杂仿真环境中，利用多无人机协作实现高精度声源定位（2D/3D）及声场成像的综合平台，并引入"自身噪声成像（Self-Noise Imaging）"这一创新概念。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783702352266',
      title: { zh: '基于 RAG 框架与 MCP 协议的实时跨平台新闻洞察解决方案', en: 'Academic Project 12', ko: '학술 프로젝트 12' },
      cover: '/assets/PPT/rag-mcp-nbxkf1mrf7q8sy.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：基于 RAG 架构与 MCP 协议构建的 AI 原生实时新闻情报中枢。通过标准化接入全球多源新闻 API（Naver 等）与 MCP Tool（Exa） 并融合语言模型理解与生成能力，为媒体、企业及研究人员提供分钟级、结构化、可溯源的跨语言新闻洞察与决策支持。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704627504',
      title: { zh: '基于 RAG 框架与 MCP 协议的实时跨平台新闻洞察解决方案 (s2)', en: 'Academic Project 16', ko: '학술 프로젝트 16' },
      cover: '/assets/PPT/rag-mcp-v5ch1gmrf7qir6.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：Anthropic 于 2024 年推出 MCP 这一标准化结构，也为大部分开发者提供了模型检索的一类解决方式，为解决了传统 LLM 知识滞后、幻觉及跨平台信息孤岛的痛点设计开发了该产品。随着LLM/Agent技术的快速迭代，模型的检索方式与框架也在不断优化与改变。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'multimodal-campus-guide',
      title: { zh: '基于语义的遗传算法特征选择', en: 'Multimodal Campus Guide', ko: '멀티모달 캠퍼스 가이드' },
      cover: 'public/assets/Semantic-based GAFS.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：探索如何结合潜在语义分析（LSA）和遗传算法（GA）优化文档分类任务中的特征选择过程。通过研究 Semantic-based GAFS 论文的核心方法和实验设计，对其创新性和实用性进行全面剖析，并对相关技术进行实现与扩展。', en: 'Shows integrated AI and service design capability.', ko: 'AI와 서비스 디자인 역량을 함께 보여줍니다.' },
      ],
      stack: ['Multimodal AI', 'Service Design', 'Prototype'],
      role: { zh: '负责用户场景定义、体验流程、PPT 叙事结构与原型展示。', en: 'Defined user scenarios, experience flow, presentation narrative, and prototype demo.', ko: '사용자 시나리오, 경험 흐름, 발표 구조, 프로토타입 시연을 담당했습니다.' },
      result: { zh: '完成从问题定义到概念验证的完整展示材料。', en: 'Delivered complete materials from problem definition to concept validation.', ko: '문제 정의부터 개념 검증까지의 전체 발표 자료를 완성했습니다.' },
      description: { zh: '以新生和访客为对象，探索语音、图像和位置上下文结合的校园信息服务。', en: 'Explored a campus information service combining voice, image, and location context for new students and visitors.', ko: '신입생과 방문자를 대상으로 음성, 이미지, 위치 맥락을 결합한 캠퍼스 정보 서비스를 탐색했습니다.' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'ai-product-ethics-review',
      title: { zh: 'GA 组合优化-二进制基因编码', en: 'AI Product Ethics Review Framework', ko: 'AI 제품 윤리 평가 프레임워크' },
      cover: 'public/assets/GAs_-CombinatorialOptimization -Binary Gene Encoding-세 가지 모형.png',
      category: { zh: '学术驱动项目', en: 'Research Presentation', ko: '연구 발표' },
      notes: [
        { zh: '简介：聚焦 GA 在组合优化问题中的应用，主要研究组合优化与二进制基因编码的问题理解与应用方法，包含三个主要问题解决（背包问题 / 排班问题 / 雷达布置问题）；优化容量、设计个体基因表示、平衡覆盖效果与资源消耗。', en: '', ko: '' },
      ],
      stack: ['AI Ethics', 'Framework Design', 'Case Study'],
      role: { zh: '负责文献整理、评价维度设计、案例分析与视觉表达。', en: 'Handled literature review, evaluation dimensions, case analysis, and visual storytelling.', ko: '문헌 조사, 평가 기준 설계, 사례 분석, 시각적 표현을 맡았습니다.' },
      result: { zh: '沉淀出可复用的 AI 产品风险检查清单。', en: 'Produced a reusable risk checklist for AI product evaluation.', ko: 'AI 제품 평가에 재사용 가능한 위험 점검표를 만들었습니다.' },
      description: { zh: '围绕透明度、偏见、用户控制权和数据边界，构建面向产品团队的评估方法。', en: 'Built a product-team-oriented evaluation method around transparency, bias, user control, and data boundaries.', ko: '투명성, 편향, 사용자 통제권, 데이터 경계를 중심으로 제품팀용 평가 방법을 구성했습니다.' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783271387635',
      title: { zh: '基于遗传算法 TSP 问题解决与交叉操作', en: 'Academic Project 3', ko: '학술 프로젝트 3' },
      cover: 'public/assets/GeneticAlgorithms -Crossover _TSP(0.0).png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：GA 在旅行商问题（TSP）中的应用与实现；研究 GA 的交叉操作，一种生成多样化子代解的关键机制。分析交叉策略，如何保留父代优秀特征的同时增加解的随机性；研究 GA 灵活性和实用性，特别是在路径优化问题中的强大能力。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704724713',
      title: { zh: 'LoRA 技术报告 (TA 报告)', en: 'Academic Project 22', ko: '학술 프로젝트 22' },
      cover: '/assets/PPT/lora-low-rank-adaption-202292004-vd1xlpmrf894s8.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：报告聚焦于 LoRA，作为微软研究院提出的代表性 PEFT 方法，通过低秩矩阵分解对权重增量进行参数化，在冻结预训练权重的前提下，以极少量可训练参数实现任务适配。报告系统性地阐释了 LoRA 如何通过低秩近似理论将大模型的下游适配问题。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704629241',
      title: { zh: '基于BERT和TextCNN新闻标题分类', en: 'Academic Project 19', ko: '학술 프로젝트 19' },
      cover: '/assets/PPT/bert-textcnn-cn-k2aeuymrf7quud.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：项目的目标是通过结合 BERT 和 TextCNN 模型，实现对中文新闻文本的高效分类。项目以 THUCNews 数据集为基础，数据标题涵盖金融、房地产、教育、科技等10个新闻类别，训练数据量达18万条，验证和测试数据各1万条，具有较高的规模和实用性。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704629489',
      title: { zh: '基于BERT和TextCNN新闻标题分类 (s2)', en: 'Academic Project 20', ko: '학술 프로젝트 20' },
      cover: '/assets/PPT/bert-textcnn-k3w9e2mrf7r63n.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：模型设计采用了 BERT 提取文本的全局语义特征，以及 TextCNN 提取局部特征的优势，形成了一种兼顾上下文理解和局部模式捕获的高效架构。BERT 模块用于生成深度语义表示，TextCNN 模块通过不同卷积核捕获关键特征，并结合全连接层完成分类任务。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703717930',
      title: { zh: '强化学习贪吃蛇游戏比较DQN和A.C算法', en: 'Academic Project 12', ko: '학술 프로젝트 12' },
      cover: '/assets/PPT/rl-ai-snake-9asnhwmrf76lih.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：利用强化学习方法，结合 DQN 和 Actor-Critic 算法实现了基于 Pygame 的贪吃蛇游戏智能体(RL语境下)。本研究通过对比DQN和A.C在贪吃蛇游戏中的强化学习效果。展示了A.C算法在策略优化和环境适应性方面的优势，同时分析了两种方法的适用场景及优化方向。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783284793108',
      title: { zh: '基于 AWS 的智能农业管理系统架构方案', en: 'Academic Project 5', ko: '학술 프로젝트 5' },
      cover: 'public/assets/PPT/agro-ict-aws-1-chkov8mrf6aeuj.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：在基于云计算的智能农业管理系统项目中，AWS 作为主要的云计算平台。关注于 AWS 环境下的智能农业管理系统架构，探讨如何运用云计算优化农业生产。<br><br><br><br>', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783284790924',
      title: { zh: '基于云计算的智能农业管理系统架构', en: 'Academic Project 4', ko: '학술 프로젝트 4' },
      cover: '/assets/PPT/cloud-computing-smart-agricultural-manag-3m6pi2mrf69cx3.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：研究服务器架构与对比，探讨对架构的理解与使用的核心技术、各层级的理解、发展方向、技术应用。<br><br><br><br><br>', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783581827816',
      title: { zh: '强化学习 (Dyna-Q 和 POPLIN)', en: 'Academic Project 9', ko: '학술 프로젝트 9' },
      cover: '/assets/PPT/model-based-reinforcement-learning-dyna--xmsl41mrf6bnnd.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：研究了基于模型的强化学习方法，特别是 Dyna-Q 和 POPLIN 算法的实现和应用；通过构建环境模型；对比 Dyna-Q 和&nbsp;POPLIN 的动作，研究复杂环境中的学习性能；分析模型误差累积和优化不一致性的问题，分析改进方案。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704629745',
      title: { zh: '蒙特卡洛方法与时间差分学习', en: 'Academic Project 21', ko: '학술 프로젝트 21' },
      cover: '/assets/PPT/monte-carlo-temporal-difference-learning-mjj2k7mrf7rk3g.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：对比了强化学习中的两种关键方法——蒙特卡洛方法和时间差分（TD）学习。分析两种方法在策略评估和改进中的适用场景；理解策略价值、局部更新、收敛速度等；并展示了 TD 学习在长期任务中的优势及其引入偏差的可能性。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783702351369',
      title: { zh: 'Q-Learning 算法理解 &amp; 拓展', en: 'Academic Project 10', ko: '학술 프로젝트 10' },
      cover: '/assets/PPT/q-learning-9sudiamrf6bxv2.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：本报告从理论原理到实践应用，再到前沿扩展，构建了完整的 Q-Learning 知识体系。经典 Q-Learning 虽受限于表格化表示，但其核心思想（时序差分更新、离线策略学习）仍是现代深度强化学习算法的理论基石。<br><br>', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783581826807',
      title: { zh: '物联网-云计算-大数据应用服务与产业', en: 'Academic Project 7', ko: '학술 프로젝트 7' },
      cover: '/assets/PPT/iot-dkre7bmrf6b5b2.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：主要探研究物联网（IoT）、云计算（Cloud Computing）和大数据（Big Data）在不同服务与行业中的规模型应用。以第四次工业革命为基准的基础服务方式研究。<br><br>', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783581827432',
      title: { zh: 'AI Living Lab-宏观智慧city研究', en: 'Academic Project 8', ko: '학술 프로젝트 8' },
      cover: '/assets/PPT/living-lab-202292004-w1xfpamrf6bbch.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：HCI到HAII再到CityAII，系统梳理了新加坡樟宜机场作为"智慧机场"标杆的 Living Lab 创新实践。樟宜机场 Living Lab 的"国家战略牵引—真实场景验证—商业生态闭环—全球标杆输出"模式。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704628185',
      title: { zh: '基于 ICBM 技术中引用的三种新服务', en: 'Academic Project 17', ko: '학술 프로젝트 17' },
      cover: '/assets/PPT/icbm-202292004-s4n84smrf87tlz.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：探讨ICBM的应用可能性。<br>三种架构：基于AR/VR的智能多功能平台-V isioninteraction、多样机器人系统管理与控制平台-Robo Link、多功能环境检测与数据管理系统-EcoTrack。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703719337',
      title: { zh: '利用LLM技术构建的青少年心理状态个性化问卷生成与评估系统 (s1)', en: 'Academic Project 13', ko: '학술 프로젝트 13' },
      cover: '/assets/PPT/a-bmcinjmrf772xl.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介：一套能够动态生成问卷并精准评估心理状态的智能化系统。系统通过结合学生的背景信息生成个性化心理问卷，并分析回答数据以识别潜在问题。', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703719729',
      title: { zh: '利用LLM技术构建的青少年心理状态个性化问卷生成与评估系统 (s2)', en: 'Academic Project 14', ko: '학술 프로젝트 14' },
      cover: '/assets/PPT/b-seiu3vmrf779gh.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783703720066',
      title: { zh: '利用LLM技术构建的青少年心理状态个性化问卷生成与评估系统 (s3)', en: 'Academic Project 15', ko: '학술 프로젝트 15' },
      cover: '/assets/PPT/c-id77pamrf77fig.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704725793',
      title: { zh: '学术项目 24', en: 'Academic Project 24', ko: '학술 프로젝트 24' },
      cover: '/assets/PPT/ai-code-wsbaxgmrf89rrt.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704725020',
      title: { zh: '学术项目 23', en: 'Academic Project 23', ko: '학술 프로젝트 23' },
      cover: '/assets/PPT/ai-osr5w9mrf89nig.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783704628441',
      title: { zh: '学术项目 18', en: 'Academic Project 18', ko: '학술 프로젝트 18' },
      cover: '/assets/PPT/linux-ubuntu-w29sk6mrf8z6zu.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783706768530',
      title: { zh: '学术项目 27', en: 'Academic Project 27', ko: '학술 프로젝트 27' },
      cover: '/assets/PPT/yolo-12-s09p5gmrf8z2gw.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783706765224',
      title: { zh: '学术项目 26', en: 'Academic Project 26', ko: '학술 프로젝트 26' },
      cover: '/assets/PPT/20260711020215-omvzc3mrf8yubo.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
    {
      id: 'academic-project-1783706764848',
      title: { zh: '学术项目 25', en: 'Academic Project 25', ko: '학술 프로젝트 25' },
      cover: '/assets/PPT/20260711020252-lnebirmrf8yni5.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 180,
      hidden: false,
    },
  ],
  courses: [
    {
      id: 'human-ai-interaction',
      title: { zh: '人机交互与 AI 产品设计', en: 'Human-AI Interaction and Product Design', ko: 'Human-AI Interaction 및 제품 디자인' },
      body: { zh: '关注智能系统如何解释自身能力、处理用户反馈，并在复杂任务中建立信任。', en: 'Focused on how intelligent systems explain capabilities, process feedback, and build trust in complex tasks.', ko: '지능형 시스템이 자신의 능력을 설명하고 피드백을 처리하며 복잡한 작업에서 신뢰를 형성하는 방식에 집중했습니다.' },
      tags: ['HCI', 'AI UX', 'Trust'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
    {
      id: 'data-analysis',
      title: { zh: '数据分析与可视化', en: 'Data Analysis and Visualization', ko: '데이터 분석 및 시각화' },
      body: { zh: '从数据清洗、指标构建到可视化表达，强调让结论服务于产品判断。', en: 'Covered data cleaning, metric design, and visualization with product decision-making as the goal.', ko: '데이터 정제, 지표 설계, 시각화를 다루며 제품 판단에 기여하는 결론을 강조했습니다.' },
      tags: ['Python', 'Visualization', 'Metrics'],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 33.3,
    },
  ],
  major: [
    {
      id: 'ai-major',
      title: { zh: 'JJU AI 专业介绍', en: 'Artificial Intelligence Background', ko: '인공지능 전공 배경' },
      body: { zh: '<span style="font-size: 0.85em;">韩国全州大学人工智能系隶属于软件融合学院旗下。</span><div><span style="font-size: 0.85em;">作为全罗北道地区唯一入选教育部“先进领域创新融合大学项目（人工智能领域）”的七所大学（系​​），本校享有奖学金和海外培训等各种福利。配置专门的人工智能课程和最佳教育环境，使学生能够系统、有趣且轻松地学习人工智能及其应用，这是第四次工业革命的核心。作为政府（教育部）指定的先进部门，我们开展富有创意和趣味性的就业导向型教育项目，例如实施基于人工智能的智能无人机、机器人和聊天机器人。</span></div>', en: 'My academic background covers machine learning, deep learning, data structures, algorithms, and intelligent system applications. I aim to translate technical understanding into clear, aesthetic, and practical product expression.', ko: '전공 학습은 머신러닝, 딥러닝, 자료구조, 알고리즘, 지능형 시스템 응용을 포함합니다. 기술 이해를 명확하고 미감 있으며 실용적인 제품 표현으로 전환하고자 합니다.' },
      tags: [],
      images: ['/assets/Major/logo-w-dnembymri6a2so.png'],
      imageHeight: 120,
      imagePos: ['63.8 100'],
      widthPct: 52,
    },
    {
      id: 'major-1783708320775',
      title: { zh: 'JJU AI 专业介绍', en: '新模块', ko: '新模块' },
      body: { zh: '<div><span style="font-size: 0.85em;">部门目标是培养具备第四次工业革命时代所需的专业人工智能知识和应用技能的创意人工智能专业人士。</span></div><div><span style="font-size: 0.85em;">-校被教育部选为“高科技领域创新融合大学项目（AI领域）”项目成员，是全北地区唯一提供奖学金和海外培训等多项福利的大学（系）。</span></div><div><span style="font-size: 0.85em;">- 建立人工智能专业课程和最佳教育环境，系统学习人工智能（AI）及其应用，这正是第四次工业革命的核心。</span></div><div><span style="font-size: 0.85em;">- 作为政府（教育部）指定的高科技部门，该部门开展富有创意且有趣的就业导向教育项目，如基于人工智能的智能无人机/机器人和聊天机器人的实施。</span></div>', en: '描述', ko: '描述' },
      tags: [],
      images: [],
      imageHeight: 200,
      imagePos: [],
      widthPct: 41.5,
    },
  ],
  recentResearch: [
    {
      id: 'research-1783454578512',
      kind: '论文-DM',
      title: { zh: 'LLM-Enhanced Dialogue Management for Full-Duplex Spoken Dialogue Systems', en: '新条目', ko: '新条目' },
      link: 'https://arxiv.org/abs/2502.14145',
      note: { zh: 'LLM - 全双工语音交互设计（Ten）', en: '', ko: '' },
      image: '/assets/pa-01-0ksj9qmrb3y8kd.png',
      pdf: '',
      imageMode: 'contain',
      imageHeight: 320,
      widthPct: 24,
    },
    {
      id: 'research-1783456194447',
      kind: '论文-DM',
      title: { zh: 'Language Model Can Listen While Speaking', en: '新条目', ko: '新条目' },
      link: 'https://arxiv.org/abs/2408.02622',
      note: { zh: 'LLM - 全双工语音交互设计（Ten）', en: '', ko: '' },
      image: '/assets/PaPer/paper-language-model-can-listen-while-sp-guyvyhmria06zq.png',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 25,
    },
    {
      id: 'research-1783456196695',
      kind: '论文-DM',
      title: { zh: 'A Survey of Full-Duplex Spoken Dialogue Systems_Architectural Hierarchy, Interaction Ontology, and Decision State Machine', en: '新条目', ko: '新条目' },
      link: 'https://arxiv.org/abs/2606.19453',
      note: { zh: 'LLM - 全双工语音交互设计（Ten）', en: '', ko: '' },
      image: '/assets/PaPer/paper-a-survey-of-full-duplex-spoken-dia-pjupyfmria1kso.png',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 24,
    },
    {
      id: 'research-1784886615715',
      kind: '论文-AI预测',
      title: { zh: 'WorldCupArena: Fine-Grained Evaluation of Language Models and Deep-Research Agents on Football Forecasting', en: '新条目', ko: '新条目' },
      link: 'https://arxiv.org/abs/2607.18084',
      note: { zh: '', en: '', ko: '' },
      image: '/assets/PaPer/worldcuparena-fine-grained-evaluation-of-hrt8s3mryrguo1.png',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 295,
      widthPct: 24,
    },
    {
      id: 'research-1784887439598',
      kind: '博客',
      title: { zh: '产品介绍：MatchMate成长回顾｜你的AI看球搭子', en: '新条目', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/FxMvbfNeU8FuGMWMHzynfg',
      note: { zh: '历时103天，MatchMate从一个实时AI看球Demo起步，逐步扩展到多比赛、语音、AI预测、玩法游戏，集线上互动和线下观赛为一体的AI辅助观赛综合体。', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1784887654964',
      kind: '博客',
      title: { zh: '产品介绍：「你好，搭子！」—— MatchMate 相关功能', en: '新条目', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/t3c_T4BSKE_HhGC-yvxpow',
      note: { zh: 'MatchMate AI看球搭子在世界杯期间和大家一起经历了许多迭代更新，包括语音唤醒、音色升级与线下第二现场等。将聊天转到了通话，将线上聚拢到了线下。从性能、玩法、细节上做了多处更新！', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1784887599381',
      kind: '博客',
      title: { zh: '产品介绍：你的世界杯AI看球搭子来啦！使用指南请查收~', en: '新条目', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/hIYPQI2vuLmZGF5QYvs05Q',
      note: { zh: '“MatchMate: AI看球搭子"是由上海交通大学人工智能学院学生创业团队打造的一套面向足球观赛场景的 AI 互动观赛系统。帮助过程中随时提问、追问、理解赛况，并实时获取、自动整理各类比赛数据，从被动观看进入更主动的观赛参与。', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1784886617442',
      kind: '博客',
      title: { zh: '语音对话里的轮次判断：从级联到统一', en: '新条目', ko: '新条目' },
      link: 'https://mp.weixin.qq.com/s/kplZs2Nam_KTfnBzhvJFKw',
      note: { zh: '目前除了端到端对话系统之外，业界普遍在语音链路上外挂一个独立的轮次判断（turn detection）模型，充当"语义级 VAD"；该方案不侵入对话主干、工程可控且便于替换，已成为落地全双工系统的主流路线之一。五个代表性公开工作，按统一结构梳理其输入输出、模型架构与设计取舍。', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1783581833184',
      kind: '博客',
      title: { zh: 'GFT：把 SFT 当成“极度稀疏奖励 + 不稳定重要性权重“的 RL 重做一遍', en: '新条目', ko: '新条目' },
      link: 'https://blog.csdn.net/shibing624/article/details/161121458',
      note: { zh: '本文提出GFT方法,从RL视角重新审视SFT训练,发现SFT本质上是一种奖励极度稀疏且重要性权重不稳定的RL形式。', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
  ],
  sectionTitles: {
    "experience": { zh: '主要经历', en: 'Experience', ko: '주요 경력' },
    "gallery": { zh: '学术驱动项目', en: 'Academic Gallery', ko: '학술 갤러리' },
    "intro": { zh: '个人简介', en: 'Profile', ko: '소개' },
    "major": { zh: '专业介绍', en: 'Major', ko: '전공' },
  },
  uiStrings: {
    "pillStack": { zh: 'Stack', en: 'Stack', ko: 'Stack' },
    "resumeLabel": { zh: '当前简历 · CV', en: 'Resume · CV', ko: '이력서 · CV' },
    "galleryMore": { zh: '查看详情', en: 'Details', ko: '자세히 보기' },
    "pillOutcome": { zh: '成果', en: 'Outcome', ko: '결과' },
    "resumeView": { zh: '查看简历', en: 'View resume', ko: '이력서 보기' },
    "footNote": { zh: 'Vite + React · GitHub Pages', en: 'Vite + React · GitHub Pages', ko: 'Vite + React · GitHub Pages' },
  },
  palette: '',
};