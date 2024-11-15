const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// JWTシークレットキーを環境変数から取得
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
    // すでに登録されたユーザーが存在するか確認
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "このメールアドレスはすでに使用されています" });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // JWTトークンを生成 (有効期限は1日)
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // トークンとユーザー情報を返す
    return res.status(201).json({
      message: "ユーザー登録成功",
      token: token, // ← トークンをフロントエンドに返す
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
};

// ユーザーログインコントローラー
const loginUser = async (req, res) => {
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

    // トークンとユーザー情報を返す
    return res.json({
      message: "ログイン成功",
      token: token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
};

// 認証されたユーザーの情報を取得するコントローラ
const getMe = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user); // デバッグ用ログ
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }

    // ユーザー情報を返す
    return res.json({
      userId: user.id, // userIdとして返す
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in getMe:", error); // サーバーエラーがあるか確認
    return res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
