const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const userRouter = require("./routers/user");
const devicesRouter = require("./routers/devices");

// ポート番号の設定（Vercel の自動割り当てに対応）
const PORT = process.env.PORT || 5000;

// .env ファイルを読み込む
require("dotenv").config();

// アップロード先ディレクトリを確認・作成
let uploadDir = path.join(__dirname, "uploads/img");

// Vercel 環境では `/tmp/uploads/img` を使用
if (process.env.VERCEL) {
  uploadDir = "/tmp/uploads/img";
}

// ディレクトリを作成（存在しない場合のみ）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log("Upload directory:", uploadDir);

// CORS の設定（デプロイ環境対応）
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// JSON形式のリクエストボディを解析
app.use(express.json());

// トップレベルのルート
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// ✅ `/api` ルートを追加
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

// アップロードされたファイルを静的に提供（ローカル環境のみ）
if (!process.env.VERCEL) {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

// デバッグ用ルート（アップロードされたファイル一覧を取得）
app.get("/uploads-debug", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading uploads directory");
    }
    res.json(files);
  });
});

// 404エラーハンドリング
app.use((req, res) => {
  res.status(404).json({ error: "ページが見つかりません" });
});

// サーバーを起動
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
