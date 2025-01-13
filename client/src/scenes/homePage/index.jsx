import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import ChatWidget from "scenes/widgets/ChatWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const apiKey = "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"; // Replace with your actual API key

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="1rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          sx={
            isNonMobileScreens
              ? {
                  position: "sticky",
                  top: "10rem", 
                }
              : {
              }
          }
        >
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
      
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="1rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
      <ChatWidget apiKey={apiKey} />
    </Box>
  );
};

export default HomePage;
