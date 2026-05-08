const states = {
  browsing: {
    label: "浏览态",
    depth: "低打扰提醒",
    description: "从推荐流进入，快速滑动，被标题和情绪吸引。"
  },
  interest: {
    label: "兴趣态",
    depth: "半展开理解卡",
    description: "停留变长、收藏或连续看同一股票/板块。"
  },
  research: {
    label: "研究态",
    depth: "完整核验面板",
    description: "主动搜索、点击来源、对比观点并追踪争议。"
  }
};

const perspectives = {
  balanced: {
    label: "混合",
    description: "技术面和基本面信号同时保留，优先展示关键事实、证据状态和情绪边界。"
  },
  short: {
    label: "技术面",
    description: "根据历史浏览偏好，优先展示技术信号、量价变化和市场情绪。"
  },
  value: {
    label: "基本面",
    description: "根据历史浏览偏好，优先展示财务指标、估值假设和官方来源。"
  }
};

const markerStrategies = {
  balanced: {
    label: "混合标注",
    copy: "同时保留数据、情绪、AI 痕迹和关键观点，帮助用户先建立完整上下文。"
  },
  short: {
    label: "技术面优先标注",
    copy: "优先标注放量、突破、压力位、趋势、短期情绪和交易行为；基本面信息只保留高风险或核心争议点。"
  },
  value: {
    label: "基本面优先标注",
    copy: "优先标注财报、现金流、估值、业绩口径和来源缺口；纯短线信号只保留明显情绪或生成风险点。"
  }
};

const stateOrder = ["browsing", "interest", "research"];
const perspectiveOrder = ["balanced", "short", "value"];
const defaultModel = "deepseek-chat";
const defaultBaseUrl = "https://api.deepseek.com";

const profileSkillSample =
  "浏览记录：今天在推荐流连续看了 6 篇机器人板块笔记，收藏 2 篇 K 线突破分析，评论“这个压力位怎么看”。自己的帖子：放量突破后回踩 5 日线，短线情绪还在。";

const storyDemoText =
  "段永平买了泡泡玛特，好多人觉得找到靠山了，但短期该跌还是会跌。历史上巴菲特买入后被套的情况也很多，所以不能只因为大佬买了就冲。真正要看的是泡泡玛特的海外增长、利润率和估值是否还能支撑现在的预期。";

