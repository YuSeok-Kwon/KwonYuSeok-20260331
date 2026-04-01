import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fetchSkinConcerns } from "../api";

const CATEGORIES = [
  { value: "", label: "전체" },
  { value: "스킨케어", label: "스킨케어" },
  { value: "메이크업", label: "메이크업" },
  { value: "클렌징", label: "클렌징" },
  { value: "선케어", label: "선케어" },
  { value: "바디케어", label: "바디케어" },
  { value: "헤어케어", label: "헤어케어" },
];

const SORT_OPTIONS = [
  { value: "review_count", label: "리뷰 많은순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
  { value: "engagement", label: "인기순" },
];

export default function FilterBar() {
  const { state, dispatch } = useApp();
  const { filters, skinConcerns } = state;

  useEffect(() => {
    if (!skinConcerns) {
      fetchSkinConcerns()
        .then((data) => dispatch({ type: "SET_SKIN_CONCERNS", payload: data }))
        .catch(() => {});
    }
  }, [skinConcerns, dispatch]);

  const handleCategory = (value) => {
    dispatch({
      type: "SET_FILTERS",
      payload: { category_1: value, category_2: "" },
    });
  };

  const handleConcern = (key) => {
    const current = filters.skin_concern;
    const next = current === key ? "" : key;
    dispatch({ type: "SET_FILTERS", payload: { skin_concern: next } });
  };

  const handleKeyword = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: "SET_FILTERS", payload: { keyword: e.target.value } });
    }
  };

  const handleSort = (e) => {
    dispatch({ type: "SET_FILTERS", payload: { sort: e.target.value } });
  };

  const concerns = skinConcerns?.concerns || {};

  return (
    <div className="filter-bar">
      {/* 카테고리 탭 */}
      <div className="filter-section">
        <label className="filter-label">카테고리</label>
        <div className="filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`filter-tab ${
                filters.category_1 === cat.value ? "active" : ""
              }`}
              onClick={() => handleCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 피부 고민 태그 */}
      <div className="filter-section">
        <label className="filter-label">피부 고민</label>
        <div className="filter-tags">
          {Object.entries(concerns).map(([key, concern]) => (
            <button
              key={key}
              className={`filter-tag ${
                filters.skin_concern === key ? "active" : ""
              }`}
              onClick={() => handleConcern(key)}
            >
              {concern.icon} {concern.label}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 + 정렬 */}
      <div className="filter-section filter-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="제품명 또는 브랜드 검색..."
            defaultValue={filters.keyword}
            onKeyDown={handleKeyword}
          />
        </div>
        <select className="sort-select" value={filters.sort} onChange={handleSort}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
