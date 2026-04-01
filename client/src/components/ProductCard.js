import React from "react";

const CONCERN_LABELS = {
  wrinkle: "주름",
  moisture: "보습",
  acne: "트러블",
  brightening: "미백",
  pore: "모공",
  soothing: "진정",
  suncare: "선케어",
  exfoliation: "각질",
};

export default function ProductCard({ product, onClick }) {
  const { name, price, brand_name, category_2, skin_concerns, review_count } =
    product;

  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="card-body">
        <div className="card-top-row">
          <span className="card-category">{category_2 || "뷰티"}</span>
          <span className="card-reviews">리뷰 {review_count.toLocaleString()}개</span>
        </div>
        <p className="card-brand">{brand_name}</p>
        <h3 className="card-name">{name}</h3>
        <p className="card-price">{price.toLocaleString()}원</p>
        <div className="card-tags">
          {skin_concerns.slice(0, 3).map((c) => (
            <span key={c} className={`card-tag tag-${c}`}>
              {CONCERN_LABELS[c] || c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
