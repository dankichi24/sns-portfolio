const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware"); // ミドルウェアのインポート
const {
  updateUsername,
  uploadProfileImage,
} = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

// 画像アップロードの設定（統一）
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // アップロード先を正確に設定
  },
  filename: function (req, file, cb) {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }); // 一貫性を持たせる

// ユーザー情報取得のルート
router.get("/profile", authenticateToken, (req, res) => {
  console.log("req.user in /profile:", req.user); // デバッグ用ログ
  res.json({
    message: "認証成功",
    user: req.user, // JWTからデコードされたユーザー情報を返す
  });
});

// ユーザー名を更新するエンドポイント
router.put("/update-username", authenticateToken, updateUsername); // ミドルウェアで認証を追加

// プロフィール画像をアップロードするエンドポイント
router.post(
  "/upload-profile-image",
  authenticateToken,
  upload.single("profileImage"), // multerでファイルを処理
  uploadProfileImage // コントローラーで処理
);

module.exports = router;
