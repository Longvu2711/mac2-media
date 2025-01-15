import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Không được để trống"),
  lastName: yup.string().required("Không được để trống"),
  email: yup
    .string()
    .email("Email không tồn tại!!")
    .required("Không được để trống"),
  password: yup.string().required("Không được để trống"),
  location: yup.string().required("Không được để trống"),
  occupation: yup.string().required("Không được để trống"),
  picture: yup.string().required("Không được để trống"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không tồn tại")
    .required("Không được để trống email"),
  password: yup.string().required("Không được để trống"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    try {
      const savedUserResponse = await fetch(
        "http://localhost:8080/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!savedUserResponse.ok) {
        throw new Error("Đăng ký thất bại! Vui lòng thử lại.");
      }

      const savedUser = await savedUserResponse.json();
      onSubmitProps.resetForm();

      if (savedUser) {
        alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
        setPageType("login");
      }
    } catch (error) {
      alert(`❌ Lỗi: ${error.message}`);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      if (loggedInResponse.status === 200) {
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
  
        navigate("/home");
      } else if (loggedInResponse.status === 400) {
        alert("Email hoặc mật khẩu không chính xác."); 
      } else {
        const errorData = await loggedInResponse.json();
        alert(`Đăng nhập thất bại: ${errorData.message}`); 
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");  
    }
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="Tên"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Họ"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Vị trí - địa chỉ"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Nghề nghiệp"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png,.gif"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Chọn ảnh hoặc kéo thả vào đây</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Bạn chưa có tài khoản? Đăng ký tại đây."
                : "Trở lại trang đăng nhập."}
            </Typography>
            {isLogin && (
              <Typography
                onClick={() => navigate("/admin")}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                  marginTop: "10px",
                }}
              >
                Admin Page
              </Typography>
            )}
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
