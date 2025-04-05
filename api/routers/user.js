const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  updateUsername,
  uploadProfileImage,
  getUserById,
} = require("../controllers/userController");

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "認証成功", user: req.user });
});

router.get("/:userId", getUserById);
router.put("/update-username", authenticateToken, updateUsername);

router.post(
  "/upload-profile-image",
  authenticateToken,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;
