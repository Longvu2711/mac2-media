import { 
  PersonAddOutlined, 
  PersonRemoveOutlined, 
  Visibility, 
  VisibilityOff 
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ 
  friendId, 
  name, 
  subtitle, 
  userPicturePath, 
  postId, 
  isHidden: initialHidden, 
  createdAt 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { palette } = useTheme();
  const [isHidden, setIsHidden] = useState(initialHidden); 

  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  // 🔹 Chuyển đổi `createdAt` thành định dạng "x thời gian trước"
  let formattedDate = "";
  if (createdAt) {
    const parsedDate = new Date(createdAt);
    if (!isNaN(parsedDate)) {
      formattedDate = formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi });
    } else {
      formattedDate = "Không xác định";
    }
  }

  const patchFriend = async () => {
    if (_id === friendId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/users/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách bạn bè:", error);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/posts/${postId}/toggle-visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật trạng thái bài viết");
      }
      setIsHidden((prev) => !prev); 
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => navigate(`/profile/${friendId}`)} 
          sx={{
            "&:hover": { cursor: "pointer" },
          }}
        >
          {/* 🔹 Hiển thị trạng thái bài viết (Công khai / Cá nhân) */}
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": { color: palette.primary.light },
            }}
          >
            {name} {isHidden ? "• Bài viết cá nhân" : "• Bài viết công khai"}
          </Typography>

          {/* 🔹 Hiển thị địa điểm và thời gian đăng bài */}
          <Typography color={medium} fontSize="1rem">
            {subtitle} • {formattedDate}
          </Typography>
        </Box>
      </FlexBetween>

      {_id !== friendId ? (
        <IconButton
          onClick={patchFriend}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      ) : (
        <IconButton
          onClick={handleToggleVisibility}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isHidden ? (
            <Visibility sx={{ color: primaryDark }} />
          ) : (
            <VisibilityOff sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;