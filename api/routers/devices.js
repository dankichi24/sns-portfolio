const express = require("express");
const multer = require("multer");
const {
  addDevice,
  getDevices,
  deleteDevice,
} = require("../controllers/deviceController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// デバイス登録
router.post("/add", upload.single("image"), addDevice);

// デバイス一覧取得
router.get("/", getDevices);

// デバイス削除
router.delete("/delete/:deviceId", deleteDevice);

module.exports = router;
