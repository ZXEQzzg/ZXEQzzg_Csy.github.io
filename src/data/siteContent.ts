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

export type SiteContent = {
  profile: {
    name: string;
    avatar: string;
    avatars?: string[];
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
};

export const localeLabels: Record<Locale, string> = { zh: '中', en: 'EN', ko: '한' };

export const defaultContent: SiteContent = {
  profile: {
    name: '<span style="font-size:0.85em">陈斯阳 | BURCE</span>',
    avatar: '',
    avatars: [],
    mark: 'HAI',
    siteTitle: 'ZXEQzzg Csy HPortfolio',
    tickerLabel: { zh: '近期内容', en: 'Recent', ko: '최근 소식' },
    ticker: [
    ],
    headline: { zh: 'AI/LLM 专业背景 | AI Agent 产品方向 | AI 语音交互（TTS/ASR/VAD/声学仿真）', en: 'AI background, product design sense, research-driven project practice', ko: 'AI 전공 기반, 제품 디자인 감각, 연구 중심 프로젝트 경험' },
    intro: { zh: '研究端与工作端我专注于LLM相关实践与AI智能工程领域，具备从项目研究到工程落地的能力。围绕实际范式的应用与交互进行技术基础研究。', en: 'I focus on how AI systems move into real product contexts, balancing model capability, user experience, and explainable design.', ko: 'AI 시스템이 실제 제품 환경에 들어가는 방식에 관심이 있으며 모델 성능, 사용자 경험, 설명 가능한 설계의 균형을 중시합니다.' },
    research: { zh: '研究方向：Agent 应用 | Agent Memory | 语音（TTS/ASR/VAD/声学SIM）| Agent HCI | LLM 全双工语音交互', en: 'Research interests: multimodal interaction, agentic applications, AI-assisted design, and data-driven product analysis.', ko: '연구 관심사: 멀티모달 인터랙션, 에이전트 애플리케이션, AI 보조 디자인, 데이터 기반 제품 분석.' },
    location: { zh: '中国 / 可远程协作', en: 'China / Remote collaboration', ko: '중국 / 원격 협업 가능' },
    links: [
      { label: 'Email', value: 'ZXEQzzg@163.com', href: 'ZXEQzzg@163.com' },
      { label: 'GitHub', value: 'github.com/ZXEQzzg', href: 'https://github.com/ZXEQzzg' },
      { label: 'Portfolio', value: 'ZXEQzzg_Csy.github.io', href: 'https://ZXEQzzg-Csy.github.io' },
      { label: '电话', value: '+86 13248371107', href: '·' },
      { label: '微信', value: 'WeChat：John_H_Hua_Sheng', href: '·' },
    ],
    resume: { images: ['public/assets/--个人简历_CHENSIYANG--_PM.jpg'], pdf: '/assets/chensiyang-pm-ar8re1mrb2m3cz.pdf' },
  },
  skills: {
    title: { zh: '技术栈', en: 'Technical Stack', ko: '기술 스택' },
    groups: [
      { name: { zh: 'AI+  领域', en: 'AI / Data', ko: 'AI / 데이터' }, items: ['LLM', 'Agentic RAG', 'NLP', 'ASR', 'TTS ', 'VAD', 'Agent Tool', 'Function Calling', 'MCP', 'Skill', 'Prompt Eng', 'Context Eng', 'Agent Memory', 'KWS'] },
      { name: { zh: '开发 | 工程 | Vibe Codding', en: 'Product / Design', ko: '제품 / 디자인' }, items: ['Python', 'Linux', 'DoAcker', 'Git', 'LangChain', 'Workflow', 'RAG 评估/测评', 'Vibe IDE/CLI 开发 - Claude Code | Codex | KIRO | Gemini&Antigravity | Trae | Copilot | Windsurf | CodeBuddy', 'GitHub Pages'] },
      { name: { zh: '产品', en: 'Engineering', ko: '엔지니어링' }, items: ['AI  模型评估与选型', '需求分析 & PRD 撰写', 'Agent 产品设计', '产品交互', '⽤⼾场景分析', '结构 / ⾮结构化数据处理', 'Canva', 'Axure', '墨⼑', 'Figma'] },
    ],
  },
  timelineProjects: [
    {
      id: 'design-research-dashboard',
      title: { zh: 'MatchMate AI - 看球搭子（上海交通大学人工智能学院）', en: 'Design Research Insight Dashboard', ko: '디자인 리서치 인사이트 대시보드' },
      period: '2026',
      summary: { zh: 'MatchMate 是一款面向足球赛事的实A时AI陪伴应用，通过文字/语音交互，基于SportMonks实时数据与直播8事件流，为用户提供赛前、赛中、赛后的个性化解说、战术分析与互动。我作为AI语音交互模块产品负责人，主导语音交互与赛场智能播报两大「无手交互」能力的从0到1设计，覆盖用户主动提问与系统主动播报全场景。', en: 'Organized interviews, competitive research, and course feedback into traceable product decisions.', ko: '인터뷰, 경쟁 분석, 수업 피드백을 추적 가능한 제품 판단으로 정리했습니다.' },
      images: ['public/assets/logo.png'],
      stack: ['足球/体育 Agent', 'Memory Data', 'TTS', 'ASR', '语音交互设计', 'C端产品', '语音唤醒', '语音产品设计'],
      role: { zh: '语音交互产品方案设计 / ASR & TTS技术选型与标准制定 / 智能播报规则引擎设计 / 语音架构设计 / 交互设计 / 需求分析', en: 'Led research framing, information hierarchy, visualization components, and insight writing.', ko: '리서치 프레임, 정보 계층, 시각화 컴포넌트, 인사이트 작성을 맡았습니다.' },
      outcome: { zh: '0~1 完成语音链路开发 / TTS & ASR 云服务端方案沟通 / 0~1 智能播报模块设计 / 上线产品验证 / 声音设计', en: 'Helped the team identify user pain points faster and convert findings into design iteration directions.', ko: '팀이 사용자 문제를 더 빠르게 찾고 설계 개선 방향으로 전환하도록 도왔습니다.' },
      details: [
        { zh: '针对"边看直播边互动"的碎片化场景，设计 Push-to-Talk 语音唤醒-语音输入-语音合成-智能播报 状态互斥交互体系。', en: 'Replaced loose research notes with tags, evidence chains, and priority levels.', ko: '분산된 리서치 노트를 태그, 근거 체인, 우선순위로 구조화했습니다.' },
      ],
      widthPct: 100,
      imageHeight: 220,
    },
    {
      id: 'agentic-study-planner',
      title: { zh: 'TCL 实业 - 鸿鹄实验室', en: 'AI Study Planning Agent', ko: 'AI 학습 계획 에이전트' },
      period: '2025',
      summary: { zh: '参与 TCL 家庭陪伴机器人 AiMe 的全双工语音交互模块研发。', en: 'A planning tool for long-term study goals with task decomposition, progress tracking, and reflective feedback.', ko: '장기 학습 목표를 위한 계획 도구로, 작업 분해와 진행 추적, 피드백 요약을 결합했습니다.' },
      images: ['public/assets/PPTF.png', 'public/assets/TCLAiMe01.png', 'public/assets/TCLAiMe02.png', 'public/assets/WebRIR.jpg'],
      stack: ['LLM 打断设计', 'VAD ', 'NLP', '语音 ', '声学仿真', '全双工语音交互', 'HCI', 'WPE'],
      role: { zh: '混响消除 / 语音激活检测 / 语音识别 / 语音打断等', en: 'Owned product structure, interaction prototype, prompt workflow, and core UI implementation.', ko: '제품 구조, 인터랙션 프로토타입, 프롬프트 흐름, 핵심 UI 구현을 담당했습니다.' },
      outcome: { zh: '算法的参数调优、性能优化，构建横向对⽐实验框架 / 搭建  WebRIR-Studio  在线仿真平台并上线 / 全双⼯对话系统策略 v1', en: 'Built a demonstrable prototype and validated the path from vague goals to executable plans.', ko: '시연 가능한 프로토타입을 만들고 모호한 목표를 실행 계획으로 전환하는 흐름을 검증했습니다.' },
      details: [
        { zh: '主要负责各模块的数据仿真及性能测试，优化端到端链路的时延和稳定性，提升对话的自然度和准确率。', en: 'Reduced maintenance cost with phase goals, task cards, and reflection summaries.', ko: '단계 목표, 작업 카드, 회고 요약의 세 계층으로 관리 부담을 낮췄습니다.' },
        { zh: '通过房间脉冲响应（RIR）模拟与加权预测误差（WPE）去混响实验，验证在不同声源距离和角度条件下的语音增强效果', en: 'Positioned AI as assistance rather than replacement, preserving user control over learning rhythm.', ko: 'AI를 대체자가 아닌 보조자로 두어 사용자가 학습 리듬을 통제하도록 했습니다.' },
        { zh: '构建  SFT seed data  系统数据处理脚本，⾃动化处理覆盖  10k  原始语料与制作  100  条四态分布数据 策略，为机器⼈全双⼯对话系统奠定评估基准。', en: '', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 180,
    },
    {
      id: 'timeline-project-1783547312494',
      title: { zh: '项目 3', en: '项目 3', ko: '项目 3' },
      period: '2026',
      summary: { zh: '项目简介', en: '项目简介', ko: '项目简介' },
      images: [],
      stack: [],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      outcome: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      details: [
        { zh: '细节描述', en: '细节描述', ko: '细节描述' },
        { zh: 'D', en: '', ko: '' },
      ],
      widthPct: 100,
      imageHeight: 220,
    },
  ],
  galleryProjects: [
    {
      id: 'multimodal-campus-guide',
      title: { zh: '基于语义的遗传算法特征选择', en: 'Multimodal Campus Guide', ko: '멀티모달 캠퍼스 가이드' },
      cover: 'public/assets/Semantic-based GAFS.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '多模态信息组织与校园服务场景探索。', en: 'Multimodal information structure and campus service exploration.', ko: '멀티모달 정보 구조와 캠퍼스 서비스 시나리오 탐색.' },
        { zh: '包含用户旅程、功能框架和原型演示。', en: 'Includes user journey, feature framework, and prototype demo.', ko: '사용자 여정, 기능 프레임워크, 프로토타입 시연 포함.' },
        { zh: '适合展示 AI + 服务设计的综合能力。', en: 'Shows integrated AI and service design capability.', ko: 'AI와 서비스 디자인 역량을 함께 보여줍니다.' },
      ],
      stack: ['Multimodal AI', 'Service Design', 'Prototype'],
      role: { zh: '负责用户场景定义、体验流程、PPT 叙事结构与原型展示。', en: 'Defined user scenarios, experience flow, presentation narrative, and prototype demo.', ko: '사용자 시나리오, 경험 흐름, 발표 구조, 프로토타입 시연을 담당했습니다.' },
      result: { zh: '完成从问题定义到概念验证的完整展示材料。', en: 'Delivered complete materials from problem definition to concept validation.', ko: '문제 정의부터 개념 검증까지의 전체 발표 자료를 완성했습니다.' },
      description: { zh: '以新生和访客为对象，探索语音、图像和位置上下文结合的校园信息服务。', en: 'Explored a campus information service combining voice, image, and location context for new students and visitors.', ko: '신입생과 방문자를 대상으로 음성, 이미지, 위치 맥락을 결합한 캠퍼스 정보 서비스를 탐색했습니다.' },
      widthPct: 33.3,
      coverHeight: 187,
    },
    {
      id: 'ai-product-ethics-review',
      title: { zh: 'GA-组合优化-二进制基因编码', en: 'AI Product Ethics Review Framework', ko: 'AI 제품 윤리 평가 프레임워크' },
      cover: 'public/assets/GAs_-CombinatorialOptimization -Binary Gene Encoding-세 가지 모형.png',
      category: { zh: '学术驱动项目', en: 'Research Presentation', ko: '연구 발표' },
      notes: [
        { zh: '围绕 AI 产品透明度、偏见和用户控制权。', en: 'Focuses on transparency, bias, and user control in AI products.', ko: 'AI 제품의 투명성, 편향, 사용자 통제권에 초점을 둡니다.' },
        { zh: '沉淀为可复用的产品伦理检查框架。', en: 'Turns into a reusable product ethics review framework.', ko: '재사용 가능한 제품 윤리 검토 프레임워크로 정리했습니다.' },
        { zh: '适合展示研究归纳与产品判断能力。', en: 'Shows research synthesis and product judgment.', ko: '리서치 종합과 제품 판단 역량을 보여줍니다.' },
      ],
      stack: ['AI Ethics', 'Framework Design', 'Case Study'],
      role: { zh: '负责文献整理、评价维度设计、案例分析与视觉表达。', en: 'Handled literature review, evaluation dimensions, case analysis, and visual storytelling.', ko: '문헌 조사, 평가 기준 설계, 사례 분석, 시각적 표현을 맡았습니다.' },
      result: { zh: '沉淀出可复用的 AI 产品风险检查清单。', en: 'Produced a reusable risk checklist for AI product evaluation.', ko: 'AI 제품 평가에 재사용 가능한 위험 점검표를 만들었습니다.' },
      description: { zh: '围绕透明度、偏见、用户控制权和数据边界，构建面向产品团队的评估方法。', en: 'Built a product-team-oriented evaluation method around transparency, bias, user control, and data boundaries.', ko: '투명성, 편향, 사용자 통제권, 데이터 경계를 중심으로 제품팀용 평가 방법을 구성했습니다.' },
      widthPct: 33.3,
      coverHeight: 190,
    },
    {
      id: 'academic-project-1783271387635',
      title: { zh: '基于交叉的遗传算法 TSP 问题解决', en: 'Academic Project 3', ko: '학술 프로젝트 3' },
      cover: 'public/assets/GeneticAlgorithms -Crossover _TSP(0.0).png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 190,
    },
    {
      id: 'academic-project-1783284790924',
      title: { zh: '学术项目 4', en: 'Academic Project 4', ko: '학술 프로젝트 4' },
      cover: '/assets/PPT/cloud-computing-smart-agricultural-manag-3m6pi2mrf69cx3.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783284793108',
      title: { zh: '学术项目 5', en: 'Academic Project 5', ko: '학술 프로젝트 5' },
      cover: '/assets/PPT/agro-ict-aws-1-vdo8jhmrf6a1jr.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783581826807',
      title: { zh: '学术项目 7', en: 'Academic Project 7', ko: '학술 프로젝트 7' },
      cover: '/assets/PPT/iot-dkre7bmrf6b5b2.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783581827432',
      title: { zh: '学术项目 8', en: 'Academic Project 8', ko: '학술 프로젝트 8' },
      cover: '/assets/PPT/living-lab-202292004-w1xfpamrf6bbch.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783702352266',
      title: { zh: '学术项目 12', en: 'Academic Project 12', ko: '학술 프로젝트 12' },
      cover: '/assets/ppt-cover-01.svg',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783703717535',
      title: { zh: '学术项目 11', en: 'Academic Project 11', ko: '학술 프로젝트 11' },
      cover: '/assets/ppt-cover-01.svg',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783703717930',
      title: { zh: '学术项目 12', en: 'Academic Project 12', ko: '학술 프로젝트 12' },
      cover: '/assets/PPT/rl-ai-snake-9asnhwmrf76lih.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783702351369',
      title: { zh: '学术项目 10', en: 'Academic Project 10', ko: '학술 프로젝트 10' },
      cover: '/assets/PPT/q-learning-9sudiamrf6bxv2.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783581827816',
      title: { zh: '学术项目 9', en: 'Academic Project 9', ko: '학술 프로젝트 9' },
      cover: '/assets/PPT/model-based-reinforcement-learning-dyna--xmsl41mrf6bnnd.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783703719337',
      title: { zh: '学术项目 13', en: 'Academic Project 13', ko: '학술 프로젝트 13' },
      cover: '/assets/PPT/a-bmcinjmrf772xl.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783703719729',
      title: { zh: '学术项目 14', en: 'Academic Project 14', ko: '학술 프로젝트 14' },
      cover: '/assets/PPT/b-seiu3vmrf779gh.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
    {
      id: 'academic-project-1783703720066',
      title: { zh: '学术项目 15', en: 'Academic Project 15', ko: '학술 프로젝트 15' },
      cover: '/assets/PPT/c-id77pamrf77fig.png',
      category: { zh: '学术驱动项目', en: 'Academic Project', ko: '학술 기반 프로젝트' },
      notes: [
        { zh: '简介', en: '简介', ko: '简介' },
        { zh: '说明', en: '说明', ko: '说明' },
        { zh: '成果', en: '成果', ko: '成果' },
      ],
      stack: ['AI', 'Research'],
      role: { zh: '负责内容', en: '负责内容', ko: '负责内容' },
      result: { zh: '项目成果', en: '项目成果', ko: '项目成果' },
      description: { zh: '项目描述', en: '项目描述', ko: '项目描述' },
      widthPct: 33.3,
      coverHeight: 200,
    },
  ],
  courses: [
    {
      id: 'human-ai-interaction',
      title: { zh: '人机交互与 AI 产品设计', en: 'Human-AI Interaction and Product Design', ko: 'Human-AI Interaction 및 제품 디자인' },
      body: { zh: '关注智能系统如何解释自身能力、处理用户反馈，并在复杂任务中建立信任。', en: 'Focused on how intelligent systems explain capabilities, process feedback, and build trust in complex tasks.', ko: '지능형 시스템이 자신의 능력을 설명하고 피드백을 처리하며 복잡한 작업에서 신뢰를 형성하는 방식에 집중했습니다.' },
      tags: ['HCI', 'AI UX', 'Trust'],
    },
    {
      id: 'data-analysis',
      title: { zh: '数据分析与可视化', en: 'Data Analysis and Visualization', ko: '데이터 분석 및 시각화' },
      body: { zh: '从数据清洗、指标构建到可视化表达，强调让结论服务于产品判断。', en: 'Covered data cleaning, metric design, and visualization with product decision-making as the goal.', ko: '데이터 정제, 지표 설계, 시각화를 다루며 제품 판단에 기여하는 결론을 강조했습니다.' },
      tags: ['Python', 'Visualization', 'Metrics'],
    },
  ],
  major: [
    {
      id: 'ai-major',
      title: { zh: '人工智能专业背景', en: 'Artificial Intelligence Background', ko: '인공지능 전공 배경' },
      body: { zh: '专业学习覆盖机器学习、深度学习、数据结构、算法、智能系统应用等方向。我希望把技术理解转化成清晰、有审美、有实际价值的产品表达。', en: 'My academic background covers machine learning, deep learning, data structures, algorithms, and intelligent system applications. I aim to translate technical understanding into clear, aesthetic, and practical product expression.', ko: '전공 학습은 머신러닝, 딥러닝, 자료구조, 알고리즘, 지능형 시스템 응용을 포함합니다. 기술 이해를 명확하고 미감 있으며 실용적인 제품 표현으로 전환하고자 합니다.' },
      tags: ['Machine Learning', 'Deep Learning', 'Algorithms', 'AI Product'],
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
      kind: '论文',
      title: { zh: '新条目', en: '新条目', ko: '新条目' },
      link: '',
      note: { zh: '', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 25,
    },
    {
      id: 'research-1783456196695',
      kind: '论文',
      title: { zh: '新条目', en: '新条目', ko: '新条目' },
      link: '',
      note: { zh: '', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 24,
    },
    {
      id: 'research-1783581833184',
      kind: '论文',
      title: { zh: '新条目', en: '新条目', ko: '新条目' },
      link: '',
      note: { zh: '', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1783581836855',
      kind: '论文',
      title: { zh: '新条目', en: '新条目', ko: '新条目' },
      link: '',
      note: { zh: '', en: '', ko: '' },
      image: '',
      pdf: '',
      imageMode: 'auto',
      imageHeight: 190,
      widthPct: 50,
    },
    {
      id: 'research-1783581837256',
      kind: '论文',
      title: { zh: '新条目', en: '新条目', ko: '新条目' },
      link: '',
      note: { zh: '', en: '', ko: '' },
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
  },
};