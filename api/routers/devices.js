/**
 * デバイス管理用ルーティング定義
 *
 * @module routes/device
 * @description
 * ユーザーのデバイス（ゲーム機やPC等）の登録・一覧取得・削除のAPIエンドポイントを提供する。
 *
 * - POST   /add           : デバイス新規登録（画像アップロード対応）
 * - GET    /              : デバイス一覧取得（userIdクエリでユーザー絞り込み）
 * - DELETE /delete/:deviceId : デバイス削除
 *
 * 画像アップロードにはmulterのmemoryStorageを利用。
 */

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
