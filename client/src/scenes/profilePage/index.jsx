import { Box, useMediaQuery, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
// import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate(); 

  const getUser = async () => {
    const response = await fetch(`http://localhost:8080/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="1rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="center"
      >
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          m="1rem 0"
        >
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="1rem 0" />
          <FriendListWidget userId={userId} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
          {/* <MyPostWidget picturePath={user.picturePath} /> */}
          <Box m="1rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>

      <IconButton
        color="primary"
        onClick={() => navigate(`/profile/${userId}/edit`)}
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          minWidth: "auto",
          bgcolor: "primary.main",
          color: "white",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        <EditOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default ProfilePage;
