const express = require("express");
const multer = require("multer");
const {
  addDevice,
  getDevices,
  deleteDevice,
} = require("../controllers/deviceController");

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

// デバイス登録
router.post("/add", upload.single("image"), addDevice);

// デバイス一覧取得
router.get("/", getDevices);

// デバイス削除
router.delete("/delete/:deviceId", deleteDevice);

module.exports = router;
