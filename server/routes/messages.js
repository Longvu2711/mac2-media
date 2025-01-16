import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createMessage,
  getMessages,
  getUnreadMessages,
  createOrGetConversation,
  getUserConversations,
  updateLastMessage,
} from "../controllers/message.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:conversationId", verifyToken, getMessages);
router.get("/unread/count", verifyToken, getUnreadMessages);

router.post("/conversations", verifyToken, createOrGetConversation);
router.get("/conversations/user/:userId", verifyToken, getUserConversations);
router.patch("/conversations/:conversationId/last-message", verifyToken, updateLastMessage);

export default router;