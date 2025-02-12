const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

// 新規ユーザー登録
router.post("/register", registerUser);

// ユーザーログイン
router.post("/login", loginUser);

// 認証されたユーザー情報取得
router.get("/me", authenticateToken, getMe);

module.exports = router;
