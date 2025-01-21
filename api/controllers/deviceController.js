const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// デバイスの追加
exports.addDevice = async (req, res) => {
  console.log("Request body:", req.body); // リクエストボディを確認
  console.log("Uploaded file:", req.file); // アップロードされたファイルを確認

  const { name, userId } = req.body;
  const imagePath = req.file ? `/uploads/img/${req.file.filename}` : null;

  if (!name || !imagePath || !userId) {
    console.error("Missing required fields");
    return res
      .status(400)
      .json({ message: "名前、画像、ユーザーIDが必要です。" });
  }

  try {
    const newDevice = await prisma.device.create({
      data: {
        name,
        image: imagePath,
        user: {
          connect: { id: parseInt(userId) },
        },
      },
    });

    res.status(201).json(newDevice);
  } catch (error) {
    console.error("Error during device creation:", error);
    res.status(500).json({ message: "デバイス登録中にエラーが発生しました。" });
  }
};

exports.getDevices = async (req, res) => {
  const userId = req.query.userId; // クエリパラメータからユーザーIDを取得

  if (!userId) {
    return res.status(400).json({ message: "ユーザーIDが必要です。" });
  }

  try {
    const devices = await prisma.device.findMany({
      where: {
        userId: parseInt(userId), // ユーザーIDに紐づくデバイスを取得
      },
    });
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ message: "デバイス一覧の取得に失敗しました。" });
  }
};
