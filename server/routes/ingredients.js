const express = require("express");
const router = express.Router();
const data = require("../data/loader");

// GET /api/skin-concerns — 피부 고민 목록
router.get("/skin-concerns", (req, res) => {
  const skinConcerns = data.getSkinConcerns();
  res.json(skinConcerns);
});

// GET /api/ingredients/search — 성분 검색
router.get("/ingredients/search", (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 1) {
    return res.status(400).json({ error: "검색어를 입력해주세요." });
  }

  const dic = data.getIngredientsDic();
  const keyword = q.toLowerCase();
  const results = dic.filter((ing) =>
    ing.ingredient_name.toLowerCase().includes(keyword)
  );

  res.json({ query: q, results: results.slice(0, 50) });
});

module.exports = router;
