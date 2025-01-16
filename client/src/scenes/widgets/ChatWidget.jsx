import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  useTheme,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const ChatWidget = ({ selectedFriendId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const newMessageRef = useRef(null);
  const isAtBottom = useRef(true);
  const theme = useTheme();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const socket = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (isAtBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToNewMessage = () => {
    newMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollHeight ===
      event.target.scrollTop + event.target.clientHeight;
    isAtBottom.current = bottom;
  };

  useEffect(() => {
    socket.current = io("http://localhost:8080");
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom();
        scrollToNewMessage();
        scrollToBottom();
      });
    }
  }, []);

  useEffect(() => {
    const getFriendDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/users/${selectedFriendId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setSelectedFriend(data);
      } catch (error) {
        console.error("Error fetching friend details:", error);
      }
    };

    if (selectedFriendId) {
      getFriendDetails();
    }
  }, [selectedFriendId, token]);

  useEffect(() => {
    const getOrCreateConversation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/messages/conversations`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderId: user._id,
              receiverId: selectedFriendId,
            }),
          }
        );
        const data = await response.json();
        setConversationId(data._id);
        fetchMessages(data._id);
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    };

    if (selectedFriendId && user._id) {
      getOrCreateConversation();
    }
  }, [selectedFriendId, user._id, token]);

  const fetchMessages = async (convId) => {
    try {
      const response = await fetch(`http://localhost:8080/messages/${convId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: selectedFriendId,
          conversationId: conversationId,
          message: newMessage,
        }),
      });
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
      scrollToNewMessage();
      socket.current.emit("sendMessage", data);
      scrollToBottom();
      inputRef.current.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "350px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "15px 15px 0 0",
        }}
      >
        <Box>
          <img
            style={{ objectFit: "cover", borderRadius: "50%" }}
            alt="user"
            src={`http://localhost:8080/assets/${selectedFriend?.picturePath}`}
            width="30px"
            height="30px"
          />
        </Box>
        <Typography variant="h5">
          {selectedFriend
            ? `${selectedFriend.firstName} ${selectedFriend.lastName}`
            : "Loading..."}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
        onScroll={handleScroll}
      >
        {messages.map((message, index) => {
          const isUserMessage = message.senderId === user._id;

          return (
            <Box
              key={message._id}
              sx={{
                display: "flex",
                flexDirection: isUserMessage ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: isUserMessage ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              {!isUserMessage && (
                <Avatar
                  src={`http://localhost:8080/assets/${message.senderId.picturePath}`}
                  alt={`${message.senderId.firstName} ${message.senderId.lastName}`}
                  sx={{ width: 30, height: 30, mr: 1 }}
                />
              )}
              <Box ref={index === messages.length - 1 ? newMessageRef : null}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: isUserMessage
                      ? theme.palette.primary.main
                      : theme.palette.grey[200],
                    color: isUserMessage ? "white" : "black",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                  >
                    {isUserMessage
                      ? `${message.receiverId.firstName} ${message.receiverId.lastName}`
                      : `${message.senderId.firstName} ${message.senderId.lastName}`}
                  </Typography>
                  <Typography variant="body2">{message.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, display: "block", mt: 0.5 }}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="medium"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
          inputRef={inputRef}
        />
        <IconButton type="submit" color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWidget;
