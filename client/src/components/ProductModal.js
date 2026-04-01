import React, { useState, useEffect } from "react";
import { fetchProductDetail, fetchProductAbsa, fetchProductReviews } from "../api";
import IngredientSection from "./IngredientSection";
import ReviewSummary from "./ReviewSummary";

const TABS = [
  { key: "ingredients", label: "성분 분석" },
  { key: "reviews", label: "리뷰 분석" },
];

const CONCERN_LABELS = {
  wrinkle: "주름/노화",
  moisture: "보습/건조",
  acne: "트러블",
  brightening: "미백/톤업",
  pore: "모공",
  soothing: "진정/민감",
  suncare: "선케어",
  exfoliation: "각질/피부결",
};

export default function ProductModal({ product, onClose }) {
  const [tab, setTab] = useState("ingredients");
  const [detail, setDetail] = useState(null);
  const [absa, setAbsa] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) return;

    setLoading(true);
    const code = product.product_code;

    Promise.all([
      fetchProductDetail(code),
      fetchProductAbsa(code),
      fetchProductReviews(code),
    ])
      .then(([detailData, absaData, reviewData]) => {
        setDetail(detailData);
        setAbsa(absaData.aspects);
        setReviews(reviewData.reviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [product]);

  if (!product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* 헤더 */}
        <div className="modal-header">
          <div className="modal-product-image">
            <div className="card-image-placeholder large">
              <span>{product.category_2 || "뷰티"}</span>
            </div>
          </div>
          <div className="modal-product-info">
            <p className="modal-brand">{product.brand_name}</p>
            <h2 className="modal-name">{product.name}</h2>
            <p className="modal-price">{product.price.toLocaleString()}원</p>
            <div className="modal-tags">
              {product.skin_concerns.map((c) => (
                <span key={c} className={`card-tag tag-${c}`}>
                  {CONCERN_LABELS[c] || c}
                </span>
              ))}
            </div>
            <div className="modal-badges">
              {product.is_whitening && <span className="badge">미백</span>}
              {product.is_wrinkle_reduction && <span className="badge">주름개선</span>}
              {product.is_sunscreen && <span className="badge">자외선차단</span>}
              {product.is_acne && <span className="badge">여드름</span>}
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="modal-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`modal-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 내용 */}
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="spinner" />
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : tab === "ingredients" ? (
            <IngredientSection ingredients={detail?.ingredients || []} />
          ) : (
            <ReviewSummary absa={absa} reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  );
}
