// api/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // 環境変数からJWTのシークレットキーを取得

// ミドルウェア関数：トークンを検証し、リクエストにユーザー情報を追加する
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>" の形式を想定

  if (!token) {
    return res.status(401).json({ error: "トークンが必要です" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "トークンが無効です" });
    }
    req.user = user; // トークンが有効な場合、リクエストにユーザー情報を追加
    next(); // 次のミドルウェアやルートハンドラーに処理を渡す
  });
};

module.exports = authenticateToken;
