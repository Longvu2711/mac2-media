import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  Download,
} from "@mui/icons-material";
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
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

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
}) => {
  const [isComments, setIsComments] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const liked = "#FF0000";

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

  const isImage = picturePath && /\.(jpg|jpeg|png|gif)$/i.test(picturePath);

  return (
    <>
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />

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
                maxWidth: "100%",
                maxHeight: "400px",
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
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <IconButton onClick={handleShareClick}>
            <ShareOutlined />
          </IconButton>

          {/* Menu Chia Sẻ */}
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
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="📋 Đã sao chép liên kết!"
        />
      </WidgetWrapper>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "10px",
            outline: "none",
            overflowY: "auto",
            maxHeight: "80vh",
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
                <IconButton onClick={() => setIsComments(!isComments)}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>

            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>

          {isComments && (
            <Box mt="1rem">
              {comments.map((comment, i) => (
                <Box key={`${name}-${i}`}>
                  <Divider />
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment}
                  </Typography>
                </Box>
              ))}
              <Divider />
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PostWidget;
