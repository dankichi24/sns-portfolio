const express = require("express");
const app = express();
const authRoutes = require("./routers/auth");

const PORT = 5000;

// .env ファイルを読み込む
require("dotenv").config();

app.use(express.json());

// 認証ルート
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
