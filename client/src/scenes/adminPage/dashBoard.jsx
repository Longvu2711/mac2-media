import React, { useState, useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("");
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
      const filteredUsers = users.filter((user) =>
        user.email.includes(searchEmail)
      );
      setUsers(filteredUsers);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:8080/admin/user/${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await fetch(`http://localhost:8080/admin/post/${postId}`, {
        method: "DELETE",
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleOpenConfirmDialog = (type, target) => {
    setDeleteType(type);
    setDeleteTarget(target);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setDeleteTarget(null);
    setDeleteType("");
  };

  const handleConfirmDelete = () => {
    if (deleteType === "user") {
      handleDeleteUser(deleteTarget);
    } else if (deleteType === "post") {
      handleDeletePost(deleteTarget);
    }
    handleCloseConfirmDialog();
  };

  const handleToggleVisibility = async (postId, currentVisibility) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/post/${postId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isHidden: !currentVisibility }),
        }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật trạng thái bài viết");
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, isHidden: !currentVisibility } : post
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ padding: 2 }}>
        <FlexBetween sx={{ justifyContent: "center" }}>
          <TextField
            inputRef={inputRef}
            label="Search by Email"
            variant="outlined"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            sx={{ width: "50%" }}
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
                <TableCell>Số lượt tương tác</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.picturePath ? (
                      <img
                        src={`http://localhost:8080/assets/${user.picturePath}`}
                        alt="User"
                        style={{ width: "150px", height: "150px" , borderRadius: "50%" }}
                      />
                    ) : (
                      "Không có avatar"
                    )}
                  </TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.occupation}</TableCell>
                  <TableCell>{user.viewedProfile}</TableCell>
                  <TableCell>{user.impressions}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenConfirmDialog("user", user._id)}
                    >
                      Xoá
                    </Button>
                  </TableCell>
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
                <TableCell>Người đăng</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Đường dẫn ảnh</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>{post._id}</TableCell>
                  <TableCell>{`${post.firstName} ${post.lastName}`}</TableCell>
                  <TableCell>{post.description}</TableCell>
                  <TableCell sx={{ width: "400px", height: "400px" }}>
                    {post.picturePath ? (
                      <img
                        src={`http://localhost:8080/assets/${post.picturePath}`}
                        alt="Post"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    ) : (
                      "Không có ảnh"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>{post.isHidden ? "Ẩn" : "Công khai"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenConfirmDialog("post", post._id)}
                    >
                      Xóa
                    </Button>

                    <Button
                      variant="contained"
                      color={post.isHidden ? "primary" : "warning"}
                      onClick={() =>
                        handleToggleVisibility(post._id, post.isHidden)
                      }
                    >
                      {post.isHidden ? "Hiện bài viết" : "Ẩn bài viết"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa{" "}
            {deleteType === "user" ? "người dùng" : "bài viết"} này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
