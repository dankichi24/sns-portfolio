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
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true, // ユーザー名のみを取得
          },
        },
      },
      orderBy: {
        createdAt: "desc", // 作成日で降順にソート（最新の投稿が上に表示される）
      },
    });

    res.status(200).json(posts);
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
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      // 既に「いいね」している場合は削除
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      const likeCount = await prisma.like.count({
        where: { postId },
      });
      return res.json({ liked: false, likeCount });
    } else {
      // まだ「いいね」していない場合は追加
      await prisma.like.create({
        data: { userId, postId },
      });
      const likeCount = await prisma.like.count({
        where: { postId },
      });
      return res.json({ liked: true, likeCount });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "いいねのトグル中にエラーが発生しました。" });
  }
};
