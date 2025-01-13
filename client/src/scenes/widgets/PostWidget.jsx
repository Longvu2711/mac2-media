import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  Download,
} from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Snackbar,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  filePath,
  userPicturePath,
  likes,
  comments,
  isHidden,
  createdAt,
  updatedAt,
}) => {
  const [commentsList, setCommentsList] = useState([]);
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const liked = "#FF0000";
  const medium = palette.neutral.medium;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserName = useSelector((state) => state.user.name);
  const loggedInUserPicturePath = useSelector(
    (state) => state.user.picturePath
  );
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const navigate = useNavigate();

  const patchLike = async () => {
    const response = await fetch(`http://localhost:8080/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/comments/${postId}?page=1&limit=5`
      );
      const data = await response.json();
      setCommentsList(data);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleToggleComments = () => {
    if (!isComments) {
      fetchComments();
    }
    setIsComments(!isComments);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(`http://localhost:8080/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          userId: loggedInUserId,
          text: newComment,
          userName: loggedInUserName,
          userPicturePath: loggedInUserPicturePath,
        }),
      });

      const data = await response.json();
      setCommentsList([data, ...commentsList]);
      setNewComment("");
      comments.push(data);
    } catch (err) {
      console.error("Lỗi khi thêm bình luận:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setCommentsList(
          commentsList.filter((comment) => comment._id !== commentId)
        );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (err) {
      console.error("Lỗi khi xóa bình luận:", err);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleShareClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCopyLink = async () => {
    const postLink = `http://localhost:3000/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(postLink);
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Lỗi khi sao chép:", err);
    }
    handleClose();
  };

  const handleShareFacebook = () => {
    const postLink = `http://localhost:3000/posts/${postId}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        postLink
      )}`,
      "_blank"
    );
    handleClose();
  };

  const isImage =
    picturePath && /\.(jpg|jpeg|png|gif|webp|mp4|mp3|mov)$/i.test(picturePath);

  return (
    <>
      <WidgetWrapper m="1rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          postId={postId}
          userPicturePath={userPicturePath}
        />

        <Divider sx={{ margin: "1rem 0" }} />

        <Box onClick={() => setOpenModal(true)} sx={{ cursor: "pointer" }}>
          <Typography
            color={main}
            sx={{
              mt: "1rem",
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            {description}
          </Typography>
          {isImage ? (
            <img
              src={`http://localhost:8080/assets/${picturePath}`}
              alt="post"
              style={{
                borderRadius: "0.75rem",
                marginTop: "0.75rem",
                width: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : filePath ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Download />}
              sx={{ mt: "1rem" }}
              href={`http://localhost:8080/assets/${filePath}`}
              download
            >
              Tải xuống file
            </Button>
          ) : null}
        </Box>
        <Divider sx={{ margin: "1rem 0" }} />

        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: liked }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={handleToggleComments}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{commentsList.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Typography sx={{ color: main, fontSize: "0.875rem" }}>
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </Typography>
            <IconButton onClick={handleShareClick}>
              <ShareOutlined />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleCopyLink}>📋 Sao chép liên kết</MenuItem>
            <MenuItem onClick={handleShareFacebook}>
              📢 Chia sẻ lên Facebook
            </MenuItem>
          </Menu>
        </FlexBetween>

        {isComments && (
          <Box mt="0.5rem">
            {commentsList.map((comment, i) => (
              <Box key={comment._id}>
                <Divider sx={{ margin: "0.5rem 0" }} />
                <Box
                  display="flex"
                  alignItems="center"
                  gap="0.5rem"
                  pl="1rem"
                  py="0.5rem"
                >
                  <img
                    src={`http://localhost:8080/assets/${comment.userPicturePath}`}
                    alt="user"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/profile/${comment.userId}`)}
                  />
                  <Box flexGrow={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/profile/${comment.userId}`)}
                    >
                      <Typography sx={{ color: main, fontWeight: "bold" }}>
                        {comment.userName}
                      </Typography>
                      <Typography sx={{ color: medium, fontSize: "0.75rem" }}>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: main, mt: "0.25rem" }}>
                      {comment.text}
                    </Typography>
                  </Box>
                  {comment.userId === loggedInUserId && (
                    <IconButton
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
            <Divider />
            <Box mt="1rem">
              <TextField
                fullWidth
                label="Thêm bình luận"
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment();
                  }
                }}
              />
            </Box>
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="📋 Đã sao chép liên kết!"
        />
      </WidgetWrapper>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        transitionDuration={100}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            transition:
              "backdrop-filter 0.1s ease-in-out, background-color 0.1s ease-in-out",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "1000px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "10px",
            outline: "none",
            overflowY: "auto",
            maxHeight: "800px",
            padding: "3rem",
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <Close />
          </IconButton>

          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            postId={postId}
            userPicturePath={userPicturePath}
          />

          <Typography
            color={main}
            sx={{
              mt: "1rem",
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            }}
          >
            {description}
          </Typography>

          {isImage ? (
            <img
              src={`http://localhost:8080/assets/${picturePath}`}
              alt="post"
              style={{
                borderRadius: "10px",
                marginTop: "1rem",
                width: "100%",
                maxHeight: "600px",
                objectFit: "contain",
              }}
            />
          ) : filePath ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Download />}
              sx={{ mt: "1rem" }}
              href={`http://localhost:8080/assets/${filePath}`}
              download
            >
              Tải xuống file
            </Button>
          ) : null}

          <FlexBetween mt="1rem">
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <IconButton onClick={patchLike}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: liked }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{likeCount}</Typography>
              </FlexBetween>

              <FlexBetween gap="0.3rem">
                <IconButton onClick={handleToggleComments}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{commentsList.length}</Typography>
              </FlexBetween>
            </FlexBetween>

            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>

          {isComments && (
            <Box mt="1rem">
              {commentsList.map((comment, i) => (
                <Box key={comment._id}>
                  <Divider />
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="0.5rem"
                    pl="1rem"
                    py="0.5rem"
                  >
                    <img
                      src={`http://localhost:8080/assets/${comment.userPicturePath}`}
                      alt="user"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/profile/${comment.userId}`)}
                    />
                    <Box flexGrow={1}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/profile/${comment.userId}`)}
                      >
                        <Typography sx={{ color: main, fontWeight: "bold" }}>
                          {comment.userName}
                        </Typography>
                        <Typography sx={{ color: medium, fontSize: "0.75rem" }}>
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: main, mt: "0.25rem" }}>
                        {comment.text}
                      </Typography>
                    </Box>
                    {comment.userId === loggedInUserId && (
                      <IconButton
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
              <Divider />
              <Box mt="1rem">
                <TextField
                  fullWidth
                  label="Thêm bình luận"
                  variant="outlined"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment();
                    }
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PostWidget;
