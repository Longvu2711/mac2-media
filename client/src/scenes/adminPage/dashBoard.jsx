import React, { useState, useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./dashBoard.css";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 500);
  }, [searchEmail]);


  const handleSearch = () => {
    if (searchEmail.trim() === "") {
      fetchUsers();
    } else {
      const filteredUsers = users.filter(user => user.email.includes(searchEmail));
      setUsers(filteredUsers);
    }
  };


  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  
  return (
    <Box
      className={`dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      sx={{ borderRadius: '10px' }}
    >
      <Navbar toggleSidebar={toggleSidebar} />
      <Box sx={{ padding: 2 }}>
        <FlexBetween sx={{ justifyContent: 'center' }}>
          <TextField
            inputRef={inputRef}
            label="Search by Email"
            variant="outlined"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            sx={{ width: '50%' }}
          />
        </FlexBetween>
        <Typography variant="h6" gutterBottom>
          Thông tin Người dùng
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Họ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Đường dẫn ảnh</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Nghề nghiệp</TableCell>
                <TableCell>Hồ sơ đã xem</TableCell>
                <TableCell>Số lượt hiển thị</TableCell>
                <TableCell>Ngày tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.picturePath}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.occupation}</TableCell>
                  <TableCell>{user.viewedProfile}</TableCell>
                  <TableCell>{user.impressions}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleString("vi-VN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
          Thông tin Bài viết
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ID Người dùng</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Họ</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Đường dẫn ảnh</TableCell>
                <TableCell>Ngày tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>{post._id}</TableCell>
                  <TableCell>{post.userId}</TableCell>
                  <TableCell>{post.firstName}</TableCell>
                  <TableCell>{post.lastName}</TableCell>
                  <TableCell>{post.location}</TableCell>
                  <TableCell>{post.description}</TableCell>
                  <TableCell>{post.userPicturePath}</TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleString("vi-VN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
