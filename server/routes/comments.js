import express from 'express';
import { addComment, getComments, updateComment, deleteComment } from '../controllers/comments.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, addComment);
router.get('/:postId', getComments);
router.patch('/:id', verifyToken, updateComment);
router.delete('/:id', verifyToken, deleteComment);

export default router;
