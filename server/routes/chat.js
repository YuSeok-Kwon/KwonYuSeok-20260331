const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const data = require("../data/loader");

let openai = null;
function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 "다이소 뷰티 AI 컨시어지"입니다. 다이소에서 판매하는 뷰티 제품을 추천하고 성분 정보를 안내하는 전문 상담사입니다.

역할:
- 사용자의 피부 고민(주름, 보습, 트러블, 미백, 모공, 진정, 자외선차단, 각질)을 파악합니다.
- 피부 고민에 맞는 핵심 성분을 설명합니다.
- 다이소 제품 데이터베이스에서 적합한 제품을 검색하여 추천합니다.
- 제품의 성분 분석, ABSA 리뷰 요약을 제공합니다.

피부 고민별 핵심 성분:
- 주름/노화: 레티놀, 아데노신, 나이아신아마이드, 펩타이드, 콜라겐
- 보습/건조: 히알루론산, 글리세린, 세라마이드, 스쿠알란, 판테놀
- 트러블/뾰루지: 살리실산(BHA), 티트리, 어성초, 병풀(시카)
- 미백/톤업: 나이아신아마이드, 비타민C, 알부틴, 글루타치온
- 모공: 살리실산(BHA), 나이아신아마이드, PHA, AHA
- 진정/민감: 병풀(시카), 알란토인, 판테놀, 녹차, 감초
- 자외선차단: SPF/PA 등급 확인
- 각질/피부결: AHA(글라이콜릭애씨드), BHA(살리실산), PHA, 우레아

응답 지침:
1. 사용자의 피부 고민을 먼저 파악하세요.
2. function calling을 활용하여 실제 제품 데이터를 검색하세요.
3. 추천 시 제품명, 가격, 핵심 성분, 리뷰 요약을 포함하세요.
4. 가격 대비 성능(가성비)을 강조하세요 — 다이소 제품은 모두 5,000원 이하입니다.
5. 성분에 대한 설명은 쉬운 말로 해주세요.
6. 답변은 한국어로 하되, 친근하고 전문적인 톤을 유지하세요.`;

// Function calling 스키마
const tools = [
  {
    type: "function",
    function: {
      name: "searchProducts",
      description:
        "피부 고민, 카테고리, 키워드로 다이소 뷰티 제품을 검색합니다.",
      parameters: {
        type: "object",
        properties: {
          skin_concern: {
            type: "string",
            description:
              "피부 고민 (wrinkle, moisture, acne, brightening, pore, soothing, suncare, exfoliation)",
          },
          category_1: {
            type: "string",
            description: "대분류 (스킨케어, 메이크업, 클렌징, 선케어, 바디케어)",
          },
          keyword: {
            type: "string",
            description: "제품명 또는 브랜드 검색 키워드",
          },
          max_price: {
            type: "number",
            description: "최대 가격 (원)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getProductDetail",
      description: "특정 제품의 상세 정보와 성분을 조회합니다.",
      parameters: {
        type: "object",
        properties: {
          product_code: {
            type: "string",
            description: "제품 코드",
          },
        },
        required: ["product_code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getProductReviews",
      description:
        "특정 제품의 ABSA 리뷰 요약과 대표 리뷰 텍스트를 조회합니다.",
      parameters: {
        type: "object",
        properties: {
          product_code: {
            type: "string",
            description: "제품 코드",
          },
        },
        required: ["product_code"],
      },
    },
  },
];

// Function calling 핸들러
function handleFunctionCall(name, args) {
  switch (name) {
    case "searchProducts": {
      let products = data.getProducts();

      if (args.skin_concern) {
        const concerns = args.skin_concern.split(",");
        products = products.filter((p) =>
          concerns.some((c) => p.skin_concerns.includes(c))
        );
      }
      if (args.category_1) {
        products = products.filter((p) => p.category_1 === args.category_1);
      }
      if (args.keyword) {
        const kw = args.keyword.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(kw) ||
            (p.brand_name && p.brand_name.toLowerCase().includes(kw))
        );
      }
      if (args.max_price) {
        products = products.filter((p) => p.price <= args.max_price);
      }

      // 상위 5개 반환
      products.sort((a, b) => b.review_count - a.review_count);
      return products.slice(0, 5).map((p) => ({
        product_code: p.product_code,
        name: p.name,
        price: p.price,
        brand_name: p.brand_name,
        category_2: p.category_2,
        skin_concerns: p.skin_concerns,
        review_count: p.review_count,
      }));
    }

    case "getProductDetail": {
      const product = data.getProductByCode(args.product_code);
      if (!product) return { error: "제품을 찾을 수 없습니다." };

      const ingredients = data.getIngredients(args.product_code);
      const skinConcerns = data.getSkinConcerns();

      const highlightIds = new Set();
      for (const concern of product.skin_concerns) {
        const def = skinConcerns.concerns[concern];
        if (def) def.key_ingredient_ids.forEach((id) => highlightIds.add(id));
      }

      return {
        ...product,
        key_ingredients: ingredients
          .filter((i) => highlightIds.has(i.ingredient_id))
          .map((i) => i.ingredient_name),
        total_ingredients: ingredients.length,
      };
    }

    case "getProductReviews": {
      const absa = data.getAbsa(args.product_code);
      const reviews = data.getReviews(args.product_code);
      return { absa, reviews };
    }

    default:
      return { error: `알 수 없는 함수: ${name}` };
  }
}

// 제품 컨텍스트 빌더 (토큰 최적화)
function buildProductContext(productCode) {
  const product = data.getProductByCode(productCode);
  if (!product) return null;

  const ingredients = data.getIngredients(productCode);
  const absa = data.getAbsa(productCode);
  const reviews = data.getReviews(productCode);

  const topIngredients = ingredients.slice(0, 10).map((i) => i.ingredient_name).join(", ");

  const absaSummary = Object.entries(absa)
    .map(([aspect, d]) => `${aspect}: 긍정 ${d.positive_rate}%`)
    .join(", ");

  const topReview = reviews.positive?.[0]?.text || "";

  return `[현재 제품 정보]
이름: ${product.name}
브랜드: ${product.brand_name}
가격: ${product.price}원
카테고리: ${product.category_1} > ${product.category_2}
피부고민 태그: ${product.skin_concerns.join(", ")}
주요 성분: ${topIngredients}
ABSA 요약: ${absaSummary}
대표 리뷰: "${topReview}"`;
}

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { messages, productCode } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages 배열이 필요합니다." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API 키가 설정되지 않았습니다." });
    }

    let systemContent = SYSTEM_PROMPT;
    if (productCode) {
      const context = buildProductContext(productCode);
      if (context) {
        systemContent += "\n\n" + context;
      }
    }

    const chatMessages = [{ role: "system", content: systemContent }, ...messages];

    const client = getOpenAI();
    let response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      tools,
      tool_choice: "auto",
    });

    let assistantMessage = response.choices[0].message;

    // Function calling 루프 (최대 3회)
    let iteration = 0;
    while (assistantMessage.tool_calls && iteration < 3) {
      chatMessages.push(assistantMessage);

      for (const toolCall of assistantMessage.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments);
        const result = handleFunctionCall(toolCall.function.name, args);

        chatMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages,
        tools,
        tool_choice: "auto",
      });

      assistantMessage = response.choices[0].message;
      iteration++;
    }

    res.json({
      message: assistantMessage.content,
      usage: response.usage,
    });
  } catch (err) {
    console.error("Chat API 오류:", err);
    res.status(500).json({
      error: "AI 응답 생성 중 오류가 발생했습니다.",
      detail: err.message,
    });
  }
});

module.exports = router;
