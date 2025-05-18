const prisma = require("../lib/prisma");
const supabase = require("../lib/supabase");

/**
 * 新規投稿を作成するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（body: content, file: 画像, req.user.userId）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} 投稿作成結果のJSONを返す（成功時: 201, 失敗時: エラーコード）
 * @description
 * 投稿内容と画像ファイルを受け取り、Supabase Storageに画像をアップロードし、DBに投稿情報を保存する。
 * 成功時は作成された投稿データを返す。
 */
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

/**
 * 投稿一覧を取得するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（req.user.userIdを利用）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} 投稿一覧（配列）のJSONを返す
 * @description
 * 全ユーザーの投稿一覧と、各投稿のいいね状態・いいね数・ユーザー情報を含めて返す。
 */
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

/**
 * いいねをトグル（付与/解除）するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（body: postId, req.user.userId）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} トグル結果（liked: true/false）を返す
 * @description
 * 指定投稿に対する「いいね」状態を切り替え、結果を返す。
 */
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

/**
 * 投稿を編集するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（params: postId, body: content, file: 画像, req.user.userId）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} 編集結果（更新後の投稿）を返す
 * @description
 * 指定IDの投稿の内容や画像を変更する。ユーザー本人のみ編集可能。
 */
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

/**
 * 投稿を削除するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（params: postId, req.user.userId）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} 削除結果のメッセージを返す
 * @description
 * 指定IDの投稿を削除する。ユーザー本人のみ削除可能。
 */
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

/**
 * 投稿詳細をID指定で取得するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（params: id）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} 投稿詳細データを返す
 * @description
 * 投稿IDで詳細情報（ユーザー・いいね情報含む）を取得する。
 */
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

/**
 * 自分の投稿一覧を取得するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（req.user.userId）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} 自分の投稿一覧を返す
 * @description
 * ログインユーザー自身の投稿一覧を返す。いいね状態・ユーザー情報も含まれる。
 */
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

/**
 * お気に入りした投稿一覧を取得するコントローラー
 *
 * @async
 * @param {import("express").Request} req - リクエストオブジェクト（req.user.userId）
 * @param {import("express").Response} res - レスポンスオブジェクト
 * @returns {Promise<void>} お気に入り投稿の一覧を返す
 * @description
 * ログインユーザーが「いいね」した投稿のみを一覧で返す。
 */
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
