import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
  timeout: 15000,
});

// 제품 목록
export async function fetchProducts(params = {}) {
  const { data } = await api.get("/products", { params });
  return data;
}

// 제품 상세
export async function fetchProductDetail(code) {
  const { data } = await api.get(`/products/${code}`);
  return data;
}

// ABSA 요약
export async function fetchProductAbsa(code) {
  const { data } = await api.get(`/products/${code}/absa`);
  return data;
}

// 대표 리뷰
export async function fetchProductReviews(code) {
  const { data } = await api.get(`/products/${code}/reviews`);
  return data;
}

// 피부 고민 목록
export async function fetchSkinConcerns() {
  const { data } = await api.get("/skin-concerns");
  return data;
}

// 성분 검색
export async function searchIngredients(query) {
  const { data } = await api.get("/ingredients/search", { params: { q: query } });
  return data;
}

// AI 대화
export async function sendChatMessage(messages) {
  const { data } = await api.post("/chat", { messages });
  return data;
}
