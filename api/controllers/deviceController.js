const prisma = require("../lib/prisma");
const supabase = require("../lib/supabase");

/**
 * デバイスを新規追加するコントローラー
 *
 * @async
 * @function addDevice
 * @param {import("express").Request} req - Expressのリクエストオブジェクト
 * @param {import("express").Response} res - Expressのレスポンスオブジェクト
 * @returns {Promise<void>}
 *
 * @description
 * リクエストボディから name, userId, comment を受け取り、
 * オプションで画像ファイルをSupabase Storageにアップロードしてデバイス情報をDBに保存する。
 * 成功時は作成したデバイス情報を返す。
 */
const addDevice = async (req, res) => {
  const { name, userId, comment } = req.body;
  const file = req.file;

  if (!name || !userId) {
    return res.status(400).json({ message: "名前とユーザーIDが必要です。" });
  }

  try {
    let imagePath = "/no-image.png";

    if (file) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `device-${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res
          .status(500)
          .json({ message: "画像のアップロードに失敗しました。" });
      }

      imagePath = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;
    }

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
    res.status(500).json({ message: "デバイス登録中にエラーが発生しました。" });
  }
};

/**
 * ユーザーのデバイス一覧を取得するコントローラー
 *
 * @async
 * @function getDevices
 * @param {import("express").Request} req - Expressのリクエストオブジェクト
 * @param {import("express").Response} res - Expressのレスポンスオブジェクト
 * @returns {Promise<void>}
 *
 * @description
 * クエリパラメータ userId で指定されたユーザーのデバイス一覧を取得し、配列で返す。
 */
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

/**
 * デバイスを削除するコントローラー
 *
 * @async
 * @function deleteDevice
 * @param {import("express").Request} req - Expressのリクエストオブジェクト
 * @param {import("express").Response} res - Expressのレスポンスオブジェクト
 * @returns {Promise<void>}
 *
 * @description
 * パラメータ deviceId で指定されたデバイスを削除する。
 * 削除成功時はメッセージを返す。
 */
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
