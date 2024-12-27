const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateUsername = async (req, res) => {
  const { userId, newUsername } = req.body;

  console.log("Request Data:", { userId, newUsername }); // リクエストデータをログ出力

  try {
    // 現在のユーザー情報を取得
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("Existing User:", existingUser); // 既存のユーザー情報をログ出力

    if (!existingUser) {
      return res.status(404).json({ error: "ユーザーが見つかりません。" });
    }

    // 新しい名前が現在の名前と同じ場合はスキップ
    if (existingUser.username === newUsername) {
      console.log("No change in username."); // 名前が変わっていない場合
      return res.status(200).json({
        message: "名前は既に設定されています。",
        user: existingUser,
      });
    }

    // ユーザー名を更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });
    console.log("Updated User:", updatedUser); // 更新されたユーザー情報をログ出力

    return res.status(200).json({
      message: "ユーザー名が更新されました。",
      user: updatedUser,
    });
  } catch (error) {
    console.error("サーバーエラー:", error); // エラー内容をログ出力
    return res
      .status(500)
      .json({ error: "ユーザー名の更新中にエラーが発生しました。" });
  }
};
