import { Box } from "@mui/material";
import { useState, useEffect } from "react";

const UserImage = ({ image, size = "60px" }) => {
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (image) {
        const response = await fetch(`http://localhost:8080/assets/${image}`);
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob); // Tạo URL cho ảnh từ blob
          setUserImage(imageUrl);
        } else {
          console.error("Không thể tải ảnh từ server");
        }
      }
    };

    fetchImage();
  }, [image]); 

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={userImage}
      />
    </Box>
  );
};

export default UserImage;
