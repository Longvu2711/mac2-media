import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { PeopleAlt, Public } from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const medium = palette.neutral.medium;

  const [showFriendsPosts, setShowFriendsPosts] = useState(false);

  const getPosts = async () => {
    const response = await fetch("http://localhost:8080/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:8080/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getFriendsPosts = async () => {
    const response = await fetch(
      `http://localhost:8080/posts/friends/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else if (showFriendsPosts) {
      getFriendsPosts();
    } else {
      getPosts();
    }
  }, [showFriendsPosts]);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {!isProfile && (
        <WidgetWrapper m="1rem 0" sx = {{position: "sticky", top: "10px" , zIndex: 10}}>
          <Box mb="0.5rem">
            {" "}
            <FlexBetween>
              <Typography color={medium} variant="h4" fontWeight="500">
                {showFriendsPosts ? "Bài đăng của bạn bè" : "Tất cả bài đăng"}
              </Typography>
              <FlexBetween>
                <IconButton
                  onClick={() => setShowFriendsPosts(false)}
                  sx={{
                    color: !showFriendsPosts ? palette.primary.main : medium,
                  }}
                >
                  <Public fontSize="medium" />
                </IconButton>
                <IconButton
                  onClick={() => setShowFriendsPosts(true)}
                  sx={{
                    color: showFriendsPosts ? palette.primary.main : medium,
                  }}
                >
                  <PeopleAlt fontSize="medium" />
                </IconButton>
              </FlexBetween>
            </FlexBetween>
          </Box>
        </WidgetWrapper>
      )}

      {sortedPosts.length === 0 ? (
        <WidgetWrapper m="1rem 0">
          <Box mb="0.5rem">
            <Typography color={medium} variant="h4" fontWeight="500">
              Chưa có bài đăng nào.
            </Typography>
          </Box>
        </WidgetWrapper>
      ) : (
        sortedPosts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )
      )}
    </>
  );
};

export default PostsWidget;
