/**
 * Expressアプリケーションのエントリーポイント
 *
 * @module app
 * @description
 * 各種ルーティングの統合、CORS設定、JSONリクエストボディのパース、
 * および「404」ハンドリング等を含むAPIサーバーのメイン初期化ファイル。
 *
 * - /api/auth    : 認証系ルート
 * - /api/posts   : 投稿関連ルート
 * - /api/users   : ユーザー関連ルート
 * - /api/devices : デバイス関連ルート
 *
 * ローカル開発時のみサーバーをlisten起動し、本番デプロイ時は外部から起動される前提。
 * CORSはフロントエンドURLで許可制御している。
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const userRouter = require("./routers/user");
const devicesRouter = require("./routers/devices");

const app = express();

const allowedOrigins = ["http://localhost:3000"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRouter);
app.use("/api/devices", devicesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "ページが見つかりません" });
});

module.exports = app;
