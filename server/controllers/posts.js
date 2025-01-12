import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
      isHidden: false,
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//all posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({
      $or: [{ isHidden: false }, { userId: userId }], 
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//friends Feed
export const getFriendsPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const friendsPosts = await Post.find({
      userId: { $in: user.friends },
      isHidden: false, 
    }).sort({ createdAt: -1 });

    res.status(200).json(friendsPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//user's posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id; 

    const posts = await Post.find({
      userId,
      $or: [{ isHidden: false }, { userId: currentUserId }], 
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const togglePostVisibility = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    // Check if the post belongs to the current user
    if (post.userId !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa bài viết này" });
    }

    post.isHidden = !post.isHidden;
    await post.save();

    res.status(200).json({
      message: `Bài viết đã được ${post.isHidden ? "ẩn" : "hiện"}`,
      isHidden: post.isHidden,  // Returning the updated visibility status
    });
  } catch (error) {
    console.error("Error toggling post visibility:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau.", error: error.message });
  }
};

