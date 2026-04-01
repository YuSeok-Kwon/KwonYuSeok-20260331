import React from "react";

export default function IngredientSection({ ingredients }) {
  if (!ingredients || ingredients.length === 0) {
    return <p className="no-data">성분 정보가 없습니다.</p>;
  }

  const keyIngredients = ingredients.filter((i) => i.is_key_ingredient);
  const otherIngredients = ingredients.filter((i) => !i.is_key_ingredient);

  return (
    <div className="ingredient-section">
      {keyIngredients.length > 0 && (
        <div className="key-ingredients">
          <h4>✨ 주요 성분</h4>
          <div className="ingredient-chips">
            {keyIngredients.map((ing) => (
              <span
                key={ing.ingredient_id}
                className={`ingredient-chip key ${
                  ing.is_allergic ? "allergic" : ""
                }`}
                title={ing.effect || ing.ingredient_type}
              >
                {ing.ingredient_name}
                {ing.effect && (
                  <span className="ingredient-effect">{ing.effect}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="all-ingredients">
        <h4>전성분 ({ingredients.length}종)</h4>
        <div className="ingredient-list">
          {[...keyIngredients, ...otherIngredients].map((ing, idx) => (
            <span
              key={ing.ingredient_id}
              className={`ingredient-item ${
                ing.is_key_ingredient ? "highlight" : ""
              } ${ing.is_allergic ? "allergic" : ""}`}
            >
              {ing.ingredient_name}
              {idx < ingredients.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>

      {ingredients.some((i) => i.is_allergic) && (
        <p className="allergic-warning">
          ⚠️ 주의: 알레르기 유발 가능 성분이 포함되어 있습니다.
        </p>
      )}
    </div>
  );
}