const posts = [
  {
    id: "validData",
    tab: "数据正确",
    tabCopy: "财务数据有来源，但风险提示不完整",
    author: "财报拆解员 Claire",
    meta: "今天 09:18 · 美股财报观察",
    avatar: "C",
    avatarColor: "#2d6cdf",
    title: "英伟达财报继续很强，但我更关心两个后续问题",
    mediaLabel: "NVIDIA · 财报后讨论热度",
    tags: ["#财报", "#AI芯片", "#长期跟踪"],
    chart: "M6,108 C55,82 88,92 130,57 C174,21 205,41 246,34 C292,27 327,16 380,25",
    paragraphs: [
      [
        { text: "这季最明显的信号还是数据中心。" },
        { text: "数据中心收入同比增长 73%", point: "revenue" },
        { text: "，这能解释为什么社区里仍然有很多乐观讨论。" }
      ],
      [
        { text: "但我不太想只看增长数字。" },
        { text: "长期也不算贵", point: "valuation" },
        { text: "这个判断需要放到毛利率、自由现金流和估值区间里一起看。" }
      ],
      [
        { text: "我的看法是，它依然是好公司，但帖子里如果只讲增长、不讲估值和风险，读起来会太顺了。" }
      ]
    ],
    points: {
      revenue: {
        claim: "数据中心收入同比增长 73%",
        contentType: "事实数据型",
        claimType: "事实数据",
        mainValue: "信息参考",
        unsuitable: "不能单独推导股价表现",
        verification: "与示例官方来源口径一致",
        evidence: "部分充分",
        tone: "偏乐观",
        emotionRisk: "低风险",
        generatedTrace: "低",
        realSignal: "中",
        humanGap: "缺少完整风险因素和口径说明",
        hints: {
          browsing: "这条数据有来源线索，但单个增长数字不能代表投资结论。",
          interest: "这篇笔记的数据点较清晰，但需要继续看利润率、现金流和估值。",
          research: "数据口径可追溯；建议核对财报期间、分部口径和可持续性。"
        },
        balancedMetrics: ["事实数据：可核验", "证据：部分充分", "风险：未展开估值"],
        shortMetrics: ["财报后讨论热度上升", "短期波动率偏高", "不等同突破信号"],
        valueMetrics: ["营收增长：高", "毛利率：需继续核对", "FCF：需看季度现金流"],
        sources: [
          ["SEC EDGAR", "https://www.sec.gov/edgar/search/"],
          ["Company Investor Relations", "https://investor.nvidia.com/"]
        ],
        dispute: "数据中心增长能否继续支撑当前估值？",
        tracker: {
          count: "过去 7 天相关笔记 28 篇",
          support: "AI 需求、数据中心收入增长、生态优势",
          oppose: "估值偏高、毛利率压力、订单增速可能放缓",
          update: "新增官方来源：最新季度财报与电话会纪要"
        }
      },
      valuation: {
        claim: "长期也不算贵",
        contentType: "投资观点型",
        claimType: "观点判断",
        mainValue: "判断框架",
        unsuitable: "不能作为买入依据",
        verification: "需要进一步判断",
        evidence: "不充分",
        tone: "偏乐观",
        emotionRisk: "低风险",
        generatedTrace: "低",
        realSignal: "中",
        humanGap: "缺少估值方法、对比区间和关键假设",
        hints: {
          browsing: "这是估值观点，不是事实数据；暂未看到估值假设。",
          interest: "这条判断需要 PE、FCF、增长假设和同行对比支撑。",
          research: "建议拆解估值模型：未来增长、利润率、折现率和历史估值区间。"
        },
        balancedMetrics: ["观点判断：需假设", "证据：不充分", "情绪：偏乐观"],
        shortMetrics: ["短线无直接技术依据", "财报后情绪偏热", "追涨风险需留意"],
        valueMetrics: ["PE/PB：需补充", "ROE：需核对趋势", "估值区间：缺少来源"],
        sources: [
          ["Company filings", "https://www.sec.gov/edgar/search/"],
          ["Nasdaq financials", "https://www.nasdaq.com/market-activity/stocks/nvda/financials"]
        ],
        dispute: "当前估值是否已经充分反映未来增长？",
        tracker: {
          count: "过去 7 天相关笔记 31 篇",
          support: "长期 AI 资本开支、数据中心需求、软件生态",
          oppose: "估值分位较高、增速基数抬升、竞争加剧",
          update: "新增来源：最新 10-Q 与分析师电话会摘要"
        }
      }
    }
  },
  {
    id: "fomo",
    tab: "强情绪",
    tabCopy: "FOMO 表达强，证据和边界不足",
    author: "盘面热度观察",
    meta: "刚刚 · A 股短线讨论",
    avatar: "P",
    avatarColor: "#2d6cdf",
    title: "机器人板块今天这个走势，很多人还没反应过来",
    mediaLabel: "机器人板块 · 社区情绪升温",
    tags: ["#短线", "#机器人", "#题材热度"],
    chart: "M6,104 C42,105 61,78 96,82 C132,87 149,36 184,46 C228,58 246,16 286,20 C322,24 345,12 380,30",
    paragraphs: [
      [
        { text: "今天盘面最强的不是指数，是机器人这条线。" },
        { text: "已经放量突破压力位", point: "breakout" },
        { text: "，情绪明显不一样。" }
      ],
      [
        { text: "我感觉这是今年最确定的一波。" },
        { text: "最后上车机会", point: "lastTrain" },
        { text: "，再犹豫可能就只能看别人吃肉了。" }
      ],
      [
        { text: "主力资金的态度已经很明显，接下来就是看谁敢不敢跟。" }
      ]
    ],
    points: {
      breakout: {
        claim: "已经放量突破压力位",
        contentType: "投资观点型",
        claimType: "技术判断",
        mainValue: "技术面观察",
        unsuitable: "不能推导长期价值",
        verification: "需要行情数据进一步判断",
        evidence: "部分充分",
        tone: "强乐观",
        emotionRisk: "FOMO",
        generatedTrace: "中",
        realSignal: "低",
        humanGap: "缺少具体标的、时间周期、成交量数据和压力位定义",
        hints: {
          browsing: "这是一条短线技术判断，暂未看到具体数据。",
          interest: "需要确认放量幅度、压力位定义和样本标的。",
          research: "技术信号只说明短期市场行为，不代表公司长期价值变化。"
        },
        balancedMetrics: ["技术判断：需数据", "证据：部分充分", "情绪：强乐观"],
        shortMetrics: ["成交量：需标的验证", "RSI：可能接近高位", "催化：题材热度"],
        valueMetrics: ["基本面：未讨论", "估值：未讨论", "业绩：未讨论"],
        sources: [
          ["交易所行情公告", "https://www.sse.com.cn/"],
          ["深交所信息披露", "https://www.szse.cn/disclosure/"]
        ],
        dispute: "这次上涨是基本面改善，还是短期情绪推动？",
        tracker: {
          count: "过去 7 天相关笔记 46 篇",
          support: "题材催化、成交量放大、板块轮动",
          oppose: "缺少业绩兑现、估值已反映预期、短期拥挤",
          update: "新增来源：交易所异动公告与公司澄清公告"
        }
      },
      lastTrain: {
        claim: "最后上车机会",
        contentType: "行动号召型",
        claimType: "情绪表达",
        mainValue: "情绪感染",
        unsuitable: "不适合作为交易依据",
        verification: "不适合事实核验",
        evidence: "不充分",
        tone: "强乐观",
        emotionRisk: "FOMO",
        generatedTrace: "中",
        realSignal: "低",
        humanGap: "缺少风险提示、估值依据和可验证数据",
        hints: {
          browsing: "这段表达可能放大错过焦虑，暂未看到依据。",
          interest: "它是行动号召，不是事实；建议先看证据再判断。",
          research: "强确定性表达与弱证据不匹配，参考权重应降低。"
        },
        balancedMetrics: ["行动号召：高风险", "证据：不充分", "情绪：FOMO"],
        shortMetrics: ["追涨冲动：高", "热度：上升", "回撤风险：需留意"],
        valueMetrics: ["财务依据：缺失", "估值依据：缺失", "风险因素：缺失"],
        sources: [],
        dispute: "当前热度是否已经脱离基本面证据？",
        tracker: {
          count: "过去 7 天相关笔记 52 篇",
          support: "短线情绪、政策催化、板块关注度",
          oppose: "缺少具体公司数据、FOMO 词汇增多、分歧扩大",
          update: "新增观察：相关笔记中 FOMO 表达占比升至 38%"
        }
      }
    }
  },
  {
    id: "wrongData",
    tab: "数据错误",
    tabCopy: "具体财务数据过期或与公告不一致",
    author: "新能源随手记",
    meta: "昨天 22:41 · 个股讨论",
    avatar: "N",
    avatarColor: "#0f172a",
    title: "这家电动车公司其实没那么差，现金流已经证明了",
    mediaLabel: "EV Company · 财务数据核对",
    tags: ["#新能源", "#财报", "#现金流"],
    chart: "M6,78 C54,64 75,102 116,80 C158,58 170,112 210,96 C258,76 272,94 314,60 C344,38 356,46 380,32",
    paragraphs: [
      [
        { text: "很多人只盯着股价看，其实财务已经在修复。" },
        { text: "公司自由现金流连续三年为正", point: "cashflow" },
        { text: "，说明业务质量已经稳定。" }
      ],
      [
        { text: "另外，" },
        { text: "2025 年营收同比增长 50%", point: "growth" },
        { text: "，这个增速在同类公司里很难得。" }
      ],
      [
        { text: "所以我觉得市场现在太悲观，等大家反应过来可能就不一样了。" }
      ]
    ],
    points: {
      cashflow: {
        claim: "公司自由现金流连续三年为正",
        contentType: "事实数据型",
        claimType: "事实数据",
        mainValue: "信息参考",
        unsuitable: "不能单独代表业务质量稳定",
        verification: "与示例官方来源不一致",
        evidence: "不充分",
        tone: "偏乐观",
        emotionRisk: "低风险",
        generatedTrace: "高",
        realSignal: "低",
        humanGap: "缺少财报链接；表述像模板化总结，未说明计算口径",
        hints: {
          browsing: "这条财务数据可能不准确，建议不要直接采信。",
          interest: "原文没有来源，且现金流口径需要核对财报。",
          research: "核验重点：经营现金流、资本开支和自由现金流计算口径。"
        },
        balancedMetrics: ["事实数据：不一致", "证据：不充分", "生成痕迹：高"],
        shortMetrics: ["技术面：无直接支持", "情绪：修复叙事", "热度：中"],
        valueMetrics: ["FCF：需重算", "资本开支：需核对", "负债率：需补充"],
        sources: [
          ["SEC EDGAR", "https://www.sec.gov/edgar/search/"],
          ["Company annual reports", "https://www.sec.gov/edgar/search/"]
        ],
        dispute: "现金流改善是否真实可持续？",
        tracker: {
          count: "过去 7 天相关笔记 19 篇",
          support: "交付改善、成本下降、现金流修复预期",
          oppose: "资本开支高、价格战、自由现金流口径争议",
          update: "新增来源：年度报告现金流量表"
        }
      },
      growth: {
        claim: "2025 年营收同比增长 50%",
        contentType: "事实数据型",
        claimType: "事实数据",
        mainValue: "信息参考",
        unsuitable: "不能替代完整财报分析",
        verification: "疑似过期或口径错误",
        evidence: "不充分",
        tone: "偏乐观",
        emotionRisk: "绝对化表达",
        generatedTrace: "高",
        realSignal: "低",
        humanGap: "缺少日期、财报期间和来源链接",
        hints: {
          browsing: "这条增速数据缺少来源，可能过期或口径错误。",
          interest: "需要确认财报年度、季度口径和是否剔除一次性因素。",
          research: "建议对照公司最新 10-K/年报与分部收入表。"
        },
        balancedMetrics: ["数据：待核验", "证据：不充分", "时效：不明"],
        shortMetrics: ["短线催化：财报叙事", "价格反应：需看公告日", "波动：可能放大"],
        valueMetrics: ["营收增长：需核对", "毛利率：需联动", "净利润：未说明"],
        sources: [
          ["SEC EDGAR", "https://www.sec.gov/edgar/search/"],
          ["Company Investor Relations", "https://www.sec.gov/edgar/search/"]
        ],
        dispute: "营收增长是否来自可持续业务，而非一次性因素？",
        tracker: {
          count: "过去 7 天相关笔记 23 篇",
          support: "交付量增长、海外市场、成本优化",
          oppose: "价格战影响、毛利率压力、口径不一致",
          update: "新增来源：最新年报与季度收入表"
        }
      }
    }
  },
  {
    id: "lossStory",
    tab: "真实经历",
    tabCopy: "亏损分享有共鸣价值，但不构成投资依据",
    author: "今天也在复盘",
    meta: "今天 00:12 · 投资日记",
    avatar: "L",
    avatarColor: "#3b5f9f",
    title: "账户从盈利到亏了 30%，我终于承认自己被情绪带着走了",
    mediaLabel: "个人投资日记 · 情绪曲线",
    tags: ["#投资复盘", "#亏损记录", "#情绪管理"],
    chart: "M6,30 C42,38 64,22 102,42 C142,64 166,74 204,86 C254,102 298,92 332,112 C352,122 366,116 380,124",
    paragraphs: [
      [
        { text: "这篇不是建议任何人买卖，只是记录一下我自己的状态。" },
        { text: "账户从最高点到现在亏了 30%", point: "loss" },
        { text: "，每天打开账户都会有点发紧。" }
      ],
      [
        { text: "回头看，我不是输在看不懂线，而是看到别人都很确定的时候，自己也想赶紧证明自己没错。" },
        { text: "这种感觉真的很难受", point: "emotion" },
        { text: "。" }
      ],
      [
        { text: "现在我只想先把买入理由、卖出条件和能承受的亏损写清楚，再慢慢修正。" }
      ]
    ],
    points: {
      loss: {
        claim: "账户从最高点到现在亏了 30%",
        contentType: "情绪经验型",
        claimType: "个人经历",
        mainValue: "情绪共鸣与风险感知",
        unsuitable: "不能推导市场结论",
        verification: "不适合事实核验",
        evidence: "不适用",
        tone: "偏悲观",
        emotionRisk: "情绪共鸣",
        generatedTrace: "低",
        realSignal: "高",
        humanGap: "个人经历无需财报来源，但不代表普遍结果",
        hints: {
          browsing: "这是一条个人经历分享，适合共鸣，不宜直接推导市场结论。",
          interest: "它的价值是风险感知和情绪陪伴，不构成投资依据。",
          research: "可用于理解投资者情绪，但不能证明公司基本面变化。"
        },
        balancedMetrics: ["内容价值：共鸣", "证据：不适用", "边界：非建议"],
        shortMetrics: ["恐慌传染：中", "交易信号：无", "复盘价值：高"],
        valueMetrics: ["基本面：未讨论", "估值：未讨论", "风险承受：值得记录"],
        sources: [],
        dispute: "亏损来自基本面变化，还是情绪和仓位管理？",
        tracker: {
          count: "过去 7 天相关投资日记 64 篇",
          support: "亏损复盘、情绪管理、仓位边界",
          oppose: "个体经历不能代表市场方向",
          update: "新增观察：同类笔记中复盘和止损讨论增加"
        }
      },
      emotion: {
        claim: "这种感觉真的很难受",
        contentType: "情绪经验型",
        claimType: "情绪表达",
        mainValue: "陪伴感",
        unsuitable: "不能作为买卖依据",
        verification: "不适合事实核验",
        evidence: "不适用",
        tone: "偏悲观",
        emotionRisk: "情绪共鸣",
        generatedTrace: "低",
        realSignal: "高",
        humanGap: "无需强制补充来源；重点是区分情绪价值和投资依据",
        hints: {
          browsing: "这段主要提供情绪共鸣，不是市场判断。",
          interest: "它能帮助用户感到被理解，但不应被用来判断标的涨跌。",
          research: "可沉淀为投资复盘，不适合进入事实核验。"
        },
        balancedMetrics: ["价值：陪伴", "风险：恐慌传染", "边界：非依据"],
        shortMetrics: ["情绪强度：中高", "行动号召：无", "冲动风险：降低"],
        valueMetrics: ["复盘框架：有", "持仓依据：未涉及", "风控启发：有"],
        sources: [],
        dispute: "用户是否需要先处理情绪，再处理交易判断？",
        tracker: {
          count: "过去 7 天相关复盘笔记 58 篇",
          support: "真实亏损经历、情绪复盘、风险教育",
          oppose: "情绪共鸣不能替代证据",
          update: "新增观察：评论区高频词为焦虑、后悔、仓位"
        }
      }
    }
  }
];

let appState = {
  activeView: "experience",
  userState: "browsing",
  perspective: "balanced",
  postId: "fomo",
  pointId: "lastTrain",
  sheetOpen: false,
  sheetMode: "point",
  customResult: null,
  customPost: null,
  customInput: "",
  quickScenarioInput: "",
  profileInput: sessionStorage.getItem("xhsEvidenceProfileInput") || profileSkillSample,
  profileSkillResult: null,
  profileControlsOpen: false,
  apiStatus: "idle",
  apiStatusMessage: "",
  apiSettings: {
    apiKey: sessionStorage.getItem("xhsEvidenceApiKey") || "",
    model: !sessionStorage.getItem("xhsEvidenceModel") || sessionStorage.getItem("xhsEvidenceModel") === "gpt-5"
      ? defaultModel
      : sessionStorage.getItem("xhsEvidenceModel"),
    baseUrl: !sessionStorage.getItem("xhsEvidenceBaseUrl") || sessionStorage.getItem("xhsEvidenceBaseUrl").includes("api.openai.com")
      ? defaultBaseUrl
      : sessionStorage.getItem("xhsEvidenceBaseUrl")
  },
  tracked: false,
  reducedHints: false
};

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const stateSkillSignals = {
  browsing: [
    { label: "推荐流/热榜曝光", weight: 3, pattern: /推荐流|首页|发现页|曝光|流量池|刷到|热榜|热门|爆火|路过|随手|无聊|碎片|看一眼/ },
    { label: "强标题或强情绪吸引", weight: 2, pattern: /标题|点赞|评论区|暴涨|暴跌|崩盘|吃肉|亏麻|最后上车|错过|恐慌|焦虑/ },
    { label: "低互动浅阅读", weight: 2, pattern: /快速滑|快刷|划走|停留短|没有搜索|没点来源|只看标题|随便看看|不感兴趣/ }
  ],
  interest: [
    { label: "同一标的/板块连续浏览", weight: 3, pattern: /连续|同一|同类|相关笔记|又看|多篇|板块|赛道|个股|股票/ },
    { label: "有效阅读和轻互动", weight: 3, pattern: /点击|点开|停留|看完|读完|滑到底|完播|收藏|点赞|评论|关注博主|点进主页|转发|私信|看评论/ },
    { label: "观点比较刚开始", weight: 2, pattern: /怎么看|有没有懂|还想看|对比一下|求分析|再看看|观察|提问/ }
  ],
  research: [
    { label: "主动搜索和来源点击", weight: 4, pattern: /主动搜索|搜索|搜了|点击来源|来源链接|官网|公告|财报|年报|季报|SEC|EDGAR|上交所|深交所|港交所|Investor Relations|10-K|10-Q/ },
    { label: "证据核对", weight: 4, pattern: /核对|验证|口径|原文|数据源|下载|截图|模型|估值表|财务模型|DCF|假设/ },
    { label: "反方证据和追踪", weight: 3, pattern: /反方|争议|追踪|跟踪|复盘|对比观点|支持依据|反对依据|风险因素|更新提醒/ }
  ]
};

