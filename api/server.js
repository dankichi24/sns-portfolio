const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PORT = 5000;

const prisma = new PrismaClient();

// .env ファイルを読み込む
require("dotenv").config();

// JWTシークレットキーを環境変数から取得
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

// 新規ユーザー登録API
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  // 入力チェック
  if (!username || !email || !password) {
    return res
      .status(401)
      .json({ error: "すべてのフィールドを入力してください" });
  }

  try {
    // すでに登録されたユーザーが存在するか確認
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(401)
        .json({ error: "このメールアドレスはすでに使用されています" });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword, // ハッシュ化したパスワードを保存
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

// ユーザーログインAPI
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // 入力チェック
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "メールアドレスとパスワードを入力してください" });
  }

  try {
    // メールアドレスに一致するユーザーを探す
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "メールアドレスまたはパスワードが正しくありません" });
    }

    // パスワードの照合
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "メールアドレスまたはパスワードが正しくありません" });
    }

    // JWTトークンを生成 (有効期限は1日)
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // トークンを返す
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

// サーバーの起動
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
