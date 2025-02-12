const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  updateUsername,
  uploadProfileImage,
  getUserById,
} = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

// 画像アップロードの設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ユーザー情報取得
router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "認証成功",
    user: req.user,
  });
});

// 特定のユーザー情報取得
router.get("/:userId", getUserById);

// ユーザー名更新
router.put("/update-username", authenticateToken, updateUsername);

// プロフィール画像アップロード
router.post(
  "/upload-profile-image",
  authenticateToken,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;
