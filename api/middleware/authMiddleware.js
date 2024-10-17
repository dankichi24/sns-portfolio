const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRETが設定されていません。環境変数を確認してください。"
  );
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer トークンの形式を想定

  console.log("Authorization Header:", authHeader);

  if (!token) {
    return res.status(401).json({ error: "トークンが必要です" });
  }

  console.log("Token being verified:", token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json({ error: "トークンが無効です" });
    }
    console.log("Verified User:", user); // デバッグ用
    req.user = user; // ユーザー情報を設定
    console.log("req.user set:", req.user); // 確認ログ
    next();
  });
};

module.exports = authenticateToken;
