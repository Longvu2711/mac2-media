import { Box, Typography, useTheme, IconButton } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import ChatIcon from "@mui/icons-material/Chat";

const FriendListWidget = ({ userId, onSelectFriend }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const primaryLight = palette.primary.light;

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:8080/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper
      m="1rem 0"
      sx={{ position: "sticky", top: "0px", zIndex: 0 }}
    >
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Danh sách bạn bè - follower
      </Typography>
      <Box display="flex" flexDirection="column" gap="1rem">
        {friends.map((friend) => (
          <Box
            key={friend._id}
            display="flex"
            justifyContent="space-between" 
            alignItems="center" 
            width="100%" 
          >
            <Box flex={1}>
              {" "}
              <Friend
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            </Box>
            <IconButton
              onClick={() => onSelectFriend(friend._id)}
              sx={{
                backgroundColor: primaryLight,
                p: "0.6rem",
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
              }}
            >
              <ChatIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
