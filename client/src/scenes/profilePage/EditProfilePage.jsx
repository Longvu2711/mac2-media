import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const profileSchema = yup.object().shape({
  firstName: yup.string().required("Không được để trống"),
  lastName: yup.string().required("Không được để trống"),
  location: yup.string().required("Không được để trống"),
  occupation: yup.string().required("Không được để trống"),
  picture: yup.string(),
});

const UserProfileForm = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    occupation: "",
    picture: "",
  });

  useEffect(() => {
    if (user) {
      setInitialValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        location: user.location || "",
        occupation: user.occupation || "",
        picture: user.picturePath || "",
      });
    }
  }, [user]);

  const updateProfile = async (values) => {
    try {
      // Create FormData and append all fields
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("location", values.location);
      formData.append("occupation", values.occupation);

      // Only append picture if it's a new file
      if (values.picture instanceof File) {
        formData.append("picture", values.picture);
      }

      // Send update request
      const response = await fetch(`http://localhost:8080/users/${user._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      // Update Redux state
      dispatch({ type: "SET_USER", payload: data.user });
      toast.success("🎉 Cập nhật thành công!");
      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={updateProfile}
      sx={{
        mt: 3,
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: 3,
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <Typography variant="h5" mb={2}>
        Edit Profile
      </Typography>
      <Formik
        onSubmit={updateProfile}
        initialValues={initialValues}
        enableReinitialize
        validationSchema={profileSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px">
              <TextField
                label="Tên"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <TextField
                label="Họ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
              <TextField
                label="Email"
                value={values.email}
                name="email"
                disabled
              />
              <TextField
                label="Vị trí - Địa chỉ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={Boolean(touched.location) && Boolean(errors.location)}
                helperText={touched.location && errors.location}
              />
              <TextField
                label="Nghề nghiệp"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                helperText={touched.occupation && errors.occupation}
              />

              <Box border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" p="1rem">
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" sx={{ "&:hover": { cursor: "pointer" } }}>
                      <input {...getInputProps()} />
                      {!values.picture ? (
                        <Typography>Chọn ảnh hoặc kéo thả vào đây</Typography>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.picture instanceof File ? values.picture.name : "Ảnh hiện tại"}</Typography>
                          <EditOutlinedIcon />
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>

              {values.picture && typeof values.picture === "string" && (
                <Box mt={2} textAlign="center">
                  <Typography variant="subtitle2">Ảnh hiện tại:</Typography>
                  <img 
                    src={`http://localhost:8080/assets/${values.picture}`} 
                    alt="Avatar" 
                    width="100" 
                    height="100" 
                    style={{ borderRadius: "10px", objectFit: "cover" }} 
                  />
                </Box>
              )}
            </Box>

            <Button
              fullWidth
              type="submit"
              sx={{
                mt: "20px",
                p: "10px",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              CẬP NHẬT
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default UserProfileForm;