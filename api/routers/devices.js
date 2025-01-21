const express = require("express");
const multer = require("multer");
const { addDevice, getDevices } = require("../controllers/deviceController"); // getDevicesを追加

const router = express.Router();

// Multerの設定（画像アップロード用）
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/img/"); // 保存先ディレクトリ
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // ユニークなファイル名
  },
});
const upload = multer({ storage });

// デバイス登録エンドポイント
router.post("/add", upload.single("image"), addDevice);

// デバイスリスト取得エンドポイント
router.get("/", getDevices); // ここに追加

module.exports = router;
