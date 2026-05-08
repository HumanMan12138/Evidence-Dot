function preview(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  const first = clean.split(/[。！？!?]/).find(Boolean) || clean;
  return first.length > 80 ? `${first.slice(0, 80)}...` : first;
}

function inferContentType(text) {
  if (/亏|回撤|睡不着|难受|焦虑|后悔|复盘|账户/.test(text)) return "情绪经验型";
  if (/最后上车|赶紧|闭眼|必涨|必跌|稳赚|快跑|再不上|翻倍|吃肉/.test(text)) return "行动号召型";
  if (/什么是|怎么|如何|入门|科普|解释|看懂/.test(text)) return "教育科普型";
  if (/营收|收入|利润|现金流|ROE|PE|市盈率|估值|毛利率|同比|环比|负债|财报|公告/.test(text)) return "事实数据型";
  return "投资观点型";
}

function localAnalyze(text) {
  const contentType = inferContentType(text);
  const hasSource = /http|来源|财报|公告|SEC|上交所|深交所|港交所|年报|10-K|Investor Relations/i.test(text);
  const hasNumbers = /\d+(\.\d+)?%|\d+(\.\d+)?倍|\d+(\.\d+)?亿|\d+(\.\d+)?万/.test(text);
  const hasFomo = /最后上车|再不上|错过|赶紧|闭眼|必涨|稳赚|翻倍|吃肉/.test(text);
  const hasPanic = /崩盘|快跑|血洗|完了|没救|暴跌|恐慌/.test(text);
  const hasTemplate = /首先|其次|最后|综上|长期空间|确定性|核心逻辑|值得关注|未来可期/.test(text);
  const isPersonal = contentType === "情绪经验型";
  const isCall = contentType === "行动号召型";
  const isFact = contentType === "事实数据型";

  const tone = hasPanic ? "强悲观" : hasFomo ? "强乐观" : /亏|难受|焦虑|暴跌|回撤/.test(text) ? "偏悲观" : /看好|机会|增长|突破|低估/.test(text) ? "偏乐观" : "中性";
  const emotionRisk = isPersonal ? "情绪共鸣" : hasFomo ? "FOMO" : hasPanic ? "恐慌" : /必|一定|肯定|确定/.test(text) ? "绝对化表达" : "低风险";
  const evidence = isPersonal ? "不适用" : hasSource ? "部分充分" : hasNumbers || isCall ? "不充分" : "需要进一步判断";

  return {
    claim: preview(text),
    contentType,
    claimType: isPersonal ? "个人经历" : isCall ? "情绪表达" : isFact ? "事实数据" : "观点判断",
    mainValue: isPersonal ? "情绪共鸣与风险感知" : contentType === "教育科普型" ? "知识学习" : isFact ? "信息参考" : isCall ? "情绪感染" : "判断框架",
    unsuitable: isPersonal ? "不能推导市场结论" : "不能作为买入、卖出或加仓依据",
    verification: isPersonal || contentType === "教育科普型" ? "不适合事实核验" : hasSource ? "需要进一步判断" : "缺少来源",
    evidence,
    tone,
    emotionRisk,
    generatedTrace: hasTemplate && !isPersonal ? "高" : hasTemplate || (!hasSource && !isPersonal) ? "中" : "低",
    realSignal: isPersonal ? "高" : /我|自己|持仓|买入|卖出|截图|记录|复盘/.test(text) ? "中" : "低",
    humanGap: isPersonal ? "个人经历无需强制外部来源，但不代表普遍结果" : hasSource ? "需要确认来源口径、时效和推理链条" : "缺少官方来源、关键假设或作者人工核验痕迹",
    hints: {
      browsing: isPersonal ? "这是一条个人经历分享，适合共鸣，不宜直接推导市场结论。" : hasFomo ? "这段表达可能放大错过焦虑，建议先看证据。" : "这段内容需要结合来源、语气和适用边界理解。",
      interest: isPersonal ? "它的价值是风险感知和情绪陪伴，不构成投资依据。" : "这段内容包含可讨论观点，建议继续查看来源、假设和风险说明。",
      research: isPersonal ? "可用于理解投资者情绪，但不能证明公司基本面变化。" : "建议核对官方来源、财务口径、技术信号或估值假设。"
    },
    balancedMetrics: [contentType, `证据：${evidence}`, `情绪：${emotionRisk}`],
    shortMetrics: [hasFomo ? "FOMO 表达：高" : "FOMO 表达：低", hasNumbers ? "短期数字叙事：有" : "短期数字叙事：少", hasPanic ? "恐慌信号：有" : "恐慌信号：无"],
    valueMetrics: [hasSource ? "来源线索：有" : "来源线索：缺失", /现金流|ROE|利润|毛利率|负债|PE|估值/.test(text) ? "基本面指标：有" : "基本面指标：少", hasNumbers ? "可核验数字：有" : "可核验数字：少"],
    sources: hasSource ? [["用户文本中的来源线索", "#"]] : isPersonal ? [] : [["建议核对：公司财报/交易所公告", "https://www.sec.gov/edgar/search/"]],
    dispute: isPersonal ? "这段经历反映的是个人情绪，还是可复盘的仓位与风控问题？" : "这段判断背后的核心假设是否有证据支持？",
    tracker: {
      count: "自定义输入暂无站内聚合，真实产品可汇总过去 7 天相关笔记",
      support: hasSource ? "文本中存在来源线索或具体指标" : "需要继续补充支持依据",
      oppose: hasFomo || !hasSource ? "强表达或缺少来源会降低参考权重" : "仍需核对口径与时效",
      update: "可在接入真实数据源后追踪官方公告、财报更新和社区观点变化"
    }
  };
}

