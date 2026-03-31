/**
 * 원시 데이터 → 가공 JSON 변환 스크립트
 *
 * 입력: server/data/raw/*.json (BQ export 결과)
 * 출력: server/data/products.json, ingredients.json, absa.json, reviews.json
 *
 * 사용법: node scripts/transform-data.js
 */

const fs = require("fs");
const path = require("path");

const RAW_DIR = path.join(__dirname, "..", "server", "data", "raw");
const DATA_DIR = path.join(__dirname, "..", "server", "data");

function readRaw(filename) {
  const filePath = path.join(RAW_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✓ ${filename} (${Array.isArray(data) ? data.length + "개" : "객체"})`);
}

// 피부 고민-성분 매핑 로딩
const skinConcerns = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "skin-concerns.json"), "utf-8")
);

// ──────────────────────────────────────────────
// 1) 제품 마스터 + skin_concerns 태그
// ──────────────────────────────────────────────
function transformProducts() {
  const raw = readRaw("products_raw.json");
  const ingredientsRaw = readRaw("ingredients_raw.json");

  // 제품별 성분 ID 집합 구축
  const productIngredientIds = {};
  for (const row of ingredientsRaw) {
    if (!productIngredientIds[row.product_code]) {
      productIngredientIds[row.product_code] = new Set();
    }
    productIngredientIds[row.product_code].add(row.ingredient_id);
  }

  const products = raw.map((p) => {
    // skin_concerns 태깅
    const concerns = [];
    const ingredientIds = productIngredientIds[p.product_code] || new Set();

    for (const [key, concern] of Object.entries(skinConcerns.concerns)) {
      // 기능성 플래그 체크
      if (concern.functional_flag && p[concern.functional_flag]) {
        concerns.push(key);
        continue;
      }
      // 카테고리 필터 체크
      if (concern.category_filter && p.category_2 === concern.category_filter) {
        concerns.push(key);
        continue;
      }
      // 핵심 성분 포함 여부 (2개 이상 포함 시 태그)
      const matchCount = concern.key_ingredient_ids.filter((id) =>
        ingredientIds.has(id)
      ).length;
      if (matchCount >= 2) {
        concerns.push(key);
      }
    }

    return {
      product_code: p.product_code,
      name: p.name,
      price: p.price,
      category_1: p.category_1,
      category_2: p.category_2,
      brand_name: p.brand_name,
      is_whitening: p.is_whitening || false,
      is_wrinkle_reduction: p.is_wrinkle_reduction || false,
      is_sunscreen: p.is_sunscreen || false,
      is_acne: p.is_acne || false,
      review_count: p.review_count || 0,
      likes: p.likes || 0,
      engagement_score: p.engagement_score || 0,
      cp_index: p.cp_index || 0,
      skin_concerns: concerns,
    };
  });

  writeData("products.json", products);
  return products;
}

// ──────────────────────────────────────────────
// 2) 성분 데이터 (제품별 그룹핑)
// ──────────────────────────────────────────────
function transformIngredients() {
  const raw = readRaw("ingredients_raw.json");
  const dic = readRaw("ingredients_dic.json");

  // 제품별 성분 그룹핑
  const byProduct = {};
  for (const row of raw) {
    if (!byProduct[row.product_code]) {
      byProduct[row.product_code] = [];
    }
    byProduct[row.product_code].push({
      ingredient_id: row.ingredient_id,
      ingredient_name: row.ingredient_name,
      ingredient_type: row.ingredient_type,
      is_allergic: row.is_allergic || false,
      effect: row.effect || null,
    });
  }

  writeData("ingredients.json", byProduct);
  writeData("ingredients_dic.json", dic);
}

// ──────────────────────────────────────────────
// 3) ABSA 데이터 (제품별 aspect 피벗)
// ──────────────────────────────────────────────
function transformAbsa() {
  const raw = readRaw("absa_raw.json");

  const byProduct = {};
  for (const row of raw) {
    if (!byProduct[row.product_code]) {
      byProduct[row.product_code] = {};
    }
    if (!byProduct[row.product_code][row.aspect]) {
      byProduct[row.product_code][row.aspect] = {
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0,
      };
    }
    const aspect = byProduct[row.product_code][row.aspect];
    const sentiment = row.aspect_sentiment.toLowerCase();
    if (aspect[sentiment] !== undefined) {
      aspect[sentiment] += row.cnt;
    }
    aspect.total += row.cnt;
  }

  // 비율 계산
  for (const product of Object.values(byProduct)) {
    for (const aspect of Object.values(product)) {
      if (aspect.total > 0) {
        aspect.positive_rate = Math.round((aspect.positive / aspect.total) * 100);
        aspect.negative_rate = Math.round((aspect.negative / aspect.total) * 100);
        aspect.neutral_rate = 100 - aspect.positive_rate - aspect.negative_rate;
      }
    }
  }

  writeData("absa.json", byProduct);
}

// ──────────────────────────────────────────────
// 4) 대표 리뷰 (제품별 긍정/부정 분류)
// ──────────────────────────────────────────────
function transformReviews() {
  const raw = readRaw("reviews_raw.json");

  const byProduct = {};
  for (const row of raw) {
    if (!byProduct[row.product_code]) {
      byProduct[row.product_code] = { positive: [], negative: [] };
    }
    byProduct[row.product_code][row.sentiment].push({
      text: row.text,
      rating: row.rating,
    });
  }

  writeData("reviews.json", byProduct);
}

// ──────────────────────────────────────────────
// 실행
// ──────────────────────────────────────────────
console.log("=== 데이터 변환 시작 ===\n");

try {
  transformProducts();
  transformIngredients();
  transformAbsa();
  transformReviews();
  console.log("\n=== 모든 변환 완료! ===");
} catch (err) {
  console.error("변환 오류:", err.message);
  process.exit(1);
}
