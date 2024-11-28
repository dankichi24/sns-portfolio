const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 新規投稿を作成する
const createPost = async (req, res) => {
  console.log("Request user in createPost:", req.user);
  const { content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null; // 画像がある場合、フルパスを指定
  const userId = req.user.userId;

  console.log("User ID:", userId);
  if (!userId) {
    return res.status(400).json({ error: "ユーザーIDが送信されていません。" });
  }

  try {
    console.log("Creating new post with data:", {
      content,
      image,
      userId,
    });

    const newPost = await prisma.post.create({
      data: {
        content,
        image,
        userId,
        createdAt: new Date(), // 自動で作成される場合は後で削除可能
      },
    });

    console.log("Post created successfully:", newPost);
    res.status(201).json({ message: "投稿が作成されました。", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "投稿の作成中に失敗しました。" });
  }
};

// 投稿の一覧を取得する関数
const getPosts = async (req, res) => {
  const userId = req.user.userId; // ログイン中のユーザーIDを取得

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, username: true } }, // ユーザーIDとユーザー名を取得
        likes: { select: { userId: true } }, // likes テーブルから userId を取得
      },
      orderBy: { createdAt: "desc" },
    });

    // ユーザーが「いいね」しているかどうかを追加
    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      user: {
        userId: post.user.id, // ユーザーIDを userId としてセット
        username: post.user.username,
      },
      liked: post.likes.some((like) => like.userId === userId),
      likeCount: post.likes.length,
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "投稿の取得に失敗しました。" });
  }
};

const toggleLike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.userId;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId: postId,
          userId: userId,
        },
      },
    });

    if (existingLike) {
      // すでに「いいね」している場合は削除
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // まだ「いいね」していない場合は追加
      await prisma.like.create({
        data: { userId, postId },
      });
    }

    // 最新のlikeCountを取得
    const likeCount = await prisma.like.count({
      where: { postId: postId },
    });

    res.json({ liked: !existingLike, likeCount }); // 最新のlikeCountを返す
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "いいねのトグル中にエラーが発生しました。" });
  }
};

// 投稿を編集する関数
const editPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined; // 画像がある場合、パスを設定
  const userId = req.user.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) {
      return res.status(404).json({ error: "投稿が見つかりません。" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "この投稿を編集する権限がありません。" });
    }

    const updatedData = { content };
    if (image) {
      updatedData.image = image;
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: updatedData,
    });

    res
      .status(200)
      .json({ message: "投稿が更新されました。", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "投稿の更新中にエラーが発生しました。" });
  }
};

// 投稿を削除する関数
const deletePost = async (req, res) => {
  const { postId } = req.params;
  console.log("Received postId for deletion:", postId); // 追加
  const userId = req.user.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) {
      return res.status(404).json({ error: "投稿が見つかりません。" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "この投稿を削除する権限がありません。" });
    }

    await prisma.like.deleteMany({
      where: { postId: Number(postId) },
    });

    // 2. 投稿自体を削除
    await prisma.post.delete({
      where: { id: Number(postId) },
    });

    res.status(200).json({ message: "投稿が削除されました。" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "投稿の削除中にエラーが発生しました。" });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, username: true } },
        likes: { select: { userId: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "投稿が見つかりません。" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "投稿の取得に失敗しました。" });
  }
};

module.exports = {
  createPost,
  getPosts,
  editPost,
  deletePost,
  toggleLike,
  getPostById,
};
