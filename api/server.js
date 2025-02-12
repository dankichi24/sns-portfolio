const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const userRouter = require("./routers/user");
const devicesRouter = require("./routers/devices");

const PORT = 5000;

// .env ファイルを読み込む
require("dotenv").config();

// アップロード先ディレクトリを確認・作成
const uploadDir = path.join(__dirname, "uploads/img");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS の設定
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// JSON形式のリクエストボディを解析
app.use(express.json());

// トップレベルのルート
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// 認証ルート
app.use("/api/auth", authRoutes);

// 投稿ルート
app.use("/api/posts", postRoutes);

// ユーザールート
app.use("/api/users", userRouter);

// デバイスルート
app.use("/api/devices", devicesRouter);

// アップロードされたファイルを静的に提供
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// デバッグ用ルート（アップロードされたファイル一覧を取得）
app.get("/uploads-debug", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading uploads directory");
    }
    res.json(files);
  });
});

// サーバーを起動
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

// 404エラーハンドリング
app.use((req, res) => {
  res.status(404).json({ error: "ページが見つかりません" });
});
