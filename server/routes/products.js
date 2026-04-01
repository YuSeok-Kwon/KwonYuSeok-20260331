const express = require("express");
const router = express.Router();
const data = require("../data/loader");

// GET /api/products — 제품 목록 + 필터링
router.get("/", (req, res) => {
  let products = data.getProducts();

  const { category_1, category_2, skin_concern, keyword, min_price, max_price, sort, page, limit } = req.query;

  // 카테고리 필터
  if (category_1) {
    products = products.filter((p) => p.category_1 === category_1);
  }
  if (category_2) {
    products = products.filter((p) => p.category_2 === category_2);
  }

  // 피부 고민 필터 (콤마 구분 다중 선택)
  if (skin_concern) {
    const concerns = skin_concern.split(",");
    products = products.filter((p) =>
      concerns.some((c) => p.skin_concerns.includes(c))
    );
  }

  // 키워드 검색 (제품명, 브랜드)
  if (keyword) {
    const kw = keyword.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        (p.brand_name && p.brand_name.toLowerCase().includes(kw))
    );
  }

  // 가격 필터
  if (min_price) {
    products = products.filter((p) => p.price >= Number(min_price));
  }
  if (max_price) {
    products = products.filter((p) => p.price <= Number(max_price));
  }

  // 정렬
  if (sort === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "review_count") {
    products.sort((a, b) => b.review_count - a.review_count);
  } else if (sort === "engagement") {
    products.sort((a, b) => b.engagement_score - a.engagement_score);
  }

  // 페이지네이션
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const total = products.length;
  const totalPages = Math.ceil(total / limitNum);
  const offset = (pageNum - 1) * limitNum;
  const paged = products.slice(offset, offset + limitNum);

  res.json({
    products: paged,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  });
});

// GET /api/products/categories — 카테고리 목록
router.get("/categories", (req, res) => {
  const products = data.getProducts();
  const categoryMap = {};

  for (const p of products) {
    if (!categoryMap[p.category_1]) {
      categoryMap[p.category_1] = new Set();
    }
    if (p.category_2) {
      categoryMap[p.category_1].add(p.category_2);
    }
  }

  const categories = Object.entries(categoryMap).map(([cat1, cat2Set]) => ({
    category_1: cat1,
    category_2: [...cat2Set].sort(),
  }));

  res.json(categories);
});

// GET /api/products/:code — 제품 상세
router.get("/:code", (req, res) => {
  const product = data.getProductByCode(req.params.code);
  if (!product) {
    return res.status(404).json({ error: "제품을 찾을 수 없습니다." });
  }

  const ingredients = data.getIngredients(req.params.code);
  const skinConcerns = data.getSkinConcerns();

  // 주요 성분 하이라이트
  const highlightIds = new Set();
  for (const concern of product.skin_concerns) {
    const def = skinConcerns.concerns[concern];
    if (def) {
      def.key_ingredient_ids.forEach((id) => highlightIds.add(id));
    }
  }

  const ingredientsWithHighlight = ingredients.map((ing) => ({
    ...ing,
    is_key_ingredient: highlightIds.has(ing.ingredient_id),
  }));

  res.json({
    ...product,
    ingredients: ingredientsWithHighlight,
  });
});

// GET /api/products/:code/absa — ABSA 요약
router.get("/:code/absa", (req, res) => {
  const product = data.getProductByCode(req.params.code);
  if (!product) {
    return res.status(404).json({ error: "제품을 찾을 수 없습니다." });
  }

  const absa = data.getAbsa(req.params.code);
  res.json({ product_code: req.params.code, aspects: absa });
});

// GET /api/products/:code/reviews — 대표 리뷰
router.get("/:code/reviews", (req, res) => {
  const product = data.getProductByCode(req.params.code);
  if (!product) {
    return res.status(404).json({ error: "제품을 찾을 수 없습니다." });
  }

  const reviews = data.getReviews(req.params.code);
  res.json({ product_code: req.params.code, reviews });
});

module.exports = router;
