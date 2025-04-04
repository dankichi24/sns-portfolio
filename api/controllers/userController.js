const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../lib/supabase");

// プロフィール画像アップロード処理
const uploadProfileImage = async (req, res) => {
  const userId = parseInt(req.body.userId, 10);
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "画像ファイルが見つかりません。" });
  }

  try {
    const fileExt = file.originalname.split(".").pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res
        .status(500)
        .json({ error: "Supabaseへのアップロードに失敗しました。" });
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: publicUrl },
    });

    return res.status(200).json({
      message: "プロフィール画像がアップロードされました。",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "画像アップロード中にエラーが発生しました。" });
  }
};

// ユーザー名更新処理
const updateUsername = async (req, res) => {
  const { userId, newUsername } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "ユーザーが見つかりません。" });
    }

    if (existingUser.username === newUsername) {
      return res.status(200).json({
        message: "名前は既に設定されています。",
        user: existingUser,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });

    return res.status(200).json({
      message: "ユーザー名が更新されました。",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "ユーザー名の更新中にエラーが発生しました。" });
  }
};

// ユーザー情報取得処理
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (!userId) {
    return res.status(400).json({ error: "ユーザーIDが必要です。" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません。" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "ユーザー情報取得中にエラーが発生しました。" });
  }
};

module.exports = {
  uploadProfileImage,
  updateUsername,
  getUserById,
};
