const express = require("express");
const router = express.Router();
const { createPost } = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// multerのインスタンスを詳細設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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

module.exports = router;
