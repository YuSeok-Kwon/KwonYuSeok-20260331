import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = { positive: "#4CAF50", negative: "#F44336", neutral: "#9E9E9E" };

export default function ReviewSummary({ absa, reviews }) {
  // ABSA 차트 데이터
  const chartData = absa
    ? Object.entries(absa).map(([aspect, data]) => ({
        aspect,
        긍정: data.positive_rate || 0,
        부정: data.negative_rate || 0,
        중립: data.neutral_rate || 0,
      }))
    : [];

  return (
    <div className="review-summary">
      {/* ABSA 바 차트 */}
      {chartData.length > 0 && (
        <div className="absa-chart">
          <h4>📊 리뷰 감성 분석 (ABSA)</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="aspect" width={75} fontSize={12} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="긍정" stackId="a" fill={COLORS.positive} />
              <Bar dataKey="부정" stackId="a" fill={COLORS.negative} />
              <Bar dataKey="중립" stackId="a" fill={COLORS.neutral} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 대표 리뷰 */}
      {reviews && (
        <div className="representative-reviews">
          {reviews.positive?.length > 0 && (
            <div className="review-group">
              <h4>👍 긍정 리뷰</h4>
              {reviews.positive.map((r, i) => (
                <div key={i} className="review-item positive">
                  <span className="review-rating">★ {r.rating}</span>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          )}
          {reviews.negative?.length > 0 && (
            <div className="review-group">
              <h4>👎 부정 리뷰</h4>
              {reviews.negative.map((r, i) => (
                <div key={i} className="review-item negative">
                  <span className="review-rating">★ {r.rating}</span>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {chartData.length === 0 && !reviews && (
        <p className="no-data">리뷰 데이터가 없습니다.</p>
      )}
    </div>
  );
}
