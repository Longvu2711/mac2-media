import Comment from '../models/Comment.js';
import User from "../models/User.js";  
import Post from "../models/Post.js";

export const addComment = async (req, res) => {
    try {
      const { postId, userId, text } = req.body;
  
      const user = await User.findById(userId); 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const newComment = new Comment({
        postId,
        text,
        userId,
        userPicturePath: user.picturePath,
      });
  
      await newComment.save();
      res.status(201).json(newComment);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
  
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (comment.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized action' });
      }
  
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { text },
        { new: true }
      );
      res.status(200).json(updatedComment);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };

  export const deleteComment = async (req, res) => {
    try {
      const { id } = req.params;
  
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (comment.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized action' });
      }
  
      await Comment.findByIdAndDelete(id);
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };