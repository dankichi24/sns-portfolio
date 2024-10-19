const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 新規投稿を作成する関数
exports.createPost = async (req, res) => {
  console.log("req.user in createPost:", req.user);
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;
  const userId = req.user.userId;

  console.log("User ID:", userId);
  if (!userId) {
    return res.status(400).json({ error: "ユーザーIDが必要です。" });
  }

  try {
    console.log("Creating new post with data:", {
      title,
      content,
      image,
      userId,
    });
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        image: image ? `/uploads/${image}` : null,
        userId: userId,
      },
    });
    console.log("Post created successfully:", newPost);
    res.status(201).json({ message: "投稿が作成されました。", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "投稿の作成に失敗しました。" });
  }
};

// 投稿の一覧を取得する関数
exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true, // usernameのみを取得
          },
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "投稿の取得に失敗しました。" });
  }
};
