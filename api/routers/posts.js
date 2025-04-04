const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// 新規投稿（画像付き）
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  postController.createPost
);

// 投稿一覧取得
router.get("/", authenticateToken, postController.getPosts);

// 自分の投稿取得
router.get("/my-posts", authenticateToken, postController.getMyPosts);

// 自分がお気に入りした投稿取得
router.get("/favorites", authenticateToken, postController.getFavoritePosts);

// 特定の投稿取得
router.get("/:id", authenticateToken, postController.getPostById);

// いいねのトグル
router.post("/like", authenticateToken, postController.toggleLike);

// 投稿の編集（画像付き）
router.put(
  "/:postId",
  authenticateToken,
  upload.single("image"),
  postController.editPost
);

// 投稿の削除
router.delete("/:postId", authenticateToken, postController.deletePost);

module.exports = router;
