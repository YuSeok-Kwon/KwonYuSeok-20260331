import React from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "./ProductCard";

export default function ProductGrid({ onProductClick }) {
  const { state, dispatch } = useApp();
  const { products, pagination, loading } = state;

  if (loading) {
    return (
      <div className="product-grid-loading">
        <div className="spinner" />
        <p>제품을 불러오는 중...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>😅 조건에 맞는 제품이 없습니다.</p>
        <p>필터를 변경해보세요!</p>
      </div>
    );
  }

  const { page, totalPages, total } = pagination;

  return (
    <div className="product-grid-wrapper">
      <p className="product-count">총 {total.toLocaleString()}개 제품</p>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard
            key={p.product_code}
            product={p}
            onClick={onProductClick}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => dispatch({ type: "SET_PAGE", payload: page - 1 })}
          >
            이전
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => dispatch({ type: "SET_PAGE", payload: page + 1 })}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