const styleSkillSignals = {
  short: [
    { label: "高意图技术面互动", weight: 5, pattern: /(收藏|评论|搜索|搜了|自己的帖子|关注).*(K线|分时|放量|缩量|成交量|均线|MACD|RSI|支撑|压力|突破|回踩|龙虎榜|资金流)/ },
    { label: "量价和图形", weight: 4, pattern: /K线|分时|放量|缩量|成交量|量价|换手|突破|回踩|支撑|压力|均线|5日线|10日线|20日线|MACD|RSI|KDJ|布林|盘口/ },
    { label: "短线交易语言", weight: 3, pattern: /短线|超短|波段|T\+0|日内|明天|今天|止损|止盈|仓位|打板|低吸|高抛|题材|龙头|板块轮动|主力资金|资金流/ },
    { label: "热度和催化", weight: 2, pattern: /热度|情绪|催化|异动|拉升|砸盘|冲高|回落|涨停|跌停|龙虎榜|北向|资金面/ }
  ],
  value: [
    { label: "高意图基本面互动", weight: 5, pattern: /(收藏|评论|搜索|搜了|自己的帖子|关注).*(财报|年报|公告|营收|利润|现金流|ROE|ROIC|估值|DCF|安全边际|商业模式|管理层)/ },
    { label: "财务指标", weight: 4, pattern: /财报|年报|季报|营收|收入|利润|毛利率|净利率|现金流|自由现金流|ROE|ROIC|负债|资产负债表|利润表|现金流量表/ },
    { label: "估值和长期假设", weight: 4, pattern: /估值|PE|PB|PS|DCF|折现|安全边际|内在价值|长期|复利|股息|分红|回购|增长假设|利润率|估值区间|EV\/EBITDA/ },
    { label: "公司质量和信息源", weight: 3, pattern: /商业模式|护城河|竞争优势|管理层|行业格局|市占率|客户|供应链|公告|官网|Investor Relations|SEC|EDGAR|上交所|深交所|港交所|10-K|10-Q/ }
  ]
};

const recommendationSignalRules = [
  { label: "推荐流曝光", score: 1, pattern: /推荐流|首页|发现页|曝光|流量池|刷到|热榜|热门/ },
  { label: "快速滑走/负反馈", score: -2, pattern: /快速滑|快刷|划走|停留短|只看标题|不感兴趣|屏蔽|拉黑/ },
  { label: "有效阅读", score: 3, pattern: /点击|点开|停留|长停留|看完|读完|滑到底|完播|看评论/ },
  { label: "深度互动", score: 4, pattern: /收藏|评论|长评论|提问|转发|分享|关注|点进主页|私信/ },
  { label: "主动搜索", score: 5, pattern: /主动搜索|搜索|搜了|检索|查了|查找/ },
  { label: "来源核验", score: 6, pattern: /点击来源|来源链接|官网|公告|财报|年报|季报|SEC|EDGAR|上交所|深交所|港交所|Investor Relations|10-K|10-Q|原文|口径/ },
  { label: "同题连续消费", score: 3, pattern: /连续|同一|同类|相关笔记|又看|多篇|合集|专辑|板块|赛道/ }
];

function extractRecommendationSignals(text) {
  const matched = recommendationSignalRules.filter((rule) => rule.pattern.test(text));
  return {
    labels: matched.map((rule) => rule.label),
    score: matched.reduce((sum, rule) => sum + rule.score, 0),
    hasExposure: /推荐流|首页|发现页|曝光|流量池|刷到|热榜|热门/.test(text),
    hasNegative: /快速滑|快刷|划走|停留短|只看标题|不感兴趣|屏蔽|拉黑/.test(text),
    hasEffectiveRead: /点击|点开|停留|长停留|看完|读完|滑到底|完播|看评论/.test(text),
    hasDeepEngagement: /收藏|评论|长评论|提问|转发|分享|关注|点进主页|私信/.test(text),
    hasSearch: /主动搜索|搜索|搜了|检索|查了|查找/.test(text),
    hasSourceCheck: /点击来源|来源链接|官网|公告|财报|年报|季报|SEC|EDGAR|上交所|深交所|港交所|Investor Relations|10-K|10-Q|原文|口径/.test(text),
    hasTopicLoop: /连续|同一|同类|相关笔记|又看|多篇|合集|专辑|板块|赛道/.test(text)
  };
}

function evaluateSignalGroups(text, groups) {
  return Object.fromEntries(
    Object.entries(groups).map(([key, signals]) => {
      const matched = signals.filter((signal) => signal.pattern.test(text));
      return [
        key,
        {
          score: matched.reduce((sum, signal) => sum + signal.weight, 0),
          signals: matched.map((signal) => signal.label)
        }
      ];
    })
  );
}

function confidenceFromScores(scores, selectedKey) {
  const values = Object.values(scores).map((item) => item.score).sort((a, b) => b - a);
  const top = scores[selectedKey]?.score || 0;
  const second = values[1] || 0;
  if (!top) return 52;
  return Math.min(92, Math.round(52 + top * 4 + Math.max(0, top - second) * 6));
}

function classifyUserStateFromBehavior(text) {
  const scored = evaluateSignalGroups(text, stateSkillSignals);
  const rec = extractRecommendationSignals(text);

  if (rec.hasExposure && rec.hasNegative) {
    scored.browsing.score += 3;
    scored.browsing.signals.push("推荐曝光后快滑/负反馈");
  }
  if (rec.hasEffectiveRead || rec.hasDeepEngagement || rec.hasTopicLoop) {
    scored.interest.score += 3;
    scored.interest.signals.push("推荐排序高意图信号");
  }
  if (rec.hasSearch || rec.hasSourceCheck) {
    scored.research.score += rec.hasSourceCheck ? 5 : 3;
    scored.research.signals.push(rec.hasSourceCheck ? "来源核验信号" : "主动搜索信号");
  }

  const selected = Object.entries(scored).sort((a, b) => b[1].score - a[1].score)[0][0];
  const state = selected || "browsing";
  const theory = {
    browsing: "有限注意力和注意力驱动交易：用户被热度、标题和强情绪捕获，产品应低打扰。",
    interest: "社交互动和媒体情绪会提高涉入度：用户开始围绕同一标的/叙事比较观点。",
    research: "主动信息搜寻降低只受显著线索影响的风险：用户需要来源、口径、反方证据和追踪。"
  };
  const intervention = {
    browsing: "只给一句证据/情绪边界提醒，避免打断浏览流。",
    interest: "展开事实、观点、情绪和缺失证据的半卡片。",
    research: "展示来源、指标、争议点和后续追踪。"
  };

  return {
    state,
    label: states[state].label,
    confidence: confidenceFromScores(scored, state),
    signals: scored[state].signals.length ? scored[state].signals : ["未发现强信号，保守使用浏览态"],
    recSignals: rec.labels.length ? rec.labels : ["无明显推荐行为信号"],
    theory: theory[state],
    intervention: intervention[state],
    scores: scored
  };
}

function classifyInvestmentStyleFromBehavior(text) {
  const scored = evaluateSignalGroups(text, styleSkillSignals);
  const rec = extractRecommendationSignals(text);
  const highIntentBoost = rec.hasDeepEngagement || rec.hasSearch || rec.hasSourceCheck;

  if (highIntentBoost && /K线|分时|放量|缩量|成交量|均线|MACD|RSI|支撑|压力|突破|回踩|资金流|龙虎榜/.test(text)) {
    scored.short.score += 3;
    scored.short.signals.push("高意图技术面信号");
  }
  if (highIntentBoost && /财报|公告|营收|利润|现金流|ROE|ROIC|估值|DCF|安全边际|商业模式|管理层|官网|SEC|EDGAR/.test(text)) {
    scored.value.score += 3;
    scored.value.signals.push("高意图基本面信号");
  }

  const shortScore = scored.short.score;
  const valueScore = scored.value.score;
  const perspective =
    Math.abs(shortScore - valueScore) <= 2 && shortScore > 1 && valueScore > 1
      ? "balanced"
      : shortScore > valueScore
        ? "short"
        : valueScore > shortScore
          ? "value"
          : "balanced";
  const selectedSignals =
    perspective === "balanced"
      ? [...scored.short.signals, ...scored.value.signals]
      : scored[perspective].signals;
  const confidence =
    perspective === "balanced"
      ? Math.min(88, Math.max(56, 56 + Math.min(shortScore, valueScore) * 4))
      : confidenceFromScores(scored, perspective);
  const theory = {
    short: "注意力与过度交易研究提示，频繁关注量价、题材和盘中信号时，输出应优先给技术面指标和冲动边界。",
    value: "信息搜寻和证据锚定更强时，输出应优先给财报口径、估值假设、现金流和官方来源。",
    balanced: "历史行为同时覆盖短期市场信号和公司基本面，说明风格不宜单边归类，应保留混合视角。"
  };
  const outputPlan = {
    short: "红点弹窗优先展示量价、趋势、热度和短期风险。",
    value: "红点弹窗优先展示财务指标、估值假设、来源和长期风险。",
    balanced: "红点弹窗同时保留事实、证据、情绪边界和关键指标。"
  };

  return {
    perspective,
    label: perspectives[perspective].label,
    confidence,
    signals: selectedSignals.length ? selectedSignals : ["未发现稳定风格，使用混合视角"],
    recSignals: rec.labels.length ? rec.labels : ["无明显推荐行为信号"],
    theory: theory[perspective],
    intervention: outputPlan[perspective],
    scores: scored
  };
}

