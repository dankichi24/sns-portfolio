const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 新規投稿を作成する
exports.createPost = async (req, res) => {
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
exports.getPosts = async (req, res) => {
  const userId = req.user.userId; // ログイン中のユーザーIDを取得

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { username: true } },
        likes: { select: { userId: true } }, // likes テーブルから userId を取得
      },
      orderBy: { createdAt: "desc" },
    });

    // ユーザーが「いいね」しているかどうかを追加
    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      liked: post.likes.some((like) => like.userId === userId),
      likeCount: post.likes.length,
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "投稿の取得に失敗しました。" });
  }
};

exports.toggleLike = async (req, res) => {
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
