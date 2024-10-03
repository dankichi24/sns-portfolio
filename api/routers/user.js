const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware"); // ミドルウェアのインポート

// 保護されたルート：ユーザー情報を取得
router.get("/profile", authenticateToken, (req, res) => {
  // ミドルウェアを通過した場合、req.user にはトークンからのユーザー情報が含まれる
  res.json({
    message: "認証成功",
    user: req.user, // JWTからデコードされたユーザー情報を返す
  });
});

module.exports = router;
