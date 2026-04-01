import React from "react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="header-title">
          <span className="header-logo">🧴</span>
          다이소 뷰티 AI 컨시어지
        </h1>
        <p className="header-subtitle">
          AI가 분석한 성분과 리뷰로 나에게 딱 맞는 다이소 뷰티템을 찾아보세요
        </p>
      </div>
    </header>
  );
}
