import mongoose from "mongoose";
import User from "../models/User.js";


export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await User.find({ _id: { $in: user.friends } }).select(
      "_id firstName lastName occupation location picturePath"
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (id === friendId) {
      return res.status(400).json({ message: "Không thể kết bạn với chính mình!" });
    }

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const isFriend = user.friends.includes(friendId);

    if (isFriend) {
      user.friends = user.friends.filter((fid) => fid.toString() !== friendId);
      friend.friends = friend.friends.filter((fid) => fid.toString() !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const updatedFriends = await User.find({ _id: { $in: user.friends } }).select(
      "_id firstName lastName occupation location picturePath"
    );

    res.status(200).json(updatedFriends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, location, occupation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const updateData = {
      firstName,
      lastName,
      location,
      occupation,
    };

    if (req.file) {
      updateData.picturePath = req.file.originalname;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật thành công",
      user: updatedUser
    });

  } catch (err) {
    console.error('Error updating user:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ", 
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: "Lỗi server", 
      error: err.message 
    });
  }
};
