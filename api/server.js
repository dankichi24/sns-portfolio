const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const PORT = 5000;

const prisma = new PrismaClient();

// JSONボディをパースするミドルウェア
app.use(express.json());

// 新規ユーザー登録API
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  // 入力チェック
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "すべてのフィールドを入力してください" });
  }

  try {
    // すでに登録されたユーザーが存在するか確認
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
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

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
