import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {

  const navigate = useNavigate();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;


  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 1rem, 2.25rem)"
          color="primary"
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
            Admin Dashboard
        </Typography>
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
            >
          </FlexBetween>
      </FlexBetween>

        <FlexBetween gap="1.75rem">
            <IconButton>
            <Message />
            </IconButton>
            <IconButton>
            <Notifications />
            </IconButton>
            <IconButton>
            <Help />
            </IconButton>
  
            <IconButton>
            <Menu />
            </IconButton>   
        </FlexBetween>
    </FlexBetween>
    );
};

export default Navbar;