const prisma = require("../lib/prisma");
const supabase = require("../lib/supabase");

// 新規投稿を作成する
const createPost = async (req, res) => {
  const { content } = req.body;
  const file = req.file;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ error: "ユーザーIDが送信されていません。" });
  }

  try {
    let imageUrl = null;

    if (file) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `post-${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res
          .status(500)
          .json({ error: "画像のアップロードに失敗しました。" });
      }

      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        userId,
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: "投稿が作成されました。", post: newPost });
  } catch (error) {
    res.status(500).json({ error: "投稿の作成中に失敗しました。" });
  }
};

// 投稿の一覧を取得する関数
const getPosts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, username: true, image: true } },
        likes: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      user: {
        userId: post.user.id,
        username: post.user.username,
        image: post.user.image || process.env.SUPABASE_DEFAULT_IMAGE,
      },
      liked: post.likes.some((like) => like.userId === userId),
      likeCount: post.likes.length,
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    res.status(500).json({ error: "投稿の取得に失敗しました。" });
  }
};

const toggleLike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.userId;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { postId, userId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({ data: { userId, postId } });
    }

    res.json({ liked: !existingLike });
  } catch (error) {
    res.status(500).json({ error: "いいねのトグル中にエラーが発生しました。" });
  }
};

// 投稿を編集する関数
const editPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const file = req.file;
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

    if (file) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `post-${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res
          .status(500)
          .json({ error: "画像のアップロードに失敗しました。" });
      }

      updatedData.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: updatedData,
    });

    res
      .status(200)
      .json({ message: "投稿が更新されました。", post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: "投稿の更新中にエラーが発生しました。" });
  }
};

// 投稿を削除する関数
const deletePost = async (req, res) => {
  const { postId } = req.params;
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

    await prisma.like.deleteMany({ where: { postId: Number(postId) } });

    await prisma.post.delete({ where: { id: Number(postId) } });

    res.status(200).json({ message: "投稿が削除されました。" });
  } catch (error) {
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
    res.status(500).json({ error: "投稿の取得に失敗しました。" });
  }
};

// 自分の投稿を取得する関数
const getMyPosts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, username: true, image: true } },
        likes: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      user: {
        userId: post.user.id,
        username: post.user.username,
        image: post.user.image || process.env.SUPABASE_DEFAULT_IMAGE,
      },
      liked: post.likes.some((like) => like.userId === userId),
      likeCount: post.likes.length,
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    res.status(500).json({ error: "自分の投稿の取得に失敗しました。" });
  }
};

// 自分がお気に入りした投稿を取得する関数
const getFavoritePosts = async (req, res) => {
  const userId = req.user.userId;
  try {
    const favoritePosts = await prisma.like.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            user: { select: { id: true, username: true, image: true } },
            likes: { select: { userId: true } },
          },
        },
      },
    });

    const postsWithLikeStatus = favoritePosts.map((favorite) => ({
      ...favorite.post,
      user: {
        userId: favorite.post.user.id,
        username: favorite.post.user.username,
        image: favorite.post.user.image || process.env.SUPABASE_DEFAULT_IMAGE,
      },
      liked: true,
      likeCount: favorite.post.likes.length,
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    res.status(500).json({ error: "お気に入り投稿の取得に失敗しました。" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  editPost,
  deletePost,
  toggleLike,
  getPostById,
  getFavoritePosts,
};
