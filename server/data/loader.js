/**
 * JSON 데이터 메모리 로딩 모듈
 * 서버 시작 시 모든 데이터를 메모리에 로딩하여 빠른 조회를 지원합니다.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname);

let products = [];
let ingredients = {};
let ingredientsDic = [];
let absa = {};
let reviews = {};
let skinConcerns = {};

function loadJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function loadAll() {
  console.log("데이터 로딩 시작...");

  products = loadJSON("products.json");
  ingredients = loadJSON("ingredients.json");
  ingredientsDic = loadJSON("ingredients_dic.json");
  absa = loadJSON("absa.json");
  reviews = loadJSON("reviews.json");
  skinConcerns = loadJSON("skin-concerns.json");

  console.log(`  제품: ${products.length}개`);
  console.log(`  성분 매핑: ${Object.keys(ingredients).length}개 제품`);
  console.log(`  성분 사전: ${ingredientsDic.length}개`);
  console.log(`  ABSA: ${Object.keys(absa).length}개 제품`);
  console.log(`  리뷰: ${Object.keys(reviews).length}개 제품`);
  console.log("데이터 로딩 완료!");
}

function getProducts() {
  return products;
}

function getProductByCode(code) {
  return products.find((p) => p.product_code === code) || null;
}

function getIngredients(productCode) {
  return ingredients[productCode] || [];
}

function getIngredientsDic() {
  return ingredientsDic;
}

function getAbsa(productCode) {
  return absa[productCode] || {};
}

function getReviews(productCode) {
  return reviews[productCode] || { positive: [], negative: [] };
}

function getSkinConcerns() {
  return skinConcerns;
}

module.exports = {
  loadAll,
  getProducts,
  getProductByCode,
  getIngredients,
  getIngredientsDic,
  getAbsa,
  getReviews,
  getSkinConcerns,
};
