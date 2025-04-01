const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../lib/supabase"); // ✅ 追加

// デバイスの追加
const addDevice = async (req, res) => {
  const { name, userId, comment } = req.body;
  const file = req.file;

  if (!name || !file || !userId) {
    return res
      .status(400)
      .json({ message: "名前、画像、ユーザーIDが必要です。" });
  }

  try {
    // ✅ ファイル名を生成
    const fileExt = file.originalname.split(".").pop();
    const fileName = `device-${userId}-${Date.now()}.${fileExt}`;

    // ✅ Supabase Storage にアップロード
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return res
        .status(500)
        .json({ message: "画像のアップロードに失敗しました。" });
    }

    // ✅ 公開URLを生成
    const imagePath = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;

    // ✅ DBへ登録
    const newDevice = await prisma.device.create({
      data: {
        name,
        image: imagePath,
        comment: comment || null,
        user: {
          connect: { id: parseInt(userId) },
        },
      },
    });

    res.status(201).json(newDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "デバイス登録中にエラーが発生しました。" });
  }
};

// デバイス一覧の取得
const getDevices = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "ユーザーIDが必要です。" });
  }

  try {
    const devices = await prisma.device.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: "デバイス一覧の取得に失敗しました。" });
  }
};

// デバイスの削除
const deleteDevice = async (req, res) => {
  const deviceId = parseInt(req.params.deviceId, 10);

  if (!deviceId) {
    return res.status(400).json({ message: "デバイスIDが必要です。" });
  }

  try {
    await prisma.device.delete({
      where: { id: deviceId },
    });

    res.status(200).json({ message: "デバイスが削除されました。" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "デバイスの削除中にエラーが発生しました。" });
  }
};

module.exports = {
  addDevice,
  getDevices,
  deleteDevice,
};
