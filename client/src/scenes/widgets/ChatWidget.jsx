import React, { useState } from "react";
import { Box, IconButton, TextField, Button, Typography, useTheme } from "@mui/material";
import { Close, Chat } from "@mui/icons-material";

const ChatWidget = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(true); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(""); 
  const { palette } = useTheme();   
  const main = palette.primary.main; 
  const secondary = palette.neutral.medium; 
  const background = palette.neutral.medium; 

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (input.trim() === "") return; 

    const userMessage = { sender: "user", text: input }; 
    setMessages([...messages, userMessage]); 
    setInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
          max_tokens: 150,
        }),
      });
      const data = await response.json();
      const botMessage = { sender: "bot", text: data.choices[0].message.content.trim() }; 
      setMessages((prevMessages) => [...prevMessages, botMessage]); 
    } catch (err) {
      console.error("Error sending message:", err); 
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        width: isOpen ? "300px" : "50px",
        height: isOpen ? "400px" : "50px",
        backgroundColor: background,
        borderRadius: "10px",
        boxShadow: 3,
        overflow: "hidden",
        transition: "width 0.3s, height 0.3s", 
      }}
      onClick={() => !isOpen && setIsOpen(true)} 
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: main,
          padding: "0.5rem",
        }}
      >
        <Typography sx={{ color: "white" }}>ChatGPT</Typography>
        <IconButton onClick={handleToggle} sx={{ color: "white" }}>
          {isOpen ? <Close /> : <Chat />} 
        </IconButton>
      </Box>
      {isOpen && (
        <Box sx={{ padding: "1rem", display: "flex", flexDirection: "column", height: "calc(100% - 50px)" }}>
          <Box sx={{ flexGrow: 1, overflowY: "auto", marginBottom: "1rem", backgroundColor: "#f0f0f0", padding: "0.5rem", borderRadius: "5px" }}>
            {messages.map((message, index) => (
              <Typography
                key={index}
                sx={{
                  color: message.sender === "user" ? main : secondary, 
                  marginBottom: "0.5rem",
                  fontWeight: message.sender === "user" ? 'bold' : 'normal', 
                }}
              >
                {message.sender === "user" ? "You: " : "Bot: "}
                {message.text}
              </Typography>
            ))}
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(); 
              }
            }}
            sx={{
              marginBottom: "0.5rem",
              '& .MuiOutlinedInput-root': {
                backgroundColor: background, 
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage} 
            sx={{
              backgroundColor: main,
              "&:hover": {
                backgroundColor: secondary, 
              },
            }}
          >
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatWidget;