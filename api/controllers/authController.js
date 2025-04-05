const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// 新規ユーザー登録コントローラー
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "すべてのフィールドを入力してください" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "このメールアドレスはすでに使用されています" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        image: process.env.SUPABASE_DEFAULT_IMAGE,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "ユーザー登録成功",
      token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
};

// ユーザーログインコントローラー
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "メールアドレスとパスワードを入力してください" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "メールアドレスまたはパスワードが正しくありません" });
    }

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

    return res.json({
      message: "ログイン成功",
      token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
};

// 認証されたユーザーの情報を取得するコントローラ
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }

    return res.json({
      userId: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
