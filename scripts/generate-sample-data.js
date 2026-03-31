/**
 * 샘플 데이터 생성 스크립트
 *
 * 다이소 뷰티 AI 컨시어지 앱을 위한 현실적인 샘플 데이터를 생성합니다.
 *
 * 출력:
 *   server/data/products.json
 *   server/data/ingredients.json
 *   server/data/ingredients_dic.json
 *   server/data/absa.json
 *   server/data/reviews.json
 *
 * 사용법: node scripts/generate-sample-data.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "server", "data");

// ──────────────────────────────────────────────
// 성분 사전 (ingredients_dic)
// ──────────────────────────────────────────────
const INGREDIENTS_DIC = [
  { ingredient_id: 9, ingredient_name: "글리세린", effect: "Moisturizing", ingredient_type: "Polyol" },
  { ingredient_id: 11, ingredient_name: "녹차추출물", effect: "Antioxidant", ingredient_type: "Plant Extract" },
  { ingredient_id: 15, ingredient_name: "아데노신", effect: "Anti-wrinkle", ingredient_type: "Nucleoside" },
  { ingredient_id: 21, ingredient_name: "알란토인", effect: "Soothing", ingredient_type: "Soothing Agent" },
  { ingredient_id: 98, ingredient_name: "감초추출물", effect: "Soothing", ingredient_type: "Plant Extract" },
  { ingredient_id: 99, ingredient_name: "소듐히알루로네이트", effect: "Moisturizing", ingredient_type: "Humectant" },
  { ingredient_id: 114, ingredient_name: "하이드롤라이즈드콜라겐", effect: "Anti-aging", ingredient_type: "Protein" },
  { ingredient_id: 133, ingredient_name: "티트리잎추출물", effect: "Anti-acne", ingredient_type: "Plant Extract" },
  { ingredient_id: 142, ingredient_name: "콜라겐", effect: "Anti-aging", ingredient_type: "Protein" },
  { ingredient_id: 143, ingredient_name: "병풀추출물", effect: "Soothing", ingredient_type: "Plant Extract" },
  { ingredient_id: 172, ingredient_name: "아스코빅애씨드", effect: "Brightening", ingredient_type: "Vitamin" },
  { ingredient_id: 174, ingredient_name: "어성초추출물", effect: "Anti-inflammatory", ingredient_type: "Plant Extract" },
  { ingredient_id: 248, ingredient_name: "하이드롤라이즈드히알루로닉애씨드", effect: "Moisturizing", ingredient_type: "Humectant" },
  { ingredient_id: 251, ingredient_name: "히알루로닉애씨드", effect: "Moisturizing", ingredient_type: "Humectant" },
  { ingredient_id: 275, ingredient_name: "세라마이드NP", effect: "Barrier Repair", ingredient_type: "Lipid" },
  { ingredient_id: 277, ingredient_name: "나이아신아마이드(아데노신보조)", effect: "Anti-wrinkle", ingredient_type: "Vitamin" },
  { ingredient_id: 341, ingredient_name: "나이아신아마이드", effect: "Brightening", ingredient_type: "Vitamin" },
  { ingredient_id: 357, ingredient_name: "판테놀", effect: "Soothing", ingredient_type: "Vitamin" },
  { ingredient_id: 391, ingredient_name: "글라이콜릭애씨드", effect: "Exfoliating", ingredient_type: "AHA" },
  { ingredient_id: 397, ingredient_name: "살리실릭애씨드", effect: "Exfoliating", ingredient_type: "BHA" },
  { ingredient_id: 454, ingredient_name: "마데카소사이드", effect: "Soothing", ingredient_type: "Plant Extract" },
  { ingredient_id: 518, ingredient_name: "글루코노락톤", effect: "Exfoliating", ingredient_type: "PHA" },
  { ingredient_id: 559, ingredient_name: "아세틸헥사펩타이드-8", effect: "Anti-wrinkle", ingredient_type: "Peptide" },
  { ingredient_id: 649, ingredient_name: "스쿠알란", effect: "Moisturizing", ingredient_type: "Emollient" },
  { ingredient_id: 847, ingredient_name: "세라마이드AS", effect: "Barrier Repair", ingredient_type: "Lipid" },
  { ingredient_id: 848, ingredient_name: "세라마이드AP", effect: "Barrier Repair", ingredient_type: "Lipid" },
  { ingredient_id: 849, ingredient_name: "세라마이드NS", effect: "Barrier Repair", ingredient_type: "Lipid" },
  { ingredient_id: 850, ingredient_name: "세라마이드EOP", effect: "Barrier Repair", ingredient_type: "Lipid" },
  { ingredient_id: 914, ingredient_name: "레티놀", effect: "Anti-wrinkle", ingredient_type: "Vitamin" },
  { ingredient_id: 940, ingredient_name: "알부틴", effect: "Brightening", ingredient_type: "Brightening Agent" },
  { ingredient_id: 955, ingredient_name: "3-O-에틸아스코빅애씨드", effect: "Brightening", ingredient_type: "Vitamin" },
  { ingredient_id: 969, ingredient_name: "세라마이드", effect: "Barrier Repair", ingredient_type: "Lipid" },
  { ingredient_id: 970, ingredient_name: "세라마이드NG", effect: "Barrier Repair", ingredient_type: "Lipid" },
  { ingredient_id: 977, ingredient_name: "락틱애씨드", effect: "Exfoliating", ingredient_type: "AHA" },
  { ingredient_id: 991, ingredient_name: "팔미토일트라이펩타이드-5", effect: "Anti-wrinkle", ingredient_type: "Peptide" },
  { ingredient_id: 1138, ingredient_name: "우레아", effect: "Moisturizing", ingredient_type: "Humectant" },
  { ingredient_id: 1172, ingredient_name: "엘라스틴", effect: "Anti-aging", ingredient_type: "Protein" },
  { ingredient_id: 1279, ingredient_name: "카페인", effect: "Circulation", ingredient_type: "Stimulant" },
  { ingredient_id: 1310, ingredient_name: "글루타치온", effect: "Brightening", ingredient_type: "Antioxidant" },
  { ingredient_id: 1391, ingredient_name: "글루타티온", effect: "Brightening", ingredient_type: "Antioxidant" },
  { ingredient_id: 1544, ingredient_name: "PDRN", effect: "Regeneration", ingredient_type: "Nucleotide" },
  { ingredient_id: 1603, ingredient_name: "알파-알부틴", effect: "Brightening", ingredient_type: "Brightening Agent" },
  { ingredient_id: 1635, ingredient_name: "덱스판테놀", effect: "Soothing", ingredient_type: "Vitamin" },
  // 공통/베이스 성분
  { ingredient_id: 1, ingredient_name: "정제수", effect: "Solvent", ingredient_type: "Solvent" },
  { ingredient_id: 2, ingredient_name: "부틸렌글라이콜", effect: "Moisturizing", ingredient_type: "Polyol" },
  { ingredient_id: 3, ingredient_name: "1,2-헥산다이올", effect: "Preservative", ingredient_type: "Preservative" },
  { ingredient_id: 4, ingredient_name: "다이프로필렌글라이콜", effect: "Moisturizing", ingredient_type: "Polyol" },
  { ingredient_id: 5, ingredient_name: "프로판다이올", effect: "Moisturizing", ingredient_type: "Polyol" },
  { ingredient_id: 6, ingredient_name: "카보머", effect: "Thickener", ingredient_type: "Thickener" },
  { ingredient_id: 7, ingredient_name: "잔탄검", effect: "Thickener", ingredient_type: "Thickener" },
  { ingredient_id: 8, ingredient_name: "토코페롤", effect: "Antioxidant", ingredient_type: "Vitamin" },
  { ingredient_id: 10, ingredient_name: "알로에베라잎추출물", effect: "Soothing", ingredient_type: "Plant Extract" },
  { ingredient_id: 12, ingredient_name: "트라이에탄올아민", effect: "pH Adjuster", ingredient_type: "pH Adjuster" },
  { ingredient_id: 13, ingredient_name: "디메티콘", effect: "Emollient", ingredient_type: "Silicone" },
  { ingredient_id: 14, ingredient_name: "사이클로펜타실록산", effect: "Emollient", ingredient_type: "Silicone" },
  { ingredient_id: 16, ingredient_name: "에틸헥실글리세린", effect: "Preservative", ingredient_type: "Preservative" },
  { ingredient_id: 17, ingredient_name: "소듐벤조에이트", effect: "Preservative", ingredient_type: "Preservative" },
  { ingredient_id: 18, ingredient_name: "포타슘소르베이트", effect: "Preservative", ingredient_type: "Preservative" },
  { ingredient_id: 19, ingredient_name: "페녹시에탄올", effect: "Preservative", ingredient_type: "Preservative" },
  { ingredient_id: 20, ingredient_name: "향료", effect: "Fragrance", ingredient_type: "Fragrance", is_allergic: true },
  { ingredient_id: 22, ingredient_name: "시어버터", effect: "Moisturizing", ingredient_type: "Emollient" },
  { ingredient_id: 23, ingredient_name: "호호바씨오일", effect: "Moisturizing", ingredient_type: "Oil" },
  { ingredient_id: 24, ingredient_name: "올리브오일", effect: "Moisturizing", ingredient_type: "Oil" },
  { ingredient_id: 25, ingredient_name: "코코넛오일", effect: "Moisturizing", ingredient_type: "Oil" },
  { ingredient_id: 26, ingredient_name: "로즈힙열매오일", effect: "Regeneration", ingredient_type: "Oil" },
  { ingredient_id: 27, ingredient_name: "라벤더오일", effect: "Soothing", ingredient_type: "Essential Oil", is_allergic: true },
  { ingredient_id: 28, ingredient_name: "티타늄디옥사이드", effect: "UV Filter", ingredient_type: "Physical UV Filter" },
  { ingredient_id: 29, ingredient_name: "징크옥사이드", effect: "UV Filter", ingredient_type: "Physical UV Filter" },
  { ingredient_id: 30, ingredient_name: "에칠헥실메톡시신나메이트", effect: "UV Filter", ingredient_type: "Chemical UV Filter" },
  { ingredient_id: 31, ingredient_name: "소듐라우릴설페이트", effect: "Cleansing", ingredient_type: "Surfactant", is_allergic: true },
  { ingredient_id: 32, ingredient_name: "코코암포다이아세테이트", effect: "Cleansing", ingredient_type: "Surfactant" },
  { ingredient_id: 33, ingredient_name: "코코일글루타메이트", effect: "Cleansing", ingredient_type: "Surfactant" },
  { ingredient_id: 34, ingredient_name: "소듐코코일이세시오네이트", effect: "Cleansing", ingredient_type: "Surfactant" },
  { ingredient_id: 35, ingredient_name: "비즈왁스", effect: "Emollient", ingredient_type: "Wax" },
  { ingredient_id: 36, ingredient_name: "카나우바왁스", effect: "Film Forming", ingredient_type: "Wax" },
  { ingredient_id: 37, ingredient_name: "아르간오일", effect: "Moisturizing", ingredient_type: "Oil" },
  { ingredient_id: 38, ingredient_name: "카멜리아씨오일", effect: "Moisturizing", ingredient_type: "Oil" },
  { ingredient_id: 39, ingredient_name: "마카다미아씨오일", effect: "Moisturizing", ingredient_type: "Oil" },
  { ingredient_id: 40, ingredient_name: "세테아릴알코올", effect: "Emulsifier", ingredient_type: "Fatty Alcohol" },
  { ingredient_id: 41, ingredient_name: "비사보롤", effect: "Soothing", ingredient_type: "Anti-inflammatory" },
  { ingredient_id: 42, ingredient_name: "아이언옥사이드", effect: "Colorant", ingredient_type: "Colorant" },
  { ingredient_id: 43, ingredient_name: "마이카", effect: "Colorant", ingredient_type: "Colorant" },
  { ingredient_id: 44, ingredient_name: "케라틴", effect: "Hair Repair", ingredient_type: "Protein" },
  { ingredient_id: 45, ingredient_name: "바이오틴", effect: "Hair Strengthening", ingredient_type: "Vitamin" },
  { ingredient_id: 46, ingredient_name: "멘톨", effect: "Cooling", ingredient_type: "Cooling Agent" },
];

// ──────────────────────────────────────────────
// 제품 정의 (~50개)
// ──────────────────────────────────────────────
const PRODUCTS = [
  // ─── 스킨케어 - 스킨/토너 ───
  {
    product_code: "P001",
    name: "VT 리들샷 페이셜 부스팅 퍼스트 앰플",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: true, is_sunscreen: false, is_acne: false,
    review_count: 1842,
    ingredientProfile: "wrinkle_serum",
  },
  {
    product_code: "P002",
    name: "VT 리들샷 100 에센스",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: true, is_sunscreen: false, is_acne: false,
    review_count: 2105,
    ingredientProfile: "wrinkle_serum",
  },
  {
    product_code: "P003",
    name: "VT 리들샷 300 에센스",
    price: 5000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: true, is_sunscreen: false, is_acne: false,
    review_count: 1567,
    ingredientProfile: "wrinkle_serum",
  },
  {
    product_code: "P004",
    name: "손앤박 비타민C 세럼",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "손앤박",
    is_whitening: true, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 987,
    ingredientProfile: "brightening_serum",
  },
  {
    product_code: "P005",
    name: "포렌코즈 히알루론산 토너",
    price: 3000,
    category_1: "스킨케어",
    category_2: "스킨/토너",
    brand_name: "포렌코즈",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 763,
    ingredientProfile: "moisture_toner",
  },
  {
    product_code: "P006",
    name: "네이처리퍼블릭 히알루론산 수분 토너",
    price: 3000,
    category_1: "스킨케어",
    category_2: "스킨/토너",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 621,
    ingredientProfile: "moisture_toner",
  },
  {
    product_code: "P007",
    name: "네이처리퍼블릭 시카 진정 토너",
    price: 3000,
    category_1: "스킨케어",
    category_2: "스킨/토너",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 534,
    ingredientProfile: "soothing_toner",
  },
  {
    product_code: "P008",
    name: "에이블씨엔씨 나이아신아마이드 세럼",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "에이블씨엔씨",
    is_whitening: true, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 412,
    ingredientProfile: "brightening_serum",
  },
  {
    product_code: "P009",
    name: "닥터지 레드 블레미쉬 클리어 수딩 크림",
    price: 5000,
    category_1: "스킨케어",
    category_2: "크림",
    brand_name: "닥터지",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: true,
    review_count: 1234,
    ingredientProfile: "acne_cream",
  },
  {
    product_code: "P010",
    name: "메디힐 티트리 트러블 세럼",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "메디힐",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: true,
    review_count: 876,
    ingredientProfile: "acne_serum",
  },
  {
    product_code: "P011",
    name: "셀퓨전씨 포스트 알파 세럼",
    price: 5000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "셀퓨전씨",
    is_whitening: true, is_wrinkle_reduction: true, is_sunscreen: false, is_acne: false,
    review_count: 654,
    ingredientProfile: "anti_aging_serum",
  },
  {
    product_code: "P012",
    name: "포렌코즈 세라마이드 수분 크림",
    price: 3000,
    category_1: "스킨케어",
    category_2: "크림",
    brand_name: "포렌코즈",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 543,
    ingredientProfile: "moisture_cream",
  },
  {
    product_code: "P013",
    name: "VT 시카 크림",
    price: 3000,
    category_1: "스킨케어",
    category_2: "크림",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1321,
    ingredientProfile: "soothing_cream",
  },
  {
    product_code: "P014",
    name: "네이처리퍼블릭 레티놀 링클케어 세럼",
    price: 5000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: true, is_sunscreen: false, is_acne: false,
    review_count: 432,
    ingredientProfile: "retinol_serum",
  },
  {
    product_code: "P015",
    name: "메디힐 마데카소사이드 진정 앰플",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "메디힐",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 723,
    ingredientProfile: "soothing_serum",
  },
  {
    product_code: "P016",
    name: "아크네스 포어 클리어 세럼",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "아크네스",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: true,
    review_count: 398,
    ingredientProfile: "pore_serum",
  },
  {
    product_code: "P017",
    name: "포렌코즈 AHA BHA PHA 필링 세럼",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "포렌코즈",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 567,
    ingredientProfile: "exfoliation_serum",
  },
  {
    product_code: "P018",
    name: "손앤박 글루타치온 브라이트닝 크림",
    price: 5000,
    category_1: "스킨케어",
    category_2: "크림",
    brand_name: "손앤박",
    is_whitening: true, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 891,
    ingredientProfile: "brightening_cream",
  },
  {
    product_code: "P019",
    name: "VT 리들샷 모이스처 크림",
    price: 3000,
    category_1: "스킨케어",
    category_2: "크림",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1054,
    ingredientProfile: "moisture_cream",
  },
  {
    product_code: "P020",
    name: "네이처리퍼블릭 콜라겐 드림 크림",
    price: 3000,
    category_1: "스킨케어",
    category_2: "크림",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: true, is_sunscreen: false, is_acne: false,
    review_count: 345,
    ingredientProfile: "collagen_cream",
  },

  // ─── 스킨케어 - 마스크팩 ───
  {
    product_code: "P021",
    name: "메디힐 N.M.F 아쿠아 마스크팩",
    price: 1000,
    category_1: "스킨케어",
    category_2: "마스크팩",
    brand_name: "메디힐",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 2341,
    ingredientProfile: "moisture_mask",
  },
  {
    product_code: "P022",
    name: "메디힐 티트리 케어 솔루션 마스크팩",
    price: 1000,
    category_1: "스킨케어",
    category_2: "마스크팩",
    brand_name: "메디힐",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: true,
    review_count: 1987,
    ingredientProfile: "acne_mask",
  },
  {
    product_code: "P023",
    name: "메디힐 콜라겐 임팩트 마스크팩",
    price: 1000,
    category_1: "스킨케어",
    category_2: "마스크팩",
    brand_name: "메디힐",
    is_whitening: false, is_wrinkle_reduction: true, is_sunscreen: false, is_acne: false,
    review_count: 1654,
    ingredientProfile: "collagen_mask",
  },
  {
    product_code: "P024",
    name: "VT 시카 데일리 수딩 마스크",
    price: 1000,
    category_1: "스킨케어",
    category_2: "마스크팩",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1123,
    ingredientProfile: "soothing_mask",
  },

  // ─── 메이크업 - 립 ───
  {
    product_code: "P025",
    name: "손앤박 아티 스프레드 컬러 립밤",
    price: 3000,
    category_1: "메이크업",
    category_2: "립",
    brand_name: "손앤박",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1543,
    ingredientProfile: "lip_balm",
  },
  {
    product_code: "P026",
    name: "클리오 매드매트 스테인 립",
    price: 3000,
    category_1: "메이크업",
    category_2: "립",
    brand_name: "클리오",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1876,
    ingredientProfile: "lip_tint",
  },
  {
    product_code: "P027",
    name: "투쿨포스쿨 글로시 블러 틴트",
    price: 3000,
    category_1: "메이크업",
    category_2: "립",
    brand_name: "투쿨포스쿨",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 2234,
    ingredientProfile: "lip_tint",
  },
  {
    product_code: "P028",
    name: "에뛰드 디어 달링 워터 젤 틴트",
    price: 3000,
    category_1: "메이크업",
    category_2: "립",
    brand_name: "에뛰드",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1654,
    ingredientProfile: "lip_tint",
  },
  {
    product_code: "P029",
    name: "네이처리퍼블릭 바이플라워 무스 틴트",
    price: 2000,
    category_1: "메이크업",
    category_2: "립",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 876,
    ingredientProfile: "lip_tint",
  },

  // ─── 메이크업 - 베이스 ───
  {
    product_code: "P030",
    name: "클리오 킬커버 파운웨어 쿠션",
    price: 5000,
    category_1: "메이크업",
    category_2: "베이스",
    brand_name: "클리오",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: true, is_acne: false,
    review_count: 2567,
    ingredientProfile: "base_cushion",
  },
  {
    product_code: "P031",
    name: "투쿨포스쿨 바이로진 아트클래스 톤업 프라이머",
    price: 3000,
    category_1: "메이크업",
    category_2: "베이스",
    brand_name: "투쿨포스쿨",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 987,
    ingredientProfile: "base_primer",
  },
  {
    product_code: "P032",
    name: "셀퓨전씨 톤업 크림",
    price: 3000,
    category_1: "메이크업",
    category_2: "베이스",
    brand_name: "셀퓨전씨",
    is_whitening: true, is_wrinkle_reduction: false, is_sunscreen: true, is_acne: false,
    review_count: 765,
    ingredientProfile: "base_tone_up",
  },

  // ─── 메이크업 - 아이 ───
  {
    product_code: "P033",
    name: "클리오 프로 아이 팔레트",
    price: 5000,
    category_1: "메이크업",
    category_2: "아이",
    brand_name: "클리오",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 3210,
    ingredientProfile: "eye_palette",
  },
  {
    product_code: "P034",
    name: "에뛰드 플레이 컬러 아이즈 미니",
    price: 3000,
    category_1: "메이크업",
    category_2: "아이",
    brand_name: "에뛰드",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1432,
    ingredientProfile: "eye_palette",
  },
  {
    product_code: "P035",
    name: "투쿨포스쿨 아트클래스 뉴러 드 쉐이딩",
    price: 3000,
    category_1: "메이크업",
    category_2: "아이",
    brand_name: "투쿨포스쿨",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1876,
    ingredientProfile: "eye_shadow",
  },

  // ─── 클렌징 ───
  {
    product_code: "P036",
    name: "포렌코즈 약산성 클렌징 폼",
    price: 2000,
    category_1: "클렌징",
    category_2: "폼클렌징",
    brand_name: "포렌코즈",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 876,
    ingredientProfile: "gentle_cleanser",
  },
  {
    product_code: "P037",
    name: "아크네스 소프트 터치 폼 클렌저",
    price: 2000,
    category_1: "클렌징",
    category_2: "폼클렌징",
    brand_name: "아크네스",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: true,
    review_count: 654,
    ingredientProfile: "acne_cleanser",
  },
  {
    product_code: "P038",
    name: "닥터지 그린딥 클렌징 오일",
    price: 5000,
    category_1: "클렌징",
    category_2: "클렌징오일",
    brand_name: "닥터지",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1543,
    ingredientProfile: "cleansing_oil",
  },
  {
    product_code: "P039",
    name: "네이처리퍼블릭 프레시 허브 클렌징 폼",
    price: 2000,
    category_1: "클렌징",
    category_2: "폼클렌징",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 432,
    ingredientProfile: "gentle_cleanser",
  },

  // ─── 선케어 ───
  {
    product_code: "P040",
    name: "셀퓨전씨 레이저 선스크린 100",
    price: 5000,
    category_1: "선케어",
    category_2: "자외선차단제",
    brand_name: "셀퓨전씨",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: true, is_acne: false,
    review_count: 3456,
    ingredientProfile: "sunscreen",
  },
  {
    product_code: "P041",
    name: "닥터지 그린 마일드 업 선플러스",
    price: 3000,
    category_1: "선케어",
    category_2: "자외선차단제",
    brand_name: "닥터지",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: true, is_acne: false,
    review_count: 2345,
    ingredientProfile: "sunscreen",
  },
  {
    product_code: "P042",
    name: "네이처리퍼블릭 캘리포니아 알로에 선크림",
    price: 3000,
    category_1: "선케어",
    category_2: "자외선차단제",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: true, is_acne: false,
    review_count: 987,
    ingredientProfile: "sunscreen_soothing",
  },

  // ─── 바디케어 ───
  {
    product_code: "P043",
    name: "네이처리퍼블릭 알로에 수딩 바디 로션",
    price: 3000,
    category_1: "바디케어",
    category_2: "바디로션",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 765,
    ingredientProfile: "body_lotion",
  },
  {
    product_code: "P044",
    name: "포렌코즈 시어버터 핸드크림",
    price: 1000,
    category_1: "바디케어",
    category_2: "핸드크림",
    brand_name: "포렌코즈",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1234,
    ingredientProfile: "hand_cream",
  },
  {
    product_code: "P045",
    name: "네이처리퍼블릭 로즈 핸드크림",
    price: 1000,
    category_1: "바디케어",
    category_2: "핸드크림",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 876,
    ingredientProfile: "hand_cream",
  },

  // ─── 헤어케어 ───
  {
    product_code: "P046",
    name: "네이처리퍼블릭 아르간 헤어 에센스",
    price: 3000,
    category_1: "헤어케어",
    category_2: "헤어에센스",
    brand_name: "네이처리퍼블릭",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 654,
    ingredientProfile: "hair_essence",
  },
  {
    product_code: "P047",
    name: "포렌코즈 단백질 트리트먼트",
    price: 3000,
    category_1: "헤어케어",
    category_2: "트리트먼트",
    brand_name: "포렌코즈",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 432,
    ingredientProfile: "hair_treatment",
  },

  // ─── 추가 스킨케어 ───
  {
    product_code: "P048",
    name: "리들샷 스킨 부스터 패드",
    price: 3000,
    category_1: "스킨케어",
    category_2: "스킨/토너",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1432,
    ingredientProfile: "exfoliation_pad",
  },
  {
    product_code: "P049",
    name: "에이블씨엔씨 알부틴 브라이트닝 세럼",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "에이블씨엔씨",
    is_whitening: true, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 321,
    ingredientProfile: "arbutin_serum",
  },
  {
    product_code: "P050",
    name: "닥터지 모공 타이트닝 세럼",
    price: 5000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "닥터지",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 567,
    ingredientProfile: "pore_serum",
  },
  {
    product_code: "P051",
    name: "VT 시카 하이드레이션 에센스",
    price: 3000,
    category_1: "스킨케어",
    category_2: "세럼/앰플",
    brand_name: "VT",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 789,
    ingredientProfile: "soothing_serum",
  },
  {
    product_code: "P052",
    name: "에뛰드 순정 컬러 립스틱",
    price: 2000,
    category_1: "메이크업",
    category_2: "립",
    brand_name: "에뛰드",
    is_whitening: false, is_wrinkle_reduction: false, is_sunscreen: false, is_acne: false,
    review_count: 1098,
    ingredientProfile: "lip_stick",
  },
];

// ──────────────────────────────────────────────
// 성분 프로파일 (ingredient profiles)
// 각 프로파일은 제품에 할당될 성분 ID 목록
// ──────────────────────────────────────────────
const INGREDIENT_PROFILES = {
  wrinkle_serum: [1, 2, 9, 15, 914, 341, 277, 559, 991, 8, 16, 3],
  brightening_serum: [1, 2, 9, 341, 172, 955, 1310, 8, 16, 3, 5],
  moisture_toner: [1, 2, 9, 251, 99, 248, 357, 10, 7, 16, 3],
  soothing_toner: [1, 2, 9, 143, 454, 21, 357, 11, 98, 7, 16, 3],
  acne_cream: [1, 2, 9, 143, 454, 133, 174, 397, 21, 6, 16, 3],
  acne_serum: [1, 2, 9, 133, 174, 397, 341, 21, 16, 3],
  anti_aging_serum: [1, 2, 9, 914, 15, 341, 559, 991, 142, 114, 8, 16, 3],
  moisture_cream: [1, 2, 9, 251, 99, 969, 275, 849, 649, 22, 6, 16, 3],
  soothing_cream: [1, 2, 9, 143, 454, 21, 357, 41, 98, 6, 16, 3],
  retinol_serum: [1, 2, 9, 914, 15, 341, 8, 16, 3, 5],
  soothing_serum: [1, 2, 9, 143, 454, 21, 357, 11, 98, 16, 3],
  pore_serum: [1, 2, 9, 397, 341, 518, 1279, 391, 16, 3],
  exfoliation_serum: [1, 2, 9, 391, 397, 518, 977, 1138, 16, 3],
  brightening_cream: [1, 2, 9, 341, 1310, 1391, 940, 649, 6, 16, 3],
  collagen_cream: [1, 2, 9, 142, 114, 15, 1172, 649, 6, 16, 3],
  moisture_mask: [1, 9, 251, 99, 248, 357, 10, 7],
  acne_mask: [1, 9, 133, 174, 143, 454, 21, 7],
  collagen_mask: [1, 9, 142, 114, 15, 1172, 251, 7],
  soothing_mask: [1, 9, 143, 454, 21, 357, 11, 98, 7],
  lip_balm: [22, 35, 36, 25, 8, 9, 42, 43, 20],
  lip_tint: [1, 9, 13, 42, 43, 8, 20, 6],
  lip_stick: [35, 36, 22, 42, 43, 8, 25, 20],
  base_cushion: [1, 9, 13, 14, 28, 29, 42, 43, 341, 16, 3],
  base_primer: [1, 9, 13, 14, 341, 42, 43, 16, 3],
  base_tone_up: [1, 9, 13, 341, 28, 29, 42, 43, 16, 3, 8],
  eye_palette: [43, 42, 13, 8, 22, 14, 36],
  eye_shadow: [43, 42, 13, 8, 14, 36, 9],
  gentle_cleanser: [1, 9, 33, 34, 32, 10, 21, 16, 3],
  acne_cleanser: [1, 9, 33, 34, 397, 133, 174, 21, 16, 3],
  cleansing_oil: [23, 24, 25, 26, 9, 8, 13, 16],
  sunscreen: [1, 9, 28, 29, 30, 13, 341, 8, 16, 3],
  sunscreen_soothing: [1, 9, 28, 29, 10, 21, 357, 8, 16, 3],
  body_lotion: [1, 9, 10, 22, 649, 357, 21, 6, 16, 3, 20],
  hand_cream: [1, 9, 22, 649, 357, 23, 8, 6, 16, 3, 20],
  hair_essence: [14, 13, 37, 38, 39, 44, 8, 20],
  hair_treatment: [1, 9, 44, 45, 37, 22, 8, 20, 16],
  exfoliation_pad: [1, 2, 9, 391, 977, 518, 341, 21, 16, 3],
  arbutin_serum: [1, 2, 9, 940, 1603, 341, 172, 8, 16, 3],
};

// ──────────────────────────────────────────────
// ABSA aspects
// ──────────────────────────────────────────────
const ASPECTS = [
  "가격/가성비",
  "디자인",
  "배송/포장",
  "사용감/성능",
  "색상/발색",
  "용량/휴대",
  "재구매",
  "재질/냄새",
];

// 카테고리별 ABSA 분포 경향
function getAspectDistribution(category_1, category_2) {
  const base = {
    "가격/가성비": { positive: 75, negative: 10, neutral: 15 },
    "디자인": { positive: 60, negative: 15, neutral: 25 },
    "배송/포장": { positive: 55, negative: 20, neutral: 25 },
    "사용감/성능": { positive: 65, negative: 15, neutral: 20 },
    "색상/발색": { positive: 50, negative: 20, neutral: 30 },
    "용량/휴대": { positive: 60, negative: 15, neutral: 25 },
    "재구매": { positive: 70, negative: 10, neutral: 20 },
    "재질/냄새": { positive: 55, negative: 20, neutral: 25 },
  };

  // 카테고리별 특성 조정
  if (category_1 === "메이크업") {
    base["색상/발색"].positive = 70;
    base["색상/발색"].negative = 15;
    base["색상/발색"].neutral = 15;
  }
  if (category_2 === "마스크팩") {
    base["가격/가성비"].positive = 85;
    base["가격/가성비"].negative = 5;
    base["가격/가성비"].neutral = 10;
  }
  if (category_1 === "선케어") {
    base["사용감/성능"].positive = 70;
    base["사용감/성능"].negative = 12;
    base["사용감/성능"].neutral = 18;
  }

  return base;
}

// ──────────────────────────────────────────────
// 리뷰 텍스트 템플릿
// ──────────────────────────────────────────────
const REVIEW_TEMPLATES = {
  스킨케어: {
    positive: [
      "다이소에서 이 가격에 이런 성분을 쓰는 게 말이 되나 싶을 정도로 가성비 좋아요. 피부결이 확실히 좋아졌습니다.",
      "민감한 피부인데 자극 없이 순하게 사용할 수 있었어요. 보습력도 오래가고 피부가 촉촉해집니다.",
      "쓰면 쓸수록 피부톤이 밝아지는 느낌이에요. 주변에서도 피부 좋아졌다는 말을 듣습니다.",
      "발림성이 좋고 흡수가 빨라서 아침에 쓰기 좋아요. 이 가격에 이 정도면 정말 만족합니다.",
      "건조한 피부에 딱이에요. 밤에 바르고 자면 아침에 피부가 촉촉하게 깨어납니다.",
      "이 가격이 맞나 싶을 정도로 성분이 좋아요. 피부 트러블도 줄었고 전체적으로 피부 상태가 개선되었습니다.",
      "여름에도 끈적임 없이 산뜻하게 쓸 수 있어요. 가볍지만 보습력은 확실합니다.",
      "예민해진 피부에 써봤는데 진정 효과가 좋아요. 붉은기가 많이 가라앉았습니다.",
    ],
    negative: [
      "기대에 비해 보습력이 약한 편이에요. 건조한 피부에는 이것만으로는 부족합니다.",
      "향이 조금 강한 편이라 호불호가 갈릴 것 같아요. 민감한 분들은 참고하세요.",
      "용량이 너무 적어서 금방 다 써요. 가격 대비 용량을 따지면 애매합니다.",
      "제 피부에는 맞지 않았는지 트러블이 올라왔어요. 피부 타입에 따라 다를 수 있습니다.",
    ],
  },
  메이크업: {
    positive: [
      "발색이 정말 예뻐요! 다이소에서 이런 퀄리티의 제품을 살 수 있다니 놀랍습니다.",
      "지속력이 좋아서 하루 종일 수정 없이 유지됩니다. 가격 대비 최고예요.",
      "색상이 예쁘고 발림성이 부드러워요. 입술이 건조하지 않고 촉촉하게 유지됩니다.",
      "순한 성분이라 입술이 안 갈라져요. 데일리로 쓰기 정말 좋습니다.",
      "가격이 이래도 되나 싶을 만큼 고급스러운 발색이에요. 강추합니다.",
      "색감이 자연스러워서 데일리로 매일 쓰고 있어요. 여러 개 사뒀습니다.",
    ],
    negative: [
      "발색이 생각보다 약해서 여러 번 덧발라야 합니다.",
      "지속력이 아쉬워요. 식사 후에는 거의 다 지워집니다.",
      "색상이 사진과 실제가 많이 달라요. 온라인 구매 시 참고하세요.",
    ],
  },
  클렌징: {
    positive: [
      "거품이 부드럽고 세정력이 적당해요. 씻고 나서도 당기지 않습니다.",
      "약산성이라 민감한 피부에도 자극 없이 잘 맞아요. 매일 사용하고 있습니다.",
      "클렌징 후에도 촉촉하고 깨끗하게 씻겨요. 이 가격에 이 정도면 정말 좋습니다.",
      "메이크업이 깔끔하게 지워져요. 이중 세안 필요 없을 정도입니다.",
    ],
    negative: [
      "세정력이 좀 약한 편이에요. 진한 메이크업은 잘 안 지워집니다.",
      "향이 인위적인 느낌이 있어요. 무향 제품이었으면 좋겠습니다.",
    ],
  },
  선케어: {
    positive: [
      "백탁 현상 없이 자연스럽게 발려요. 가볍고 끈적이지 않아서 매일 쓰기 좋습니다.",
      "다이소 선크림이 이렇게 좋을 줄 몰랐어요. 뜬 느낌 없이 촉촉하게 발립니다.",
      "무기자차라 민감한 피부에도 자극이 없어요. 데일리 선크림으로 최고입니다.",
      "가격 대비 성능이 정말 좋아요. 자외선 차단도 확실하고 사용감도 가벼웁니다.",
    ],
    negative: [
      "좀 끈적이는 느낌이 있어요. 지성 피부에는 무거울 수 있습니다.",
      "시간이 지나면 밀림 현상이 있어요. 메이크업 위에 덧바르기 어렵습니다.",
    ],
  },
  바디케어: {
    positive: [
      "바르자마자 촉촉해지고 향도 은은해서 좋아요. 온 가족이 함께 쓰고 있습니다.",
      "가격이 저렴한데 보습력이 정말 뛰어나요. 겨울에도 충분합니다.",
      "향이 좋고 손에 빨리 흡수돼요. 여러 개 사서 곳곳에 놓고 씁니다.",
    ],
    negative: [
      "보습력이 오래가지 않아요. 건조한 날에는 자주 덧발라야 합니다.",
      "향이 좀 강한 편이에요. 은은한 향을 좋아하시면 참고하세요.",
    ],
  },
  헤어케어: {
    positive: [
      "머릿결이 확실히 부드러워졌어요. 가격 대비 효과가 좋습니다.",
      "두피에 자극 없이 순하게 사용할 수 있어요. 향도 좋고 머리가 윤기 납니다.",
    ],
    negative: [
      "효과가 미미한 편이에요. 손상이 심한 모발에는 부족합니다.",
    ],
  },
};

// ──────────────────────────────────────────────
// 유틸리티 함수
// ──────────────────────────────────────────────

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const random = seededRandom(42);

function randInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) {
  return arr[Math.floor(random() * arr.length)];
}

// ──────────────────────────────────────────────
// skin_concerns 매핑 (skin-concerns.json 로직 재현)
// ──────────────────────────────────────────────
const SKIN_CONCERNS_MAP = {
  wrinkle: {
    key_ingredient_ids: [914, 15, 277, 341, 559, 560, 991, 1544, 142, 114, 1172],
    functional_flag: "is_wrinkle_reduction",
  },
  moisture: {
    key_ingredient_ids: [251, 99, 248, 9, 969, 275, 848, 849, 850, 847, 970, 649, 357, 1635, 1138],
  },
  acne: {
    key_ingredient_ids: [397, 133, 174, 143, 454],
    functional_flag: "is_acne",
  },
  brightening: {
    key_ingredient_ids: [341, 172, 955, 940, 1603, 1310, 1391],
    functional_flag: "is_whitening",
  },
  pore: {
    key_ingredient_ids: [397, 341, 518, 1279, 391],
  },
  soothing: {
    key_ingredient_ids: [143, 454, 21, 357, 11, 98],
  },
  suncare: {
    functional_flag: "is_sunscreen",
    category_filter: "자외선차단제",
    key_ingredient_ids: [],
  },
  exfoliation: {
    key_ingredient_ids: [391, 977, 397, 518, 1138],
  },
};

function computeSkinConcerns(product, ingredientIds) {
  const concerns = [];
  const idSet = new Set(ingredientIds);

  for (const [key, concern] of Object.entries(SKIN_CONCERNS_MAP)) {
    if (concern.functional_flag && product[concern.functional_flag]) {
      concerns.push(key);
      continue;
    }
    if (concern.category_filter && product.category_2 === concern.category_filter) {
      concerns.push(key);
      continue;
    }
    const matchCount = (concern.key_ingredient_ids || []).filter((id) =>
      idSet.has(id)
    ).length;
    if (matchCount >= 2) {
      concerns.push(key);
    }
  }

  return concerns;
}

// ──────────────────────────────────────────────
// 데이터 생성 메인 로직
// ──────────────────────────────────────────────

function generate() {
  console.log("=== 샘플 데이터 생성 시작 ===\n");

  // 1. ingredients_dic.json
  const ingredientsDic = INGREDIENTS_DIC.map((ing) => ({
    ingredient_id: ing.ingredient_id,
    ingredient_name: ing.ingredient_name,
    effect: ing.effect,
    ingredient_type: ing.ingredient_type,
    is_allergic: ing.is_allergic || false,
  }));

  // 2. ingredients.json (제품별 성분 그룹핑)
  const ingredientsByProduct = {};
  for (const product of PRODUCTS) {
    const profileKey = product.ingredientProfile;
    const ingredientIds = INGREDIENT_PROFILES[profileKey] || [];
    ingredientsByProduct[product.product_code] = ingredientIds.map((id, idx) => {
      const dicEntry = INGREDIENTS_DIC.find((d) => d.ingredient_id === id);
      return {
        ingredient_id: id,
        ingredient_name: dicEntry ? dicEntry.ingredient_name : `성분_${id}`,
        ingredient_type: dicEntry ? dicEntry.ingredient_type : "Unknown",
        is_allergic: dicEntry ? (dicEntry.is_allergic || false) : false,
        effect: dicEntry ? dicEntry.effect : null,
      };
    });
  }

  // 3. products.json (skin_concerns 태그 계산 포함)
  const products = PRODUCTS.map((p) => {
    const ingredientIds = (INGREDIENT_PROFILES[p.ingredientProfile] || []);
    const skinConcerns = computeSkinConcerns(p, ingredientIds);

    const likes = randInt(50, Math.floor(p.review_count * 0.8));
    const engagementScore = parseFloat((likes / Math.max(p.review_count, 1) * 5).toFixed(2));
    const cpIndex = parseFloat((p.review_count / p.price * 100).toFixed(2));

    return {
      product_code: p.product_code,
      name: p.name,
      price: p.price,
      category_1: p.category_1,
      category_2: p.category_2,
      brand_name: p.brand_name,
      image_url: null,
      is_whitening: p.is_whitening,
      is_wrinkle_reduction: p.is_wrinkle_reduction,
      is_sunscreen: p.is_sunscreen,
      is_acne: p.is_acne,
      review_count: p.review_count,
      likes: likes,
      engagement_score: engagementScore,
      cp_index: cpIndex,
      skin_concerns: skinConcerns,
    };
  });

  // 4. absa.json (제품별 aspect 감성분석)
  const absa = {};
  for (const p of PRODUCTS) {
    const distribution = getAspectDistribution(p.category_1, p.category_2);
    absa[p.product_code] = {};

    for (const aspect of ASPECTS) {
      const dist = distribution[aspect];
      // 약간의 랜덤 변동 추가
      let pos = dist.positive + randInt(-8, 8);
      let neg = dist.negative + randInt(-5, 5);
      pos = Math.max(10, Math.min(95, pos));
      neg = Math.max(2, Math.min(40, neg));
      const neu = 100 - pos - neg;

      // 리뷰 수 기반 total 계산
      const totalForAspect = Math.max(5, Math.floor(p.review_count * (0.1 + random() * 0.3)));
      const posCount = Math.round(totalForAspect * pos / 100);
      const negCount = Math.round(totalForAspect * neg / 100);
      const neuCount = totalForAspect - posCount - negCount;

      const actualTotal = posCount + negCount + neuCount;
      const posRate = Math.round(posCount / actualTotal * 100);
      const negRate = Math.round(negCount / actualTotal * 100);
      const neuRate = 100 - posRate - negRate;

      absa[p.product_code][aspect] = {
        positive: posCount,
        negative: negCount,
        neutral: neuCount,
        total: actualTotal,
        positive_rate: posRate,
        negative_rate: negRate,
        neutral_rate: neuRate,
      };
    }
  }

  // 5. reviews.json (제품별 대표 리뷰)
  const reviews = {};
  for (const p of PRODUCTS) {
    const cat = p.category_1;
    const templates = REVIEW_TEMPLATES[cat] || REVIEW_TEMPLATES["스킨케어"];

    const positiveReviews = shuffle(templates.positive).slice(0, randInt(2, 4)).map((text) => ({
      text: text,
      rating: pick([4, 5, 5, 5]),
    }));

    const negativeReviews = shuffle(templates.negative).slice(0, randInt(1, 2)).map((text) => ({
      text: text,
      rating: pick([1, 2, 2, 3]),
    }));

    reviews[p.product_code] = {
      positive: positiveReviews,
      negative: negativeReviews,
    };
  }

  // ──────────────────────────────────────────────
  // 파일 쓰기
  // ──────────────────────────────────────────────

  // data 디렉토리 확인
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  function writeData(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    const count = Array.isArray(data)
      ? `${data.length}개`
      : `${Object.keys(data).length}개 키`;
    console.log(`  [OK] ${filename} (${count})`);
  }

  writeData("products.json", products);
  writeData("ingredients.json", ingredientsByProduct);
  writeData("ingredients_dic.json", ingredientsDic);
  writeData("absa.json", absa);
  writeData("reviews.json", reviews);

  console.log(`\n=== 총 ${products.length}개 제품의 샘플 데이터 생성 완료! ===`);

  // 요약 출력
  const categories = {};
  for (const p of products) {
    const key = `${p.category_1} > ${p.category_2}`;
    categories[key] = (categories[key] || 0) + 1;
  }
  console.log("\n[카테고리별 제품 수]");
  for (const [cat, count] of Object.entries(categories).sort()) {
    console.log(`  ${cat}: ${count}개`);
  }

  const brands = {};
  for (const p of products) {
    brands[p.brand_name] = (brands[p.brand_name] || 0) + 1;
  }
  console.log("\n[브랜드별 제품 수]");
  for (const [brand, count] of Object.entries(brands).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${brand}: ${count}개`);
  }

  const concernCounts = {};
  for (const p of products) {
    for (const c of p.skin_concerns) {
      concernCounts[c] = (concernCounts[c] || 0) + 1;
    }
  }
  console.log("\n[피부 고민 태그 분포]");
  for (const [concern, count] of Object.entries(concernCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${concern}: ${count}개 제품`);
  }
}

generate();
