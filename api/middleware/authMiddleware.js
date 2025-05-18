/**
 * JWT認証ミドルウェア
 *
 * @module middleware/authMiddleware
 * @description
 * AuthorizationヘッダーからJWTを検証し、認証済みユーザー情報（userId, email）をreq.userに格納。
 * トークンがない場合は401、トークンが不正な場合は403を返してリクエストを拒否する。
 *
 * @param {import("express").Request} req - Expressのリクエストオブジェクト
 * @param {import("express").Response} res - Expressのレスポンスオブジェクト
 * @param {import("express").NextFunction} next - 次のミドルウェア関数
 * @returns {void}
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRETが設定されていません。環境変数を確認してください。"
  );
}

/**
 * JWTトークンを検証するミドルウェア
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "トークンが必要です" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "トークンが無効です" });
    }

    req.user = { userId: user.userId, email: user.email };
    next();
  });
};

module.exports = authenticateToken;
