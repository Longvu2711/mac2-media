import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import adminRoutes from "./routes/admin.js";
import messageRoutes from "./routes/messages.js";

import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { createMessage, updateLastMessage } from "./controllers/message.js";  

import User from "./models/User.js";
import Post from "./models/Post.js";
import Message from "./models/Message.js"; 

import { verifyToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/admin", adminRoutes);
app.use("/messages", messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const activeUsers = new Map();

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  socket.on("login", async (userId) => {
    try {
      activeUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(activeUsers);
      io.emit("userOnline", userId);
      
      socket.join(userId);
      
      console.log(`User ${userId} logged in with socket ${socket.id}`);
    } catch (error) {
      console.error("Login error:", error);
    }
  });

  socket.on("joinChat", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined chat: ${conversationId}`);
  });

  // socket.on("sendMessage", async (data) => {
  //   try {
  //     const { senderId, receiverId, conversationId, message } = data;

  //     const newMessage = new Message({
  //       senderId,
  //       receiverId,
  //       conversationId,
  //       message,
  //       isRead: false,
  //     });
  //     await newMessage.save();

  //     await updateLastMessage(conversationId, newMessage._id);

  //     const populatedMessage = await Message.findById(newMessage._id)
  //       .populate("senderId", "firstName lastName picturePath")
  //       .populate("receiverId", "firstName lastName picturePath");

  //     io.to(conversationId).emit("newMessage", populatedMessage);

  //     const receiverSocketId = activeUsers.get(receiverId);
  //     if (receiverSocketId) {
  //       io.to(receiverSocketId).emit("messageNotification", {
  //         message: populatedMessage,
  //         conversationId,
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Message error:", error);
  //     socket.emit("messageError", { error: "Failed to send message" });
  //   }
  // });

  socket.on("typing", (data) => {
    const { conversationId, userId } = data;
    socket.to(conversationId).emit("userTyping", { userId, conversationId });
  });

  socket.on("stopTyping", (data) => {
    const { conversationId, userId } = data;
    socket.to(conversationId).emit("userStopTyping", { userId, conversationId });
  });

  socket.on("markRead", async (data) => {
    try {
      const { conversationId, userId } = data;
      await Message.updateMany(
        {
          conversationId,
          receiverId: userId,
          isRead: false,
        },
        { isRead: true }
      );
      io.to(conversationId).emit("messagesRead", { conversationId, userId });
    } catch (error) {
      console.error("Mark read error:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        activeUsers.delete(user._id.toString());
        await User.findByIdAndUpdate(user._id, { socketId: "" });
        io.emit("userOffline", user._id);
      }
      console.log("User disconnected:", socket.id);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));