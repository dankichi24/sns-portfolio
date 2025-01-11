const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path"); // pathモジュールをインポート
const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const userRouter = require("./routers/user"); // ユーザールーターをインポート

const PORT = 5000;

// .env ファイルを読み込む
require("dotenv").config();

// CORS の設定を追加
app.use(
  cors({
    origin: "http://localhost:3000", // フロントエンドの URL
    credentials: true, // クッキーなどの認証情報を共有する場合は true に設定
  })
);

// JSON形式のリクエストボディを解析
app.use(express.json());

// トップレベルのルートに対応するレスポンスを追加
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// 認証ルート
app.use("/api/auth", authRoutes);

// 投稿ルートを追加
app.use("/api/posts", postRoutes);

// ユーザールートを追加
app.use("/api/users", userRouter);

// アップロードされたファイルを静的に提供
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

console.log("Static file path:", path.join(__dirname, "uploads"));

// デバッグ用ルートを追加
app.get("/uploads-debug", (req, res) => {
  const fs = require("fs");
  const directoryPath = path.join(__dirname, "uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading uploads directory");
    }
    res.json(files);
  });
});

// サーバーを起動
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));

// すべてのルートにマッチしなかった場合の404エラーハンドリング
app.use((req, res, next) => {
  res.status(404).json({ error: "ページが見つかりません" });
});
