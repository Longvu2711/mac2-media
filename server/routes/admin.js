import express from "express";
import { updateUser, deleteUser, updatePost, deletePost } from "../controllers/admin.js";

const router = express.Router();

router.put("/user/:id", updateUser); 
router.delete("/user/:id", deleteUser); 

router.put("/post/:id", updatePost)
router.delete("/post/:id", deletePost)

export default router;