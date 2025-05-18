/**
 * 認証関連のルーティング定義
 *
 * @module routes/auth
 * @description
 * 新規ユーザー登録、ログイン、認証済みユーザー情報取得のエンドポイントを提供する。
 * JWT認証ミドルウェア（authenticateToken）を使用し、/meエンドポイントの認可を制御する。
 *
 * - POST /register : 新規ユーザー登録
 * - POST /login    : ログイン（JWTトークン発行）
 * - GET  /me       : 認証済みユーザー情報取得（要認証）
 */

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
