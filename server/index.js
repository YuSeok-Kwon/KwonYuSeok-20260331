const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const dataLoader = require("./data/loader");
const productsRouter = require("./routes/products");
const ingredientsRouter = require("./routes/ingredients");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(express.json());

// 데이터 로딩
dataLoader.loadAll();

// 라우트
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/products", productsRouter);
app.use("/api", ingredientsRouter);
app.use("/api/chat", chatRouter);

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error("서버 오류:", err);
  res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
