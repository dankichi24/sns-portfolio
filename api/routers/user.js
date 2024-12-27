const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware"); // ミドルウェアのインポート
const { updateUsername } = require("../controllers/userController");

// 保護されたルート：ユーザー情報を取得
router.get("/profile", authenticateToken, (req, res) => {
  console.log("req.user in /profile:", req.user); // デバッグ用ログ
  // ミドルウェアを通過した場合、req.user にはトークンからのユーザー情報が含まれる
  res.json({
    message: "認証成功",
    user: req.user, // JWTからデコードされたユーザー情報を返す
  });
});

// ユーザー名を更新するエンドポイント
router.put("/update-username", authenticateToken, updateUsername); // ミドルウェアで認証を追加

module.exports = router;
