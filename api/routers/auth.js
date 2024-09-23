const router = require("express").Router();
const { registerUser, loginUser } = require("../controllers/authController"); // コントローラをインポート

// 新規ユーザー登録
router.post("/register", registerUser);

// ログイン
router.post("/login", loginUser);

module.exports = router;
