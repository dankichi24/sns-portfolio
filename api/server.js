const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const userRouter = require("./routers/user");
const devicesRouter = require("./routers/devices");

const app = express();

// CORS 設定を修正
const allowedOrigins = [
  "http://localhost:3000", // ローカル開発用
  process.env.FRONTEND_URL, // Vercel環境用
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 許可するメソッド
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"], // 👈 cache-control を追加！
  })
);

// JSON形式のリクエストボディを解析
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API (Local Development Mode)");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRouter);
app.use("/api/devices", devicesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "ページが見つかりません" });
});

// ✅ ローカル開発用サーバー起動
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;
