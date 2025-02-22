import {
  EditOutlined,
  DeleteOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    if (!post && !image) return; 

    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(`http://localhost:8080/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage(null);
    setPost("");
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <textarea
          placeholder="Bạn muốn viết gì đó không?..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Ngăn Enter tạo dòng mới
              handlePost(); // Gửi bài viết
            }
          }}
          style={{
            fontSize: "1rem",
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "1rem",
            padding: "1rem",
            resize: "none",
            height: isFocused ? "10rem" : "5rem",
            transition: "height 0.3s ease",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png,.gif,.mp4,.mp3,.mov,.webp"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} accept=".jpg,.jpeg,.png,.gif,.mp4,.mp3,.mov,.webp" />
                  {!image ? <p>Chọn ảnh hoặc kéo thả vào đây</p> : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton onClick={() => setImage(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      <Divider sx={{ margin: "2rem 0" }} />
      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain, fontSize: "2rem" }} />
          <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
            Ảnh
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
              <GifBoxOutlined sx={{ color: mediumMain, fontSize: "2rem" }} />
              <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
                Ảnh động
              </Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post && !image}
          onClick={handlePost}
          sx={{
            color: palette.background.default,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          Đăng tin
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;