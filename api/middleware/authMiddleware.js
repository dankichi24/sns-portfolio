const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRETが設定されていません。環境変数を確認してください。"
  );
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "トークンが必要です" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Invalid token:", err);
      return res.status(403).json({ error: "トークンが無効です" });
    }

    // デコードされたユーザー情報を確認し、req.user に userId を設定
    req.user = { userId: user.userId, email: user.email };
    console.log("Decoded User in middleware:", req.user); // デバッグ用ログ
    next();
  });
};

module.exports = authenticateToken;
