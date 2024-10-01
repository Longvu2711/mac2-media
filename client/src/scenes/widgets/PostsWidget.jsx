import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Box, Typography, useTheme } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const medium = palette.neutral.medium;

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

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {sortedPosts.length === 0 ? (
        <Box
          sx={{
            padding: "20px", // Thêm padding 20px
            border: "2px solid #ccc", // Viền màu xám nhạt
            borderRadius: "10px", // Góc bo tròn
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Tạo bóng nhẹ
          }}
        >
          <Typography color={medium} fontSize="2rem">
            No posts yet.
          </Typography>
        </Box>
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