function currentPost() {
  if (appState.postId === "customScenario" && appState.customPost) {
    return appState.customPost;
  }
  return posts.find((post) => post.id === appState.postId) || posts[0];
}

function currentPoint() {
  if (appState.sheetMode === "custom" && appState.customPost?.points?.[appState.pointId]) {
    return appState.customPost.points[appState.pointId];
  }
  if (appState.sheetMode === "custom" && appState.customResult) {
    return appState.customResult;
  }
  const post = currentPost();
  const visibleIds = visiblePointIds(post, appState.perspective);
  const selectedId = visibleIds.includes(appState.pointId) ? appState.pointId : visibleIds[0];
  const point = post.points[selectedId] || Object.values(post.points)[0];
  return point;
}

function pointProfileText(point = {}) {
  const sourceLabels = Array.isArray(point.sources)
    ? point.sources.map((source) => (Array.isArray(source) ? source[0] : source)).filter(Boolean)
    : [];

  return [
    point.claim,
    point.contentType,
    point.claimType,
    point.mainValue,
    point.unsuitable,
    point.verification,
    point.evidence,
    point.tone,
    point.emotionRisk,
    point.generatedTrace,
    point.realSignal,
    point.humanGap,
    point.dispute,
    point.tracker?.support,
    point.tracker?.oppose,
    ...sourceLabels
  ]
    .filter(Boolean)
    .join(" ");
}

function pointRelevanceScores(point = {}) {
  const text = pointProfileText(point);
  const technical = /技术|短线|放量|突破|压力位|支撑|趋势|回撤|量能|RSI|MACD|K线|均线|看盘|题材|热度|资金|冲高|回落|波动|催化|盘面|主力|上车|追高|止损|买入|卖出|持仓|FOMO|恐慌/i.test(text)
    ? 1
    : 0;
  const fundamental = /基本面|价值|财报|公告|营收|收入|利润|净利|毛利|现金流|自由现金流|FCF|ROE|ROA|PE|PB|DCF|估值|负债|资产|业绩|增长|公司|商业模式|护城河|管理层|SEC|年报|季报|10-K|Investor Relations/i.test(text)
    ? 1
    : 0;
  const universal = /生成|AI|模板|情绪|共鸣|个人经历|亏损|不充分|缺少来源|不一致|绝对化|行动号召|最后上车|快跑|必涨|必跌|FOMO|恐慌|强乐观|强悲观/i.test(text)
    ? 1
    : 0;
  const risk =
    universal ||
    /不充分|缺少|不一致|FOMO|恐慌|强乐观|强悲观|生成|模板|绝对化|行动号召/.test(
      `${point.verification || ""} ${point.evidence || ""} ${point.emotionRisk || ""} ${point.generatedTrace || ""}`
    )
      ? 1
      : 0;

  return { technical, fundamental, universal, risk };
}

function pointMarkerPriority(point, perspective) {
  const scores = pointRelevanceScores(point);
  if (perspective === "short") return scores.technical * 5 + scores.risk * 3 + scores.universal * 2 + scores.fundamental * 0.4;
  if (perspective === "value") return scores.fundamental * 5 + scores.risk * 3 + scores.universal * 2 + scores.technical * 0.4;
  return 10 + scores.technical + scores.fundamental + scores.universal + scores.risk;
}

function pointMatchesPerspective(point, perspective) {
  const scores = pointRelevanceScores(point);
  if (perspective === "short") return Boolean(scores.technical || scores.risk || scores.universal);
  if (perspective === "value") return Boolean(scores.fundamental || scores.risk || scores.universal);
  return true;
}

function visiblePointIds(post = currentPost(), perspective = appState.perspective) {
  const entries = Object.entries(post.points || {}).map(([id, point], index) => ({
    id,
    index,
    direct: pointMatchesPerspective(point, perspective),
    priority: pointMarkerPriority(point, perspective)
  }));

  if (!entries.length) return [];
  if (perspective === "balanced") return entries.map((item) => item.id);

  const maxDots = Math.min(2, entries.length);
  const directMatches = entries
    .filter((item) => item.direct)
    .sort((a, b) => b.priority - a.priority || a.index - b.index)
    .slice(0, maxDots);
  const selected = directMatches.length
    ? directMatches
    : entries.sort((a, b) => b.priority - a.priority || a.index - b.index).slice(0, 1);

  return selected.sort((a, b) => a.index - b.index).map((item) => item.id);
}

function firstVisiblePointId(post = currentPost(), perspective = appState.perspective) {
  return visiblePointIds(post, perspective)[0] || Object.keys(post.points || {})[0] || appState.pointId;
}

function applyPerspective(nextPerspective) {
  const post = currentPost();
  appState = {
    ...appState,
    perspective: nextPerspective,
    pointId: firstVisiblePointId(post, nextPerspective),
    sheetOpen: false,
    tracked: false
  };
  renderAll();
}

function badgeClass(value) {
  if (/不一致|FOMO|强乐观|强悲观|错误|不充分|高风险/.test(value)) return "danger";
  if (/一致|充分|真实|低风险/.test(value)) return "teal";
  if (/部分|需要|中|待/.test(value)) return "gold";
  return "blue";
}

function sentencePreview(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  const first = clean.split(/[。！？!?]/).find(Boolean) || clean;
  return first.length > 80 ? `${first.slice(0, 80)}...` : first;
}

function inferContentType(text) {
  if (/亏|回撤|睡不着|难受|焦虑|后悔|复盘|账户/.test(text)) return "情绪经验型";
  if (/最后上车|赶紧|闭眼|必涨|必跌|稳赚|快跑|再不上|翻倍|吃肉/.test(text)) return "行动号召型";
  if (/什么是|怎么|如何|入门|科普|解释|看懂/.test(text)) return "教育科普型";
  if (/营收|收入|利润|现金流|ROE|PE|市盈率|估值|毛利率|同比|环比|负债|财报|公告/.test(text)) return "事实数据型";
  if (/低估|高估|看好|不看好|认为|觉得|空间|机会|风险|逻辑/.test(text)) return "投资观点型";
  return "投资观点型";
}

function buildLocalAnalysis(text) {
  const contentType = inferContentType(text);
  const hasSource = /http|来源|财报|公告|SEC|上交所|深交所|港交所|年报|10-K|Investor Relations/i.test(text);
  const hasNumbers = /\d+(\.\d+)?%|\d+(\.\d+)?倍|\d+(\.\d+)?亿|\d+(\.\d+)?万/.test(text);
  const hasFomo = /最后上车|再不上|错过|赶紧|闭眼|必涨|稳赚|翻倍|吃肉/.test(text);
  const hasPanic = /崩盘|快跑|血洗|完了|没救|暴跌|恐慌/.test(text);
  const hasTemplate = /首先|其次|最后|综上|长期空间|确定性|核心逻辑|值得关注|未来可期/.test(text);
  const isPersonal = contentType === "情绪经验型";
  const isFact = contentType === "事实数据型";
  const isCall = contentType === "行动号召型";

  const tone = hasPanic ? "强悲观" : hasFomo ? "强乐观" : /亏|难受|焦虑|暴跌|回撤/.test(text) ? "偏悲观" : /看好|机会|增长|突破|低估/.test(text) ? "偏乐观" : "中性";
  const emotionRisk = isPersonal ? "情绪共鸣" : hasFomo ? "FOMO" : hasPanic ? "恐慌" : /必|一定|肯定|确定/.test(text) ? "绝对化表达" : "低风险";
  const evidence = isPersonal ? "不适用" : hasSource ? "部分充分" : hasNumbers || isCall ? "不充分" : "需要进一步判断";
  const verification = isPersonal || contentType === "教育科普型" ? "不适合事实核验" : hasSource ? "需要进一步判断" : "缺少来源";
  const generatedTrace = hasTemplate && !isPersonal ? "高" : hasTemplate || (!hasSource && !isPersonal) ? "中" : "低";
  const realSignal = isPersonal ? "高" : /我|自己|持仓|买入|卖出|截图|记录|复盘/.test(text) ? "中" : "低";

  return {
    provider: "local",
    claim: sentencePreview(text),
    contentType,
    claimType: isPersonal ? "个人经历" : isCall ? "情绪表达" : isFact ? "事实数据" : "观点判断",
    mainValue: isPersonal ? "情绪共鸣与风险感知" : contentType === "教育科普型" ? "知识学习" : isFact ? "信息参考" : isCall ? "情绪感染" : "判断框架",
    unsuitable: isPersonal ? "不能推导市场结论" : "不能作为买入、卖出或加仓依据",
    verification,
    evidence,
    tone,
    emotionRisk,
    generatedTrace,
    realSignal,
    humanGap: isPersonal
      ? "个人经历无需强制外部来源，但不代表普遍结果"
      : hasSource
        ? "需要确认来源口径、时效和推理链条"
        : "缺少官方来源、关键假设或作者人工核验痕迹",
    hints: {
      browsing: isPersonal
        ? "这是一条个人经历分享，适合共鸣，不宜直接推导市场结论。"
        : hasFomo
          ? "这段表达可能放大错过焦虑，建议先看证据。"
          : "这段内容需要结合来源、语气和适用边界理解。",
      interest: isPersonal
        ? "它的价值是风险感知和情绪陪伴，不构成投资依据。"
        : "这段内容包含可讨论观点，建议继续查看来源、假设和风险说明。",
      research: isPersonal
        ? "可用于理解投资者情绪，但不能证明公司基本面变化。"
        : "建议核对官方来源、财务口径、技术信号或估值假设。"
    },
    balancedMetrics: [
      `${contentType}`,
      `证据：${evidence}`,
      `情绪：${emotionRisk}`
    ],
    shortMetrics: [
      hasFomo ? "FOMO 表达：高" : "FOMO 表达：低",
      hasNumbers ? "短期数字叙事：有" : "短期数字叙事：少",
      hasPanic ? "恐慌信号：有" : "恐慌信号：无"
    ],
    valueMetrics: [
      hasSource ? "来源线索：有" : "来源线索：缺失",
      /现金流|ROE|利润|毛利率|负债|PE|估值/.test(text) ? "基本面指标：有" : "基本面指标：少",
      hasNumbers ? "可核验数字：有" : "可核验数字：少"
    ],
    sources: hasSource
      ? [["用户文本中的来源线索", "#"]]
      : isPersonal
        ? []
        : [["建议核对：公司财报/交易所公告", "https://www.sec.gov/edgar/search/"]],
    dispute: isPersonal
      ? "这段经历反映的是个人情绪，还是可复盘的仓位与风控问题？"
      : "这段判断背后的核心假设是否有证据支持？",
    tracker: {
      count: "自定义输入暂无站内聚合，真实产品可汇总过去 7 天相关笔记",
      support: hasSource ? "文本中存在来源线索或具体指标" : "需要继续补充支持依据",
      oppose: hasFomo || !hasSource ? "强表达或缺少来源会降低参考权重" : "仍需核对口径与时效",
      update: "可在接入真实数据源后追踪官方公告、财报更新和社区观点变化"
    }
  };
}

