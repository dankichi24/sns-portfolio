/**
 * 投稿管理用ルーティング定義
 *
 * @module routes/post
 * @description
 * 投稿（記事）の作成・取得・編集・削除・いいね等を扱うAPIエンドポイントを提供する。
 * 各エンドポイントはJWT認証（authenticateToken）が必要。
 * 画像アップロードにはmulterのmemoryStorageを利用。
 *
 * - POST   /             : 新規投稿（画像アップロード対応）
 * - GET    /             : 投稿一覧取得
 * - GET    /my-posts     : 自分の投稿一覧取得
 * - GET    /favorites    : 自分がお気に入りした投稿一覧取得
 * - GET    /:id          : 投稿詳細取得
 * - POST   /like         : いいねのトグル
 * - PUT    /:postId      : 投稿の編集（画像アップロード対応）
 * - DELETE /:postId      : 投稿の削除
 */

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
