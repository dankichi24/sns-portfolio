const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * 新規ユーザー登録コントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（bodyにusername, email, passwordを含む）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} ユーザー作成結果のJSONを返す（成功時: 201, 失敗時: エラーコード）
 * @description
 * クライアントから送信されたユーザー情報を受け取り、
 * メール重複をチェックし、パスワードをハッシュ化して保存する。
 * 成功時はJWTトークンとユーザー情報を返す。
 */
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

/**
 * ユーザーログインコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（bodyにemail, passwordを含む）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} ログイン結果のJSONを返す
 * @description
 * メールアドレスとパスワードで認証し、
 * 成功時はJWTトークンとユーザー情報を返す。
 * 認証失敗時は401エラーを返す。
 */
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

/**
 * 認証済みユーザー情報取得コントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（req.user.userIdにユーザーIDが格納されている必要あり）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} ユーザー情報のJSONを返す
 * @description
 * 認証済みユーザーのIDからユーザー情報を取得し返す。
 * 見つからない場合は404を返す。
 */
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