function schema() {
  return {
    type: "object",
    additionalProperties: true,
    properties: {
      claim: { type: "string" },
      contentType: { type: "string" },
      claimType: { type: "string" },
      mainValue: { type: "string" },
      unsuitable: { type: "string" },
      verification: { type: "string" },
      evidence: { type: "string" },
      tone: { type: "string" },
      emotionRisk: { type: "string" },
      generatedTrace: { type: "string" },
      realSignal: { type: "string" },
      humanGap: { type: "string" },
      hints: {
        type: "object",
        additionalProperties: true,
        properties: {
          browsing: { type: "string" },
          interest: { type: "string" },
          research: { type: "string" }
        }
      },
      balancedMetrics: { type: "array", items: { type: "string" } },
      shortMetrics: { type: "array", items: { type: "string" } },
      valueMetrics: { type: "array", items: { type: "string" } },
      sources: { type: "array", items: { type: "array", items: { type: "string" } } },
      dispute: { type: "string" },
      tracker: {
        type: "object",
        additionalProperties: true,
        properties: {
          count: { type: "string" },
          support: { type: "string" },
          oppose: { type: "string" },
          update: { type: "string" }
        }
      }
    }
  };
}

function extractChatContent(data) {
  return data?.choices?.[0]?.message?.content || "";
}

function parseJsonContent(content) {
  const clean = String(content || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(clean);
}

function buildPrompt(text, userState, perspective) {
  return [
    "你是小红书投资内容 AI 证据点的分析器。",
    "任务：分析用户输入的投资相关文本，输出严格 JSON，不要提供买入、卖出、加仓、目标价或收益预测建议。",
    "关注：内容类型、主要价值、证据状态、情绪倾向、生成式表达痕迹、真实经验信号、技术面指标、基本面指标和可追踪争议点。",
    "不要在 JSON 中加入理论解释字段；行为金融论文只用于产品逻辑说明，不展示给用户。",
    "如果是个人亏损/情绪经历，不要粗暴判定为低质量；应承认情绪共鸣和风险教育价值，同时说明不构成投资依据。",
    "必须只返回 JSON 对象，不要 markdown，不要解释。",
    "JSON 示例：{\"claim\":\"原文核心片段\",\"contentType\":\"事实数据型/投资观点型/情绪经验型/行动号召型/教育科普型\",\"claimType\":\"事实数据/观点判断/个人经历/情绪表达\",\"mainValue\":\"内容主要价值\",\"unsuitable\":\"不适合用途\",\"verification\":\"核验结论\",\"evidence\":\"充分/部分充分/不充分/不适用\",\"tone\":\"中性/偏乐观/强乐观/偏悲观/强悲观\",\"emotionRisk\":\"低风险/FOMO/恐慌/绝对化表达/情绪共鸣\",\"generatedTrace\":\"低/中/高\",\"realSignal\":\"低/中/高\",\"humanGap\":\"人工核验缺口\",\"hints\":{\"browsing\":\"浏览态提示\",\"interest\":\"兴趣态提示\",\"research\":\"研究态提示\"},\"balancedMetrics\":[\"指标\"],\"shortMetrics\":[\"技术面指标\"],\"valueMetrics\":[\"基本面指标\"],\"sources\":[[\"来源名称\",\"URL\"]],\"dispute\":\"可追踪争议点\",\"tracker\":{\"count\":\"相关内容聚合\",\"support\":\"支持依据\",\"oppose\":\"反对依据\",\"update\":\"后续更新\"}}",
    `用户状态：${userState || "browsing"}；历史浏览偏好：${perspective || "balanced"}。`,
    `文本：${text}`
  ].join("\n");
}

async function deepseekAnalyze({ text, userState, perspective, apiKey, baseUrl, model }) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "你只输出合法 JSON 对象。不要输出 markdown。" },
        { role: "user", content: buildPrompt(text, userState, perspective) }
      ],
      response_format: { type: "json_object" },
      stream: false,
      max_tokens: 1800
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`DeepSeek API failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return parseJsonContent(extractChatContent(data));
}

async function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await parseBody(req);
    const text = String(body.text || "").trim();
    if (!text) return res.status(400).json({ error: "text is required" });

    const apiKey = String(body.apiKey || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "").trim();
    const model = String(body.model || process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || "deepseek-chat").trim();
    const baseUrl = String(body.baseUrl || process.env.DEEPSEEK_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.deepseek.com").trim();

    if (!apiKey) {
      return res.status(200).json({ provider: "local", analysis: localAnalyze(text) });
    }

    try {
      const analysis = await deepseekAnalyze({
        text,
        userState: body.userState || "browsing",
        perspective: body.perspective || "balanced",
        apiKey,
        model,
        baseUrl
      });
      return res.status(200).json({ provider: `DeepSeek ${model}`, analysis });
    } catch (error) {
      return res.status(200).json({
        provider: "local",
        warning: `模型接口调用失败：${error.message}`,
        analysis: localAnalyze(text)
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
