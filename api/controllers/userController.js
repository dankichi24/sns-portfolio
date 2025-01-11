const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");

// プロフィール画像アップロード処理
exports.uploadProfileImage = async (req, res) => {
  const userId = parseInt(req.body.userId, 10);
  const image = req.file ? `/uploads/${req.file.filename}` : null; // 画像がある場合、パスを設定

  console.log("Uploaded file:", req.file); // 確認用ログ

  if (!image) {
    return res.status(400).json({ error: "画像ファイルが見つかりません。" });
  }

  try {
    // ユーザー情報の更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: image }, // `image` フィールドを更新
    });

    console.log("Updated user:", updatedUser); // 確認用ログ

    return res.status(200).json({
      message: "プロフィール画像がアップロードされました。",
      user: {
        ...updatedUser,
        image: `http://localhost:5000${image}`, // クライアントで利用可能なURL
      },
    });
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return res
      .status(500)
      .json({ error: "画像アップロード中にエラーが発生しました。" });
  }
};

// ユーザー名更新処理
exports.updateUsername = async (req, res) => {
  const { userId, newUsername } = req.body;

  console.log("Request Data:", { userId, newUsername });

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
    console.error("サーバーエラー:", error);
    return res
      .status(500)
      .json({ error: "ユーザー名の更新中にエラーが発生しました。" });
  }
};
