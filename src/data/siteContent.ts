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
  stack: string[];
  role: LocalizedText;
  outcome: LocalizedText;
  details: LocalizedText[];
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
};

export type InfoModule = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  tags: string[];
};

export type SiteContent = {
  profile: {
    name: string;
    headline: LocalizedText;
    intro: LocalizedText;
    research: LocalizedText;
    location: LocalizedText;
    links: ProfileLink[];
  };
  skills: {
    title: LocalizedText;
    groups: Array<{
      name: LocalizedText;
      items: string[];
    }>;
  };
  timelineProjects: TimelineProject[];
  galleryProjects: GalleryProject[];
  courses: InfoModule[];
  major: InfoModule[];
};

export const localeLabels: Record<Locale, string> = {
  zh: '中',
  en: 'EN',
  ko: '한',
};

export const defaultContent: SiteContent = {
  profile: {
    name: 'ZXEQzzg Csy',
    headline: {
      zh: 'AI 专业背景 | 产品设计敏感度 | 研究驱动型项目实践',
      en: 'AI background, product design sense, research-driven project practice',
      ko: 'AI 전공 기반, 제품 디자인 감각, 연구 중심 프로젝트 경험',
    },
    intro: {
      zh: '我关注人工智能系统如何进入真实产品场景，尤其重视模型能力、用户体验与可解释设计之间的平衡。',
      en: 'I focus on how AI systems move into real product contexts, balancing model capability, user experience, and explainable design.',
      ko: 'AI 시스템이 실제 제품 환경에 들어가는 방식에 관심이 있으며 모델 성능, 사용자 경험, 설명 가능한 설계의 균형을 중시합니다.',
    },
    research: {
      zh: '研究方向：多模态交互、智能体应用、AI 辅助设计、数据驱动产品分析。',
      en: 'Research interests: multimodal interaction, agentic applications, AI-assisted design, and data-driven product analysis.',
      ko: '연구 관심사: 멀티모달 인터랙션, 에이전트 애플리케이션, AI 보조 디자인, 데이터 기반 제품 분석.',
    },
    location: {
      zh: '中国 / 可远程协作',
      en: 'China / Remote collaboration',
      ko: '중국 / 원격 협업 가능',
    },
    links: [
      { label: 'Email', value: 'your-email@example.com', href: 'mailto:your-email@example.com' },
      { label: 'GitHub', value: 'github.com/ZXEQzzg-Csy', href: 'https://github.com/ZXEQzzg-Csy' },
      { label: 'Portfolio', value: 'ZXEQzzg_Csy.github.io', href: 'https://ZXEQzzg-Csy.github.io' },
    ],
  },
  skills: {
    title: {
      zh: '技术栈',
      en: 'Technical Stack',
      ko: '기술 스택',
    },
    groups: [
      {
        name: { zh: 'AI / 数据', en: 'AI / Data', ko: 'AI / 데이터' },
        items: ['Python', 'PyTorch', 'LLM Workflow', 'Data Analysis', 'Prompt Engineering'],
      },
      {
        name: { zh: '产品 / 设计', en: 'Product / Design', ko: '제품 / 디자인' },
        items: ['Figma', 'UX Research', 'Information Architecture', 'Interaction Design'],
      },
      {
        name: { zh: '工程', en: 'Engineering', ko: '엔지니어링' },
        items: ['React', 'TypeScript', 'GitHub Pages', 'Markdown Content'],
      },
    ],
  },
  timelineProjects: [
    {
      id: 'agentic-study-planner',
      title: {
        zh: 'AI 学习规划智能体',
        en: 'AI Study Planning Agent',
        ko: 'AI 학습 계획 에이전트',
      },
      period: '2025 - 2026',
      summary: {
        zh: '面向学生长期学习目标的智能规划工具，结合任务拆解、进度追踪和反馈总结。',
        en: 'A planning tool for long-term study goals with task decomposition, progress tracking, and reflective feedback.',
        ko: '장기 학습 목표를 위한 계획 도구로, 작업 분해와 진행 추적, 피드백 요약을 결합했습니다.',
      },
      stack: ['React', 'TypeScript', 'LLM', 'Information Architecture'],
      role: {
        zh: '负责产品结构、交互原型、提示词流程与核心页面实现。',
        en: 'Owned product structure, interaction prototype, prompt workflow, and core UI implementation.',
        ko: '제품 구조, 인터랙션 프로토타입, 프롬프트 흐름, 핵심 UI 구현을 담당했습니다.',
      },
      outcome: {
        zh: '形成可演示原型，验证了从模糊目标到可执行计划的交互路径。',
        en: 'Built a demonstrable prototype and validated the path from vague goals to executable plans.',
        ko: '시연 가능한 프로토타입을 만들고 모호한 목표를 실행 계획으로 전환하는 흐름을 검증했습니다.',
      },
      details: [
        {
          zh: '通过阶段目标、任务卡片、复盘摘要三个层级降低用户维护成本。',
          en: 'Reduced maintenance cost with phase goals, task cards, and reflection summaries.',
          ko: '단계 목표, 작업 카드, 회고 요약의 세 계층으로 관리 부담을 낮췄습니다.',
        },
        {
          zh: '强调 AI 辅助而不是替代决策，让用户保留学习节奏的控制权。',
          en: 'Positioned AI as assistance rather than replacement, preserving user control over learning rhythm.',
          ko: 'AI를 대체자가 아닌 보조자로 두어 사용자가 학습 리듬을 통제하도록 했습니다.',
        },
      ],
    },
    {
      id: 'design-research-dashboard',
      title: {
        zh: '设计研究洞察看板',
        en: 'Design Research Insight Dashboard',
        ko: '디자인 리서치 인사이트 대시보드',
      },
      period: '2024 - 2025',
      summary: {
        zh: '整理访谈、竞品、课程项目反馈，将定性材料转化为可追踪的产品判断。',
        en: 'Organized interviews, competitive research, and course feedback into traceable product decisions.',
        ko: '인터뷰, 경쟁 분석, 수업 피드백을 추적 가능한 제품 판단으로 정리했습니다.',
      },
      stack: ['UX Research', 'Data Visualization', 'React', 'Product Strategy'],
      role: {
        zh: '负责研究框架、信息分层、可视化组件与结论表达。',
        en: 'Led research framing, information hierarchy, visualization components, and insight writing.',
        ko: '리서치 프레임, 정보 계층, 시각화 컴포넌트, 인사이트 작성을 맡았습니다.',
      },
      outcome: {
        zh: '帮助项目团队更快定位用户痛点，并把结论转化为设计迭代方向。',
        en: 'Helped the team identify user pain points faster and convert findings into design iteration directions.',
        ko: '팀이 사용자 문제를 더 빠르게 찾고 설계 개선 방향으로 전환하도록 도왔습니다.',
      },
      details: [
        {
          zh: '用标签、证据链和优先级替代松散的调研记录。',
          en: 'Replaced loose research notes with tags, evidence chains, and priority levels.',
          ko: '분산된 리서치 노트를 태그, 근거 체인, 우선순위로 구조화했습니다.',
        },
      ],
    },
  ],
  galleryProjects: [
    {
      id: 'multimodal-campus-guide',
      title: {
        zh: '多模态校园导览项目',
        en: 'Multimodal Campus Guide',
        ko: '멀티모달 캠퍼스 가이드',
      },
      cover: '/assets/ppt-cover-01.svg',
      category: {
        zh: '学术驱动项目',
        en: 'Academic Project',
        ko: '학술 기반 프로젝트',
      },
      notes: [
        {
          zh: '多模态信息组织与校园服务场景探索。',
          en: 'Multimodal information structure and campus service exploration.',
          ko: '멀티모달 정보 구조와 캠퍼스 서비스 시나리오 탐색.',
        },
        {
          zh: '包含用户旅程、功能框架和原型演示。',
          en: 'Includes user journey, feature framework, and prototype demo.',
          ko: '사용자 여정, 기능 프레임워크, 프로토타입 시연 포함.',
        },
        {
          zh: '适合展示 AI + 服务设计的综合能力。',
          en: 'Shows integrated AI and service design capability.',
          ko: 'AI와 서비스 디자인 역량을 함께 보여줍니다.',
        },
      ],
      stack: ['Multimodal AI', 'Service Design', 'Prototype'],
      role: {
        zh: '负责用户场景定义、体验流程、PPT 叙事结构与原型展示。',
        en: 'Defined user scenarios, experience flow, presentation narrative, and prototype demo.',
        ko: '사용자 시나리오, 경험 흐름, 발표 구조, 프로토타입 시연을 담당했습니다.',
      },
      result: {
        zh: '完成从问题定义到概念验证的完整展示材料。',
        en: 'Delivered complete materials from problem definition to concept validation.',
        ko: '문제 정의부터 개념 검증까지의 전체 발표 자료를 완성했습니다.',
      },
      description: {
        zh: '以新生和访客为对象，探索语音、图像和位置上下文结合的校园信息服务。',
        en: 'Explored a campus information service combining voice, image, and location context for new students and visitors.',
        ko: '신입생과 방문자를 대상으로 음성, 이미지, 위치 맥락을 결합한 캠퍼스 정보 서비스를 탐색했습니다.',
      },
    },
    {
      id: 'ai-product-ethics-review',
      title: {
        zh: 'AI 产品伦理评估框架',
        en: 'AI Product Ethics Review Framework',
        ko: 'AI 제품 윤리 평가 프레임워크',
      },
      cover: '/assets/ppt-cover-02.svg',
      category: {
        zh: '研究展示',
        en: 'Research Presentation',
        ko: '연구 발표',
      },
      notes: [
        {
          zh: '围绕 AI 产品透明度、偏见和用户控制权。',
          en: 'Focuses on transparency, bias, and user control in AI products.',
          ko: 'AI 제품의 투명성, 편향, 사용자 통제권에 초점을 둡니다.',
        },
        {
          zh: '沉淀为可复用的产品伦理检查框架。',
          en: 'Turns into a reusable product ethics review framework.',
          ko: '재사용 가능한 제품 윤리 검토 프레임워크로 정리했습니다.',
        },
        {
          zh: '适合展示研究归纳与产品判断能力。',
          en: 'Shows research synthesis and product judgment.',
          ko: '리서치 종합과 제품 판단 역량을 보여줍니다.',
        },
      ],
      stack: ['AI Ethics', 'Framework Design', 'Case Study'],
      role: {
        zh: '负责文献整理、评价维度设计、案例分析与视觉表达。',
        en: 'Handled literature review, evaluation dimensions, case analysis, and visual storytelling.',
        ko: '문헌 조사, 평가 기준 설계, 사례 분석, 시각적 표현을 맡았습니다.',
      },
      result: {
        zh: '沉淀出可复用的 AI 产品风险检查清单。',
        en: 'Produced a reusable risk checklist for AI product evaluation.',
        ko: 'AI 제품 평가에 재사용 가능한 위험 점검표를 만들었습니다.',
      },
      description: {
        zh: '围绕透明度、偏见、用户控制权和数据边界，构建面向产品团队的评估方法。',
        en: 'Built a product-team-oriented evaluation method around transparency, bias, user control, and data boundaries.',
        ko: '투명성, 편향, 사용자 통제권, 데이터 경계를 중심으로 제품팀용 평가 방법을 구성했습니다.',
      },
    },
    {
      id: 'academic-project-03',
      title: {
        zh: '学术项目 03',
        en: 'Academic Project 03',
        ko: '학술 프로젝트 03',
      },
      cover: '/assets/ppt-cover-03.svg',
      category: {
        zh: '待编辑项目',
        en: 'Editable Slot',
        ko: '편집 가능 항목',
      },
      notes: [
        { zh: '在编辑页替换为你的 PPT 封面。', en: 'Replace this with your PPT cover in the editor.', ko: '편집 페이지에서 PPT 표지로 교체하세요.' },
        { zh: '这里写研究问题、方法或项目背景。', en: 'Write the research question, method, or background here.', ko: '여기에 연구 질문, 방법, 배경을 작성하세요.' },
        { zh: '这里写技术栈、职责或阶段成果。', en: 'Write stack, role, or progress outcome here.', ko: '여기에 기술 스택, 역할, 단계 성과를 작성하세요.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-04',
      title: { zh: '学术项目 04', en: 'Academic Project 04', ko: '학술 프로젝트 04' },
      cover: '/assets/ppt-cover-04.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-05',
      title: { zh: '学术项目 05', en: 'Academic Project 05', ko: '학술 프로젝트 05' },
      cover: '/assets/ppt-cover-05.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-06',
      title: { zh: '学术项目 06', en: 'Academic Project 06', ko: '학술 프로젝트 06' },
      cover: '/assets/ppt-cover-06.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-07',
      title: { zh: '学术项目 07', en: 'Academic Project 07', ko: '학술 프로젝트 07' },
      cover: '/assets/ppt-cover-07.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-08',
      title: { zh: '学术项目 08', en: 'Academic Project 08', ko: '학술 프로젝트 08' },
      cover: '/assets/ppt-cover-08.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-09',
      title: { zh: '学术项目 09', en: 'Academic Project 09', ko: '학술 프로젝트 09' },
      cover: '/assets/ppt-cover-09.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-10',
      title: { zh: '学术项目 10', en: 'Academic Project 10', ko: '학술 프로젝트 10' },
      cover: '/assets/ppt-cover-10.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-11',
      title: { zh: '学术项目 11', en: 'Academic Project 11', ko: '학술 프로젝트 11' },
      cover: '/assets/ppt-cover-11.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
    {
      id: 'academic-project-12',
      title: { zh: '学术项目 12', en: 'Academic Project 12', ko: '학술 프로젝트 12' },
      cover: '/assets/ppt-cover-12.svg',
      category: { zh: '待编辑项目', en: 'Editable Slot', ko: '편집 가능 항목' },
      notes: [
        { zh: '第一行简介。', en: 'First description line.', ko: '첫 번째 설명 줄.' },
        { zh: '第二行说明。', en: 'Second description line.', ko: '두 번째 설명 줄.' },
        { zh: '第三行成果。', en: 'Third result line.', ko: '세 번째 성과 줄.' },
      ],
      stack: ['AI', 'Research', 'Presentation'],
      role: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      result: { zh: '待编辑', en: 'Editable', ko: '편집 가능' },
      description: { zh: '待编辑项目描述。', en: 'Editable project description.', ko: '편집 가능한 프로젝트 설명.' },
    },
  ],
  courses: [
    {
      id: 'human-ai-interaction',
      title: {
        zh: '人机交互与 AI 产品设计',
        en: 'Human-AI Interaction and Product Design',
        ko: 'Human-AI Interaction 및 제품 디자인',
      },
      body: {
        zh: '关注智能系统如何解释自身能力、处理用户反馈，并在复杂任务中建立信任。',
        en: 'Focused on how intelligent systems explain capabilities, process feedback, and build trust in complex tasks.',
        ko: '지능형 시스템이 자신의 능력을 설명하고 피드백을 처리하며 복잡한 작업에서 신뢰를 형성하는 방식에 집중했습니다.',
      },
      tags: ['HCI', 'AI UX', 'Trust'],
    },
    {
      id: 'data-analysis',
      title: {
        zh: '数据分析与可视化',
        en: 'Data Analysis and Visualization',
        ko: '데이터 분석 및 시각화',
      },
      body: {
        zh: '从数据清洗、指标构建到可视化表达，强调让结论服务于产品判断。',
        en: 'Covered data cleaning, metric design, and visualization with product decision-making as the goal.',
        ko: '데이터 정제, 지표 설계, 시각화를 다루며 제품 판단에 기여하는 결론을 강조했습니다.',
      },
      tags: ['Python', 'Visualization', 'Metrics'],
    },
  ],
  major: [
    {
      id: 'ai-major',
      title: {
        zh: '人工智能专业背景',
        en: 'Artificial Intelligence Background',
        ko: '인공지능 전공 배경',
      },
      body: {
        zh: '专业学习覆盖机器学习、深度学习、数据结构、算法、智能系统应用等方向。我希望把技术理解转化成清晰、有审美、有实际价值的产品表达。',
        en: 'My academic background covers machine learning, deep learning, data structures, algorithms, and intelligent system applications. I aim to translate technical understanding into clear, aesthetic, and practical product expression.',
        ko: '전공 학습은 머신러닝, 딥러닝, 자료구조, 알고리즘, 지능형 시스템 응용을 포함합니다. 기술 이해를 명확하고 미감 있으며 실용적인 제품 표현으로 전환하고자 합니다.',
      },
      tags: ['Machine Learning', 'Deep Learning', 'Algorithms', 'AI Product'],
    },
  ],
};
