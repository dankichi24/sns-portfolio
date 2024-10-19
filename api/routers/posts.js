const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// multerの設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // アップロード先ディレクトリ
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// 新規投稿ルート（画像付き）
router.post("/", authenticateToken, upload.single("image"), createPost);

// 投稿一覧取得ルート（GETリクエスト）
router.get("/", authenticateToken, getPosts); // ここでgetPostsをルートに設定

module.exports = router;
