import express from "express";
import { getFeedPosts, getUserPosts, likePost,getFriendsPosts, togglePostVisibility } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);
router.get("/friends/:userId", verifyToken, getFriendsPosts);
router.patch("/:postId/toggle-visibility", verifyToken, togglePostVisibility);

// router.get("/", getFeedPosts);
// router.get("/:userId/posts", getUserPosts);
// router.patch("/:id/like", likePost);

export default router;