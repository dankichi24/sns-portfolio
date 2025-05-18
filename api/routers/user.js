/**
 * ユーザー管理用ルーティング定義
 *
 * @module routes/user
 * @description
 * プロフィール画像のアップロードやユーザー名の更新、ユーザー情報取得など
 * ユーザー管理関連のAPIエンドポイントを提供する。
 * 一部エンドポイントはJWT認証（authenticateToken）が必要。
 * 画像アップロードにはmulterのmemoryStorageを利用。
 *
 * - GET    /profile                 : JWT認証確認＆ユーザー情報取得（認証済みのみ）
 * - GET    /:userId                 : 指定ユーザーの情報取得
 * - PUT    /update-username         : ユーザー名の更新（認証済みのみ）
 * - POST   /upload-profile-image    : プロフィール画像のアップロード（認証済み・画像必須）
 */

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  updateUsername,
  uploadProfileImage,
  getUserById,
} = require("../controllers/userController");

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "認証成功", user: req.user });
});

router.get("/:userId", getUserById);

router.put("/update-username", authenticateToken, updateUsername);

router.post(
  "/upload-profile-image",
  authenticateToken,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;
