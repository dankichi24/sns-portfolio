const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  console.log("req.user in createPost:", req.user); // 確認用ログ
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null; // 画像ファイルのファイル名を取得
  const userId = req.user ? req.user.userId : null; // req.user が存在する場合に userId を取得

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

    // データベースに投稿を作成
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        image: image ? `/uploads/${image}` : null,
        userId: userId,
      },
    });

    console.log("Post created successfully:", newPost);

    res.status(201).json({ message: "投稿が作成されました", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "投稿の作成に失敗しました" });
  }
};
