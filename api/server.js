const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const userRouter = require("./routers/user");
const devicesRouter = require("./routers/devices");

// .env ファイルを読み込む
require("dotenv").config();

// CORS の設定（デプロイ環境対応）
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// JSON形式のリクエストボディを解析
app.use(express.json());

// ✅ `/api` のトップルート
app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

// 認証ルート
app.use("/api/auth", authRoutes);

// 投稿ルート
app.use("/api/posts", postRoutes);

// ユーザールート
app.use("/api/users", userRouter);

// デバイスルート
app.use("/api/devices", devicesRouter);

// 404エラーハンドリング
app.use((req, res) => {
  res.status(404).json({ error: "ページが見つかりません" });
});

// Express アプリをエクスポート（Vercel 用）
module.exports = app;
