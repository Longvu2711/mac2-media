import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id", verifyToken, upload.single("picture"), updateUser);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;