function normalizeAnalysis(raw, text, provider) {
  const fallback = buildLocalAnalysis(text);
  return {
    ...fallback,
    ...raw,
    provider,
    hints: { ...fallback.hints, ...(raw.hints || {}) },
    balancedMetrics: raw.balancedMetrics || fallback.balancedMetrics,
    shortMetrics: raw.shortMetrics || fallback.shortMetrics,
    valueMetrics: raw.valueMetrics || fallback.valueMetrics,
    sources: Array.isArray(raw.sources) ? raw.sources : fallback.sources,
    tracker: { ...fallback.tracker, ...(raw.tracker || {}) }
  };
}

function truncateText(text, max = 34) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max)}...`;
}

function splitScenarioSentences(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^。！？!?；;\n]+[。！？!?；;]?/g) || [clean];
  return sentences.map((item) => item.trim()).filter(Boolean).slice(0, 10);
}

function scoreScenarioSentence(sentence, index, perspective = appState.perspective) {
  let score = Math.max(0, 4 - index * 0.35);
  const techHit = /突破|放量|压力位|支撑|趋势|回撤|短期|技术面|量能|RSI|MACD|K线|均线|看盘|题材|资金|冲高|回落|追高|止损|买入|卖出|持仓|FOMO|恐慌/.test(sentence);
  const valueHit = /营收|收入|利润|现金流|估值|财报|公告|来源|同比|环比|毛利|净利|负债|增长|基本面|PE|PB|ROE|DCF|FCF|自由现金流|业绩/.test(sentence);
  if (/\d+(\.\d+)?%|\d+(\.\d+)?倍|\d+(\.\d+)?亿|\d+(\.\d+)?万|PE|PB|ROE|DCF|RSI|MACD/i.test(sentence)) score += 4;
  if (/营收|收入|利润|现金流|估值|财报|公告|来源|同比|环比|毛利|净利|负债|增长/.test(sentence)) score += 3;
  if (/突破|放量|压力位|支撑|趋势|回撤|短期|长期|技术面|基本面|买入|卖出|持仓/.test(sentence)) score += 3;
  if (/最后上车|错过|赶紧|闭眼|必涨|必跌|稳了|恐慌|暴跌|套|亏/.test(sentence)) score += 3;
  if (/我觉得|我认为|很多人|大家|历史上|案例|验证|靠山|确定/.test(sentence)) score += 2;
  if (perspective === "short") score += techHit ? 5 : valueHit ? -1.5 : 0;
  if (perspective === "value") score += valueHit ? 5 : techHit ? -1.5 : 0;
  return Math.max(0, score);
}

function pickScenarioPointIndexes(sentences, perspective = appState.perspective) {
  const ranked = sentences
    .map((sentence, index) => ({ index, score: scoreScenarioSentence(sentence, index, perspective) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, sentences.length))
    .map((item) => item.index)
    .sort((a, b) => a - b);

  return ranked.length ? ranked : [0];
}

function scenarioPointFromSentence(sentence, modelResult, provider, isPrimary) {
  const local = normalizeAnalysis(buildLocalAnalysis(sentence), sentence, provider || "local");
  const point = isPrimary
    ? normalizeAnalysis({ ...modelResult, claim: sentence }, sentence, provider || modelResult.provider || "local")
    : local;

  return {
    ...point,
    claim: sentence,
    provider: provider || point.provider || "local",
    warning: isPrimary ? modelResult.warning : ""
  };
}

function buildCustomScenarioPost(text, result) {
  const sentences = splitScenarioSentences(text);
  const pointIndexes = pickScenarioPointIndexes(sentences, appState.perspective);
  const pointIds = new Map();
  const points = {};
  const provider = result.provider || "local";

  pointIndexes.forEach((sentenceIndex, order) => {
    const id = `customPoint${order + 1}`;
    pointIds.set(sentenceIndex, id);
    points[id] = scenarioPointFromSentence(sentences[sentenceIndex], result, provider, order === 0);
  });

  const paragraphs = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(
      sentences.slice(index, index + 2).map((sentence, offset) => {
        const sentenceIndex = index + offset;
        return {
          text: sentence,
          point: pointIds.get(sentenceIndex)
        };
      })
    );
  }

  const perspectiveTag =
    appState.perspective === "short"
      ? "#技术面"
      : appState.perspective === "value"
        ? "#基本面"
        : "#混合视角";
  const chart =
    result.emotionRisk === "恐慌" || result.tone === "偏悲观" || result.tone === "强悲观"
      ? "M6,30 C46,42 78,35 110,58 C152,88 174,76 214,104 C255,130 302,96 380,122"
      : result.emotionRisk === "FOMO" || result.tone === "强乐观"
        ? "M6,104 C42,105 61,78 96,82 C132,87 149,36 184,46 C228,58 246,16 286,20 C322,24 345,12 380,30"
        : "M6,84 C48,70 82,92 126,64 C168,38 204,72 246,48 C292,26 330,58 380,42";

  return {
    id: "customScenario",
    tab: "自定义生成",
    tabCopy: "由输入内容生成的类小红书阅读场景",
    author: "证据点模拟器",
    meta: "刚刚 · 自定义输入生成",
    avatar: "AI",
    avatarColor: "#2d6cdf",
    title: truncateText(result.claim || sentences[0] || text, 36),
    mediaLabel: `${result.contentType || "投资内容"} · AI 证据点`,
    tags: ["#自定义输入", "#AI证据点", perspectiveTag],
    chart,
    paragraphs: paragraphs.length ? paragraphs : [[{ text: text, point: "customPoint1" }]],
    points,
    isCustom: true
  };
}

function renderStateButtons() {
  const container = $("#stateButtons");
  container.innerHTML = stateOrder
    .map(
      (id) => `
        <button type="button" class="${id === appState.userState ? "active" : ""}" data-state="${id}">
          ${escapeHtml(states[id].label)}
        </button>
      `
    )
    .join("");

  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      appState = {
        ...appState,
        userState: button.dataset.state,
        sheetOpen: appState.sheetOpen,
        sheetMode: appState.sheetMode
      };
      renderAll();
    });
  });
}

function renderModeTabs() {
  document.querySelectorAll(".mode-tabs button").forEach((button) => {
    const isActive = button.dataset.view === appState.activeView;
    button.classList.toggle("active", isActive);
    button.onclick = () => {
      appState = {
        ...appState,
        activeView: button.dataset.view,
        sheetOpen: button.dataset.view === "experience" ? appState.sheetOpen : false
      };
      renderAll();
    };
  });

  $("#experienceTab").classList.toggle("active", appState.activeView === "experience");
  $("#toolsTab").classList.toggle("active", appState.activeView === "tools");
  $("#logicTab").classList.toggle("active", appState.activeView === "logic");
}

function renderPreferenceButtons() {
  const container = $("#preferenceButtons");
  container.innerHTML = perspectiveOrder
    .map(
      (id) => `
        <button type="button" class="${id === appState.perspective ? "active" : ""}" data-perspective="${id}">
          ${escapeHtml(perspectives[id].label)}
        </button>
      `
    )
    .join("");

  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      applyPerspective(button.dataset.perspective);
    });
  });
}

function renderWorkspaceProfileControls() {
  const stateContainer = $("#workspaceStateButtons");
  const preferenceContainer = $("#workspacePreferenceButtons");
  const current = $("#workspaceProfileCurrent");
  if (!stateContainer || !preferenceContainer || !current) return;

  stateContainer.innerHTML = stateOrder
    .map(
      (id) => `
        <button type="button" class="${id === appState.userState ? "active" : ""}" data-state="${id}">
          ${escapeHtml(states[id].label)}
        </button>
      `
    )
    .join("");

  preferenceContainer.innerHTML = perspectiveOrder
    .map(
      (id) => `
        <button type="button" class="${id === appState.perspective ? "active" : ""}" data-perspective="${id}">
          ${escapeHtml(perspectives[id].label)}
        </button>
      `
    )
    .join("");

  current.innerHTML = `
    当前输出配置：<strong>${escapeHtml(states[appState.userState].label)}</strong>
    · <strong>${escapeHtml(perspectives[appState.perspective].label)}</strong>
    <br />影响范围：正文证据点选择、弹窗深度、优先指标、推送预览与争议追踪展示。
  `;

  stateContainer.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      appState = {
        ...appState,
        userState: button.dataset.state
      };
      renderAll();
    });
  });

  preferenceContainer.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      applyPerspective(button.dataset.perspective);
    });
  });
}

function renderPostTabs() {
  const container = $("#postTabs");
  const visiblePosts = appState.customPost ? [appState.customPost, ...posts] : posts;
  container.innerHTML = visiblePosts
    .map(
      (post) => `
        <button type="button" class="post-tab ${post.id === appState.postId ? "active" : ""}" data-post="${post.id}">
          <strong>${escapeHtml(post.tab)}</strong>
          <span>${escapeHtml(post.tabCopy)}</span>
        </button>
      `
    )
    .join("");

  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const post = visiblePosts.find((item) => item.id === button.dataset.post);
      appState = {
        ...appState,
        postId: post.id,
        pointId: firstVisiblePointId(post, appState.perspective),
        sheetOpen: false,
        sheetMode: post.isCustom ? "custom" : "point",
        tracked: false
      };
      renderAll();
    });
  });
}

function renderParagraph(segments) {
  const visiblePoints = new Set(visiblePointIds(currentPost(), appState.perspective));
  return segments
    .map((segment) => {
      if (!segment.point) return escapeHtml(segment.text);
      if (!visiblePoints.has(segment.point)) return escapeHtml(segment.text);
      const point = currentPost().points[segment.point];
      const dotType = evidenceDotType(point);
      const tip = evidenceDotTip(dotType);
      const isActive = segment.point === appState.pointId && appState.sheetOpen;
      return `<span class="inline-claim">${escapeHtml(segment.text)}</span><button class="evidence-dot ${dotType} ${isActive ? "active" : ""}" type="button" data-point="${segment.point}" data-tip="${escapeHtml(tip)}" aria-label="${escapeHtml(tip)}：${escapeHtml(segment.text)}"></button>`;
    })
    .join("");
}

function evidenceDotType(point = {}) {
  const text = `${point.contentType || ""} ${point.claimType || ""} ${point.emotionRisk || ""} ${point.generatedTrace || ""}`;
  if (String(point.generatedTrace || "").includes("高") || /生成|模板/.test(text)) return "dot-ai";
  if (/FOMO|恐慌|情绪|强乐观|强悲观|行动号召|最后上车|亏损|共鸣/.test(text)) return "dot-emotion";
  return "dot-data";
}

function evidenceDotTip(type) {
  if (type === "dot-emotion") return "情绪风险点";
  if (type === "dot-ai") return "生成痕迹点";
  return "数据核验点";
}

function noteStats(post) {
  const seed = post.isCustom ? appState.customInput.length : post.title.length + post.author.length;
  return {
    likes: 120 + (seed * 17) % 880,
    collects: 24 + (seed * 11) % 260,
    comments: 18 + (seed * 7) % 140
  };
}

function noteComments(post) {
  const firstPoint = Object.values(post.points || {})[0] || {};
  const text = `${post.title || ""} ${firstPoint.claim || ""} ${firstPoint.contentType || ""} ${firstPoint.emotionRisk || ""}`;

  if (/亏|难受|复盘|情绪|个人经历|共鸣/.test(text)) {
    return [
      { name: "今天不补仓", meta: "刚刚", copy: "看到“每天打开账户都发紧”那里真的有点破防，我也是这样慢慢变成不敢看盘的。" },
      { name: "慢慢来吧", meta: "12 分钟前", copy: "这种复盘比喊单有用，至少能提醒自己别在情绪最满的时候做决定。" },
      { name: "一颗柠檬", meta: "28 分钟前", copy: "我之前也是从盈利拿到回撤，后来才发现仓位管理比看对方向还难。" }
    ];
  }

  if (/FOMO|最后上车|赶紧|错过|强乐观|行动号召|必涨|靠山/.test(text)) {
    return [
      { name: "别急着冲", meta: "2 分钟前", copy: "这种“再不上车就没了”的语气最容易让我手滑，先放收藏夹冷静一下。" },
      { name: "短线观察员", meta: "9 分钟前", copy: "情绪是起来了，但我更想看明天量能能不能接住，不然很容易冲高回落。" },
      { name: "被套过三次", meta: "半小时前", copy: "大佬买不等于自己买就舒服，时间周期和仓位完全不是一回事。" }
    ];
  }

  if (/财报|营收|收入|利润|现金流|ROE|PE|估值|基本面|数据|同比|增长/.test(text)) {
    return [
      { name: "财报打工人", meta: "5 分钟前", copy: "这个口径最好还是拆一下，营收增长和利润质量有时候不是一回事。" },
      { name: "只看年报", meta: "16 分钟前", copy: "我会想再看毛利率和现金流，如果只看一个增长数字确实容易太乐观。" },
      { name: "小羊不追高", meta: "42 分钟前", copy: "同感，好公司和好价格是两件事，帖子里这部分还可以再展开。" }
    ];
  }

  if (/生成|模板|AI|痕迹/.test(text)) {
    return [
      { name: "像通稿", meta: "7 分钟前", copy: "这段读起来有点太顺了，但具体怎么验证反而没讲清楚。" },
      { name: "先蹲来源", meta: "20 分钟前", copy: "我一般看到这种很完整的三段式，会先找原始出处再决定要不要信。" },
      { name: "路过学习", meta: "1 小时前", copy: "观点可以看看，但没有自己的操作细节就会少一点真实感。" }
    ];
  }

  return [
    { name: "路过学习", meta: "刚刚", copy: "这个角度挺有意思，但我还想看看有没有反方观点。" },
    { name: "小仓位试错", meta: "18 分钟前", copy: "我现在看到强观点都会先问一句：这到底是事实、判断，还是情绪。" },
    { name: "周末再研究", meta: "46 分钟前", copy: "先收藏了，等有时间把公司公告和评论区观点一起看。" }
  ];
}

function renderNote() {
  const post = currentPost();
  const stats = noteStats(post);
  const comments = noteComments(post);
  $("#noteView").innerHTML = `
    <div class="author-row">
      <div class="avatar" style="background:${post.avatarColor}">${escapeHtml(post.avatar)}</div>
      <div class="author-meta">
        <strong>${escapeHtml(post.author)}</strong>
        <span>${escapeHtml(post.meta)}</span>
      </div>
      <button class="follow-button" type="button">关注</button>
    </div>
    <h2 class="note-title">${escapeHtml(post.title)}</h2>
    <div class="note-media" aria-hidden="true">
      <div class="media-chip">${escapeHtml(post.mediaLabel)}</div>
      <div class="chart-line">
        <svg viewBox="0 0 386 132" role="img">
          <path d="${post.chart}" fill="none" stroke="#2d6cdf" stroke-width="8" stroke-linecap="round" />
          <path d="M6,112 L380,112" stroke="rgba(21,23,26,.16)" stroke-width="2" />
          <circle cx="318" cy="52" r="7" fill="#2d6cdf" />
          <circle cx="245" cy="88" r="5" fill="#0f172a" />
        </svg>
      </div>
    </div>
    <div class="note-body">
      ${post.paragraphs.map((paragraph) => `<p class="note-paragraph">${renderParagraph(paragraph)}</p>`).join("")}
    </div>
    <div class="tag-row">
      ${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
    <div class="note-stats">
      <span>${stats.likes} 赞</span>
      <span>${stats.collects} 收藏</span>
      <span>${stats.comments} 评论</span>
    </div>
    <div class="note-actions">
      <button type="button">收藏</button>
      <button type="button">评论</button>
      <button type="button">分享</button>
    </div>
    <div class="comment-thread">
      <div class="comment-title">精选评论</div>
      ${comments
        .map(
          (comment) => `
            <div class="comment-item">
              <div class="comment-avatar">${escapeHtml(comment.name.slice(0, 1))}</div>
              <div class="comment-bubble">
                <div class="comment-line">
                  <strong>${escapeHtml(comment.name)}</strong>
                  <em>${escapeHtml(comment.meta)}</em>
                </div>
                <span>${escapeHtml(comment.copy)}</span>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  $("#noteView").querySelectorAll(".evidence-dot").forEach((button) => {
    button.addEventListener("click", () => {
      appState = {
        ...appState,
        pointId: button.dataset.point,
        sheetOpen: true,
        sheetMode: currentPost().isCustom ? "custom" : "point",
        tracked: false
      };
      renderAll();
    });
  });
}

function renderPanelMetrics(point) {
  const metrics = [
    ["内容类型", point.contentType],
    ["主要价值", point.mainValue],
    ["证据状态", point.evidence],
    ["情绪风险", point.emotionRisk]
  ];

  $("#panelGrid").innerHTML = metrics
    .map(
      ([label, value]) => `
        <div class="metric">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `
    )
    .join("");
}

function depthDetails(point) {
  const state = states[appState.userState];
  if (appState.userState === "browsing" || appState.reducedHints) {
    return `
      <div class="claim-box">${escapeHtml(point.hints.browsing)}</div>
      <div class="badge-row">
        <span class="badge ${badgeClass(point.contentType)}">${escapeHtml(point.contentType)}</span>
        <span class="badge ${badgeClass(point.emotionRisk)}">${escapeHtml(point.emotionRisk)}</span>
      </div>
    `;
  }

  const list = [
    ["原文片段", point.claim],
    ["AI 核验", point.verification],
    ["不适合用途", point.unsuitable],
    ["生成式表达痕迹", point.generatedTrace],
    ["真实经验信号", point.realSignal],
    ["人工核验缺口", point.humanGap]
  ];

  if (appState.userState === "interest") {
    return `
      <div class="claim-box">${escapeHtml(point.hints.interest)}</div>
      <ul class="detail-list">
        ${list.slice(0, 4).map(([label, value]) => `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></li>`).join("")}
      </ul>
    `;
  }

  return `
    <div class="claim-box">${escapeHtml(point.hints.research)}</div>
    <ul class="detail-list">
      ${list.map(([label, value]) => `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></li>`).join("")}
    </ul>
    ${renderSources(point)}
  `;
}

function renderSources(point) {
  if (!point.sources.length) {
    return `<p class="source-list"><span class="badge gold">个人经历或情绪表达，无需强制外部来源</span></p>`;
  }

  return `
    <div class="source-list">
      ${point.sources.map(([label, url]) => `<a class="source-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`).join("")}
    </div>
  `;
}

function renderPerspectiveInsight(point) {
  const metricsKey =
    appState.perspective === "short"
      ? "shortMetrics"
      : appState.perspective === "value"
        ? "valueMetrics"
        : "balancedMetrics";
  const perspective = perspectives[appState.perspective];

  $("#perspectiveInsight").innerHTML = `
    <h3>${escapeHtml(perspective.label)}指标</h3>
    <p>${escapeHtml(perspective.description)}</p>
    <div class="badge-row">
      ${point[metricsKey].map((item) => `<span class="badge ${badgeClass(item)}">${escapeHtml(item)}</span>`).join("")}
    </div>
    <div class="badge-row">
      <button class="secondary-button" type="button" data-switch-perspective="short">改看技术面</button>
      <button class="secondary-button" type="button" data-switch-perspective="value">改看基本面</button>
      <button class="secondary-button" type="button" data-switch-perspective="balanced">改看混合</button>
    </div>
  `;

  $("#perspectiveInsight").querySelectorAll("[data-switch-perspective]").forEach((button) => {
    button.addEventListener("click", () => {
      applyPerspective(button.dataset.switchPerspective);
    });
  });
}

function renderTracker(point) {
  if (!point.dispute) {
    $("#trackerBlock").innerHTML = "";
    return;
  }

  $("#trackerBlock").innerHTML = `
    <h3>AI 提炼的争议点</h3>
    <div class="claim-box">${escapeHtml(point.dispute)}</div>
    <button class="primary-button" id="trackButton" type="button">
      ${appState.tracked ? "已追踪这个观点" : "追踪这个观点"}
    </button>
    ${
      appState.tracked
        ? `
          <div class="tracker-card">
            <strong>已加入观察</strong>
            <div class="distribution" aria-hidden="true"><span></span><span></span><span></span></div>
            <p>内容倾向分布：64% 乐观 / 21% 中性 / 15% 悲观</p>
            <ul class="detail-list">
              <li><span>相关笔记</span><strong>${escapeHtml(point.tracker.count)}</strong></li>
              <li><span>主要支持依据</span><strong>${escapeHtml(point.tracker.support)}</strong></li>
              <li><span>主要反对依据</span><strong>${escapeHtml(point.tracker.oppose)}</strong></li>
              <li><span>新增更新</span><strong>${escapeHtml(point.tracker.update)}</strong></li>
            </ul>
          </div>
        `
        : ""
    }
  `;

  $("#trackButton").addEventListener("click", () => {
    appState = {
      ...appState,
      userState: "research",
      tracked: true
    };
    renderAll();
  });
}

function renderPushes(point) {
  const shortPushes = [
    ["热度上升", `关于“${point.dispute || point.claim}”的技术面讨论明显增加。`],
    ["情绪提醒", "相关笔记中 FOMO / 恐慌表达占比上升。"],
    ["叙事变化", "多篇笔记开始重复同一技术信号，建议核对行情数据。"]
  ];
  const valuePushes = [
    ["财报更新", "你追踪的公司发布新公告或财报来源。"],
    ["估值争议", `关于“${point.dispute || point.claim}”出现新的支持与反对依据。`],
    ["基本面变化", "多篇笔记提到财务指标变化，但部分缺少官方来源。"]
  ];
  const balancedPushes = [
    ["新证据", "你看过的观点出现新的官方来源。"],
    ["内容边界", "相似笔记中个人经历和投资观点混用较多。"],
    ["可信提醒", "疑似生成式表达增加，建议优先查看有来源的内容。"]
  ];
  const pushes =
    appState.perspective === "short"
      ? shortPushes
      : appState.perspective === "value"
        ? valuePushes
        : balancedPushes;

  $("#pushBlock").innerHTML = `
    <h3>个性化推送预览</h3>
    <div class="push-list">
      ${pushes
        .map(
          ([title, copy]) => `
            <div class="push-item">
              <strong>${escapeHtml(title)}</strong>
              <span>${escapeHtml(copy)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

async function analyzeCustomInput(source = "tools") {
  const input = source === "quick" ? $("#quickScenarioInput") : $("#customInput");
  const button = source === "quick" ? $("#quickScenarioButton") : $("#analyzeCustomButton");
  const mode = source === "quick" ? $("#apiConnectionStatus") : $("#analysisMode");
  const text = input.value.trim();

  if (!text) {
    showToast("先输入一段投资相关内容");
    return;
  }

  button.disabled = true;
  const idleLabel = source === "quick" ? "生成阅读场景" : "分析这段内容";
  button.textContent = source === "quick" ? "生成中..." : "分析中...";
  if (mode) mode.textContent = "正在调用模型并生成阅读场景...";

  let result;
  let provider = "local";
  let warning = "";

  try {
    if (location.protocol.startsWith("http")) {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          userState: appState.userState,
          perspective: appState.perspective,
          apiKey: appState.apiSettings.apiKey,
          model: appState.apiSettings.model,
          baseUrl: appState.apiSettings.baseUrl
        })
      });
      if (response.ok) {
        const payload = await response.json();
        provider = payload.provider || "api";
        result = normalizeAnalysis(payload.analysis || payload, text, provider);
        warning = payload.warning || "";
      } else {
        warning = `/api/analyze 返回 ${response.status}`;
      }
    } else {
      warning = "当前页面不是通过 http(s) 服务打开，无法请求 /api/analyze。请使用 Vercel 链接或 node server.js。";
    }
  } catch (error) {
    warning = `无法连接 /api/analyze：${error.message}`;
    result = null;
  }

  if (!result) {
    provider = "local";
    result = normalizeAnalysis(buildLocalAnalysis(text), text, provider);
  }
  result.warning = warning;
  const customPost = buildCustomScenarioPost(text, result);
  const firstPointId = firstVisiblePointId(customPost, appState.perspective);

  appState = {
    ...appState,
    activeView: "experience",
    customInput: text,
    quickScenarioInput: text,
    customResult: result,
    customPost,
    postId: customPost.id,
    pointId: firstPointId,
    sheetMode: "custom",
    sheetOpen: false,
    tracked: false
  };

  appState.apiStatus = provider === "local" ? "idle" : "connected";
  appState.apiStatusMessage = provider === "local" ? "本地兜底已生成场景" : `${provider} 已生成场景`;
  if (mode) mode.textContent = appState.apiStatusMessage;
  button.disabled = false;
  button.textContent = idleLabel;
  showToast("已生成类小红书阅读场景，点击正文证据点查看 AI 判断");
  renderAll();
}

function renderJudgmentSheet() {
  const sheet = $("#judgmentSheet");
  if (!sheet) return;

  if (!appState.sheetOpen || appState.activeView !== "experience") {
    sheet.classList.remove("open");
    sheet.innerHTML = "";
    sheet.onclick = null;
    return;
  }

  const point = currentPoint();
  const metricsKey =
    appState.perspective === "short"
      ? "shortMetrics"
      : appState.perspective === "value"
        ? "valueMetrics"
        : "balancedMetrics";
  const hint =
    appState.userState === "research"
      ? point.hints.research
      : appState.userState === "interest"
        ? point.hints.interest
        : point.hints.browsing;
  const showDeep = appState.userState === "research";
  const showMid = appState.userState !== "browsing";
  const isCustom = appState.sheetMode === "custom";

  sheet.classList.add("open");
  sheet.innerHTML = `
    <div class="judgment-card" role="dialog" aria-modal="true" aria-labelledby="judgmentTitle">
      <div class="judgment-head">
        <div>
          <p class="eyebrow"><span></span> ${isCustom ? "自定义输入分析" : "小红书 AI 证据判断"}</p>
          <h2 id="judgmentTitle">${escapeHtml(point.claim)}</h2>
        </div>
        <button class="icon-button" id="closeSheetButton" type="button" aria-label="关闭 AI 判断">×</button>
      </div>
      <div class="judgment-body">
        <div class="badge-row">
          <span class="badge blue">${escapeHtml(states[appState.userState].label)}输出</span>
          <span class="badge blue">${escapeHtml(perspectives[appState.perspective].label)}视角</span>
        </div>
        <div class="sheet-hint">${escapeHtml(hint)}</div>
        ${
          isCustom
            ? `<p class="sheet-hint">分析来源：${escapeHtml(point.provider === "local" ? "本地兜底分析" : `${point.provider} 大模型接口`)}。真实产品中，这里会由小红书站内模型和可信金融数据源共同生成。</p>`
            : ""
        }
        ${
          isCustom && point.warning
            ? `<p class="sheet-hint">模型调用诊断：${escapeHtml(point.warning)}</p>`
            : ""
        }
        <div class="sheet-metrics">
          <div class="metric"><span>内容类型</span><strong>${escapeHtml(point.contentType)}</strong></div>
          <div class="metric"><span>证据状态</span><strong>${escapeHtml(point.evidence)}</strong></div>
          <div class="metric"><span>情绪风险</span><strong>${escapeHtml(point.emotionRisk)}</strong></div>
        </div>
        <div class="badge-row">
          <span class="badge ${badgeClass(point.verification)}">${escapeHtml(point.verification)}</span>
          <span class="badge ${badgeClass(point.tone)}">${escapeHtml(point.tone)}</span>
          <span class="badge ${point.generatedTrace === "高" ? "danger" : point.generatedTrace === "中" ? "gold" : "teal"}">生成痕迹：${escapeHtml(point.generatedTrace)}</span>
          <span class="badge ${point.realSignal === "高" ? "teal" : point.realSignal === "中" ? "gold" : "blue"}">真实经验：${escapeHtml(point.realSignal)}</span>
        </div>
        ${
          showMid
            ? `
              <div class="sheet-section">
                <h3>${escapeHtml(perspectives[appState.perspective].label)}优先指标</h3>
                <div class="badge-row">
                  ${point[metricsKey].map((item) => `<span class="badge ${badgeClass(item)}">${escapeHtml(item)}</span>`).join("")}
                </div>
              </div>
              <div class="sheet-section">
                <h3>适用边界</h3>
                <ul class="detail-list">
                  <li><span>主要价值</span><strong>${escapeHtml(point.mainValue)}</strong></li>
                  <li><span>不适合用途</span><strong>${escapeHtml(point.unsuitable)}</strong></li>
                  <li><span>核验缺口</span><strong>${escapeHtml(point.humanGap)}</strong></li>
                </ul>
              </div>
            `
            : ""
        }
        ${
          showDeep
            ? `
              <div class="sheet-section">
                <h3>可信来源</h3>
                ${renderSources(point)}
              </div>
              <div class="sheet-section">
                <h3>可追踪争议点</h3>
                <div class="claim-box">${escapeHtml(point.dispute)}</div>
                <button class="primary-button" id="sheetTrackButton" type="button">
                  ${appState.tracked ? "已追踪这个观点" : "追踪这个观点"}
                </button>
                ${
                  appState.tracked
                    ? `<p class="sheet-hint">已加入观察：${escapeHtml(point.tracker.count)}。主要支持依据：${escapeHtml(point.tracker.support)}；主要反对依据：${escapeHtml(point.tracker.oppose)}。</p>`
                    : ""
                }
              </div>
            `
            : ""
        }
      </div>
    </div>
  `;

  $("#closeSheetButton").addEventListener("click", () => {
    appState = {
      ...appState,
      sheetOpen: false
    };
    renderAll();
  });

  const trackButton = $("#sheetTrackButton");
  if (trackButton) {
    trackButton.addEventListener("click", () => {
      appState = {
        ...appState,
        userState: "research",
        tracked: true
      };
      renderAll();
    });
  }

  sheet.onclick = (event) => {
    if (event.target === sheet) {
      appState = {
        ...appState,
        sheetOpen: false
      };
      renderAll();
    }
  };
}

function renderPanel() {
  const point = currentPoint();
  $("#currentState").textContent = states[appState.userState].label;
  $("#currentPerspective").textContent = perspectives[appState.perspective].label;
  $("#panelTitle").textContent = appState.reducedHints ? "低打扰提醒模式" : point.claim;

  renderPanelMetrics(point);

  $("#selectedInsight").innerHTML = `
    <h3>${escapeHtml(states[appState.userState].depth)}</h3>
    <p>${escapeHtml(states[appState.userState].description)}</p>
    ${depthDetails(point)}
    <div class="badge-row">
      <span class="badge ${badgeClass(point.verification)}">${escapeHtml(point.verification)}</span>
      <span class="badge ${badgeClass(point.tone)}">${escapeHtml(point.tone)}</span>
      <span class="badge ${point.generatedTrace === "高" ? "danger" : point.generatedTrace === "中" ? "gold" : "teal"}">生成痕迹：${escapeHtml(point.generatedTrace)}</span>
      <span class="badge ${point.realSignal === "高" ? "teal" : point.realSignal === "中" ? "gold" : "blue"}">真实经验：${escapeHtml(point.realSignal)}</span>
    </div>
  `;

  renderPerspectiveInsight(point);
  renderTracker(point);
  renderPushes(point);
}

function apiStatusCopy() {
  if (appState.apiStatus === "testing") return "正在测试 AI 连接...";
  if (appState.apiStatus === "connected") return appState.apiStatusMessage || "AI 已连接";
  if (appState.apiStatus === "failed") return appState.apiStatusMessage || "AI 连接失败 · 可用本地兜底";
  return appState.apiSettings.apiKey.trim() ? "已填写 Key · 可测试连接" : "AI 未连接 · 可用本地兜底";
}

function renderProfileStrip() {
  const button = $("#profileToggleButton");
  const controls = document.querySelector(".controls-row.in-experience");
  if (!button || !controls) return;

  button.textContent = `当前模拟用户：${states[appState.userState].label} · ${perspectives[appState.perspective].label}`;
  button.classList.toggle("active", appState.profileControlsOpen);
  controls.classList.toggle("collapsed", !appState.profileControlsOpen);
  button.onclick = () => {
    appState.profileControlsOpen = !appState.profileControlsOpen;
    renderAll();
  };
}

function renderMarkerStrategy() {
  const target = $("#markerStrategy");
  if (!target) return;

  const post = currentPost();
  const total = Object.keys(post.points || {}).length;
  const visible = visiblePointIds(post, appState.perspective).length;
  const strategy = markerStrategies[appState.perspective] || markerStrategies.balanced;

  target.innerHTML = `
    <strong>${escapeHtml(strategy.label)} · ${visible}/${total} 个点</strong>
    <span>${escapeHtml(strategy.copy)}</span>
  `;
}

function renderQuickScenarioControls() {
  const input = $("#quickScenarioInput");
  const button = $("#quickScenarioButton");
  const demoButton = $("#runStoryDemoButton");
  const setupButton = $("#openApiSetupButton");
  const status = $("#apiConnectionStatus");
  if (!input || !button || !demoButton || !setupButton || !status) return;

  if (document.activeElement !== input) {
    input.value = appState.quickScenarioInput || appState.customInput || "";
  }
  status.textContent = apiStatusCopy();
  status.classList.toggle("connected", appState.apiStatus === "connected");
  status.classList.toggle("testing", appState.apiStatus === "testing");
  status.classList.toggle("failed", appState.apiStatus === "failed");

  input.oninput = () => {
    appState.quickScenarioInput = input.value;
  };
  button.onclick = () => analyzeCustomInput("quick");
  demoButton.onclick = () => {
    appState.quickScenarioInput = storyDemoText;
    input.value = storyDemoText;
    analyzeCustomInput("quick");
  };
  setupButton.onclick = () => {
    appState.activeView = "tools";
    appState.sheetOpen = false;
    renderAll();
    window.setTimeout(() => $("#apiKeyInput")?.focus(), 80);
  };
}

async function testApiConnection() {
  const button = $("#testApiButton");
  if (!appState.apiSettings.apiKey.trim()) {
    appState.apiStatus = "failed";
    appState.apiStatusMessage = "请先输入 API Key";
    showToast("请先输入 API Key");
    renderAll();
    return;
  }

  appState.apiStatus = "testing";
  appState.apiStatusMessage = "正在测试 AI 连接...";
  if (button) {
    button.disabled = true;
    button.textContent = "测试中...";
  }
  renderAll();

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "测试连接：这是一段投资内容，不构成投资建议。",
        userState: appState.userState,
        perspective: appState.perspective,
        apiKey: appState.apiSettings.apiKey,
        model: appState.apiSettings.model,
        baseUrl: appState.apiSettings.baseUrl
      })
    });
    const payload = await response.json();
    const provider = payload.provider || "";
    const ok = response.ok && provider !== "local" && !payload.warning;
    appState.apiStatus = ok ? "connected" : "failed";
    appState.apiStatusMessage = ok ? `${provider} 连接成功` : payload.warning || payload.error || "连接未成功，仍可本地兜底";
    showToast(ok ? "AI 连接成功" : "连接未成功，仍可本地兜底");
  } catch (error) {
    appState.apiStatus = "failed";
    appState.apiStatusMessage = `连接失败：${error.message}`;
    showToast("AI 连接失败，仍可本地兜底");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "测试连接";
    }
    renderAll();
  }
}

function renderCustomAnalyzer() {
  const input = $("#customInput");
  const button = $("#analyzeCustomButton");
  const mode = $("#analysisMode");
  const apiKeyInput = $("#apiKeyInput");
  const apiModelInput = $("#apiModelInput");
  const apiBaseUrlInput = $("#apiBaseUrlInput");
  const testButton = $("#testApiButton");
  if (!input || !button || !mode) return;

  if (document.activeElement !== input) input.value = appState.customInput;
  if (apiKeyInput && document.activeElement !== apiKeyInput) apiKeyInput.value = appState.apiSettings.apiKey;
  if (apiModelInput && document.activeElement !== apiModelInput) apiModelInput.value = appState.apiSettings.model;
  if (apiBaseUrlInput && document.activeElement !== apiBaseUrlInput) apiBaseUrlInput.value = appState.apiSettings.baseUrl;
  const provider = appState.customResult?.provider;
  const hasUiKey = Boolean(appState.apiSettings.apiKey.trim());
  mode.textContent = provider && appState.sheetMode === "custom"
    ? `当前：${provider === "local" ? "本地兜底分析" : `${provider} 大模型分析`}`
    : hasUiKey
      ? apiStatusCopy()
      : "输入 DeepSeek API Key 后可直接调用模型";
  button.onclick = () => analyzeCustomInput("tools");
  if (testButton) {
    testButton.onclick = testApiConnection;
    testButton.disabled = appState.apiStatus === "testing";
    testButton.textContent = appState.apiStatus === "testing" ? "测试中..." : "测试连接";
  }
  input.oninput = () => {
    appState.customInput = input.value;
    appState.quickScenarioInput = input.value;
  };
  if (apiKeyInput) {
    apiKeyInput.oninput = () => {
      appState.apiSettings.apiKey = apiKeyInput.value.trim();
      appState.apiStatus = "idle";
      appState.apiStatusMessage = "";
      sessionStorage.setItem("xhsEvidenceApiKey", appState.apiSettings.apiKey);
      renderCustomAnalyzer();
    };
  }
  if (apiModelInput) {
    apiModelInput.oninput = () => {
      appState.apiSettings.model = apiModelInput.value.trim() || defaultModel;
      appState.apiStatus = "idle";
      appState.apiStatusMessage = "";
      sessionStorage.setItem("xhsEvidenceModel", appState.apiSettings.model);
    };
  }
  if (apiBaseUrlInput) {
    apiBaseUrlInput.oninput = () => {
      appState.apiSettings.baseUrl = apiBaseUrlInput.value.trim() || defaultBaseUrl;
      appState.apiStatus = "idle";
      appState.apiStatusMessage = "";
      sessionStorage.setItem("xhsEvidenceBaseUrl", appState.apiSettings.baseUrl);
    };
  }
}

function renderProfileSkills() {
  const input = $("#profileInput");
  const button = $("#runProfileSkillsButton");
  const mode = $("#profileSkillMode");
  const output = $("#profileSkillOutput");
  if (!input || !button || !mode || !output) return;

  if (input.value !== appState.profileInput) input.value = appState.profileInput;

  const result = appState.profileSkillResult;
  mode.textContent = result
    ? `已应用：${result.state.label} + ${result.style.label}`
    : "输入行为记录后运行判定";

  output.innerHTML = result
    ? `
      <div class="skill-result-card">
        <h4>Skill 1 · 当下状态：${escapeHtml(result.state.label)}</h4>
        <div class="badge-row">
          <span class="badge teal">置信度 ${escapeHtml(result.state.confidence)}%</span>
          ${result.state.signals.map((item) => `<span class="badge ${badgeClass(item)}">${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="badge-row">
          ${result.state.recSignals.map((item) => `<span class="badge blue">${escapeHtml(item)}</span>`).join("")}
        </div>
        <p>${escapeHtml(result.state.theory)}</p>
        <p><strong>应用方式：</strong>${escapeHtml(result.state.intervention)}</p>
      </div>
      <div class="skill-result-card">
        <h4>Skill 2 · 投资风格：${escapeHtml(result.style.label)}</h4>
        <div class="badge-row">
          <span class="badge teal">置信度 ${escapeHtml(result.style.confidence)}%</span>
          ${result.style.signals.map((item) => `<span class="badge ${badgeClass(item)}">${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="badge-row">
          ${result.style.recSignals.map((item) => `<span class="badge blue">${escapeHtml(item)}</span>`).join("")}
        </div>
        <p>${escapeHtml(result.style.theory)}</p>
        <p><strong>应用方式：</strong>${escapeHtml(result.style.intervention)}</p>
      </div>
    `
    : "";

  input.oninput = () => {
    appState.profileInput = input.value;
    sessionStorage.setItem("xhsEvidenceProfileInput", appState.profileInput);
  };

  button.onclick = () => {
    const text = input.value.trim();
    if (!text) {
      showToast("先输入浏览记录、帖子或评论");
      return;
    }
    const stateResult = classifyUserStateFromBehavior(text);
    const styleResult = classifyInvestmentStyleFromBehavior(text);
    appState = {
      ...appState,
      profileInput: text,
      profileSkillResult: {
        state: stateResult,
        style: styleResult
      },
      userState: stateResult.state,
      perspective: styleResult.perspective
    };
    sessionStorage.setItem("xhsEvidenceProfileInput", text);
    showToast(`已应用 ${stateResult.label} + ${styleResult.label}`);
    renderAll();
  };
}

function renderAll() {
  renderModeTabs();
  renderProfileStrip();
  renderMarkerStrategy();
  renderStateButtons();
  renderPreferenceButtons();
  renderWorkspaceProfileControls();
  renderPostTabs();
  renderNote();
  renderQuickScenarioControls();
  renderCustomAnalyzer();
  renderProfileSkills();
  renderPanel();
  renderJudgmentSheet();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 1800);
}

$("#reduceHintsButton").addEventListener("click", () => {
  appState = {
    ...appState,
    reducedHints: !appState.reducedHints
  };
  renderAll();
});

renderAll();
