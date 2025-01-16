import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, conversationId, message } = req.body;

    if (!senderId || !receiverId || !conversationId || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      conversationId,
      message,
      isRead: false,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "firstName lastName picturePath")
      .populate("receiverId", "firstName lastName picturePath");

    conversation.lastMessage = populatedMessage;
    await conversation.save();

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Get all messages for the conversation
    const messages = await Message.find({ conversationId })
      .populate("senderId", "firstName lastName picturePath")
      .populate("receiverId", "firstName lastName picturePath")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: req.user._id,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUnreadMessages = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiverId: req.user._id,
      isRead: false,
    });

    res.status(200).json({ unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Conversation Controllers
export const createOrGetConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // Create new conversation if it doesn't exist
      conversation = new Conversation({
        participants: [senderId, receiverId],
        lastMessage: null,
      });
      await conversation.save();
    }

    // Populate participant details
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "firstName lastName picturePath")
      .populate("lastMessage");

    res.status(200).json(populatedConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "firstName lastName picturePath")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLastMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { messageId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: messageId },
      { new: true }
    )
      .populate("participants", "firstName lastName picturePath")
      .populate("lastMessage");

    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not updated" });
    }

    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};