const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // postControllerオブジェクトとしてインポート
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

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
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  postController.createPost
);

// 投稿一覧取得ルート（GETリクエスト）
router.get("/", authenticateToken, postController.getPosts);

router.get("/my-posts", authenticateToken, postController.getMyPosts);

// 自分がお気に入りした投稿を取得
router.get("/favorites", authenticateToken, postController.getFavoritePosts);

router.get("/:id", authenticateToken, postController.getPostById);

// いいねのトグルエンドポイント
router.post("/like", authenticateToken, postController.toggleLike);

// 編集と削除のルート
// api/routers/posts.js
router.put(
  "/:postId",
  authenticateToken,
  upload.single("image"),
  postController.editPost
);
router.delete("/:postId", authenticateToken, postController.deletePost);

module.exports = router;
