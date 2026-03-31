/**
 * BigQuery → JSON 추출 스크립트
 *
 * 사전 조건:
 *   1. Google Cloud SDK 인증 완료 (gcloud auth application-default login)
 *   2. npm install @google-cloud/bigquery
 *
 * 사용법:
 *   node scripts/export-bq.js
 *
 * 출력:
 *   server/data/raw/products_raw.json
 *   server/data/raw/ingredients_raw.json
 *   server/data/raw/ingredients_dic.json
 *   server/data/raw/absa_raw.json
 *   server/data/raw/reviews_raw.json
 */

const { BigQuery } = require("@google-cloud/bigquery");
const fs = require("fs");
const path = require("path");

const bigquery = new BigQuery({ projectId: "daiso-analysis" });
const RAW_DIR = path.join(__dirname, "..", "server", "data", "raw");

if (!fs.existsSync(RAW_DIR)) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

async function runQuery(name, sql) {
  console.log(`[${name}] 쿼리 실행 중...`);
  const [rows] = await bigquery.query({ query: sql, location: "US" });
  const outPath = path.join(RAW_DIR, `${name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), "utf-8");
  console.log(`[${name}] ${rows.length}행 → ${outPath}`);
  return rows;
}

async function main() {
  // 1) 제품 마스터
  await runQuery(
    "products_raw",
    `
    SELECT
      pc.product_code,
      pc.name,
      pc.price,
      pcat.category_1,
      pcat.category_2,
      b.name AS brand_name,
      f.is_whitening,
      f.is_wrinkle_reduction,
      f.is_sunscreen,
      f.is_acne,
      ps.review_count,
      ps.likes,
      ps.engagement_score,
      ps.cp_index
    FROM \`daiso-analysis.daiso.products_core\` pc
    LEFT JOIN \`daiso-analysis.daiso.products_category\` pcat USING (product_code)
    LEFT JOIN \`daiso-analysis.daiso.brands\` b ON pc.brand_id = b.brand_id
    LEFT JOIN \`daiso-analysis.daiso.functional\` f USING (product_code)
    LEFT JOIN \`daiso-analysis.daiso.products_stats\` ps USING (product_code)
  `
  );

  // 2) 성분 데이터 (제품별 성분)
  await runQuery(
    "ingredients_raw",
    `
    SELECT
      pi.product_code,
      pi.ingredient_id,
      d.ingredient_name,
      d.ingredient_type,
      d.is_allergic,
      d.effect
    FROM \`daiso-analysis.daiso.products_ingredients\` pi
    JOIN \`daiso-analysis.daiso.ingredients_dic\` d USING (ingredient_id)
    ORDER BY pi.product_code, pi.ingredient_id
  `
  );

  // 3) 성분 사전
  await runQuery(
    "ingredients_dic",
    `
    SELECT ingredient_id, ingredient_name, ingredient_type, is_allergic, effect
    FROM \`daiso-analysis.daiso.ingredients_dic\`
    ORDER BY ingredient_id
  `
  );

  // 4) ABSA 리뷰 집계
  await runQuery(
    "absa_raw",
    `
    SELECT
      rc.product_code,
      ra.aspect,
      ra.aspect_sentiment,
      COUNT(*) AS cnt
    FROM \`daiso-analysis.daiso.review_aspects\` ra
    JOIN \`daiso-analysis.daiso.reviews_core\` rc USING (review_id)
    WHERE ra.aspect != '미분류'
    GROUP BY rc.product_code, ra.aspect, ra.aspect_sentiment
    ORDER BY rc.product_code, ra.aspect
  `
  );

  // 5) 대표 리뷰 텍스트 (긍정/부정 각 3개)
  await runQuery(
    "reviews_raw",
    `
    WITH ranked AS (
      SELECT
        rc.product_code,
        rc.rating,
        rt.text,
        CASE WHEN rc.rating >= 4 THEN 'positive' ELSE 'negative' END AS sentiment,
        ROW_NUMBER() OVER (
          PARTITION BY rc.product_code,
            CASE WHEN rc.rating >= 4 THEN 'positive' ELSE 'negative' END
          ORDER BY LENGTH(rt.text) DESC
        ) AS rn
      FROM \`daiso-analysis.daiso.reviews_core\` rc
      JOIN \`daiso-analysis.daiso.reviews_text\` rt USING (review_id)
      WHERE rc.rating != 3
    )
    SELECT product_code, rating, text, sentiment
    FROM ranked
    WHERE rn <= 3
    ORDER BY product_code, sentiment
  `
  );

  console.log("\n모든 데이터 추출 완료!");
}

main().catch((err) => {
  console.error("오류 발생:", err);
  process.exit(1);
});
