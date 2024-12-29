import express from "express";
import {getUser, getAllPosts, getAllUsers, updateUser, deleteUser, updatePost, deletePost, getPost } from "../controllers/admin.js";

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put("/user/:id", updateUser); 
router.delete("/user/:id", deleteUser); 

router.get('/posts', getAllPosts);
router.get('/post/:id', getPost);
router.put("/post/:id", updatePost)
router.delete("/post/:id", deletePost)

export default router;