const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // トークンが正しく取得されているか確認
  console.log("Authorization Header:", authHeader);

  if (!token) {
    return res.status(401).json({ error: "トークンが必要です" });
  }

  // JWTトークンの検証前にログ出力
  console.log("Token being verified:", token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json({ error: "トークンが無効です" });
    }
    console.log("Verified User:", user); // ユーザー情報をログで確認
    req.user = user; // req.user にユーザー情報をセット
    next();
  });
};

module.exports = authenticateToken;
