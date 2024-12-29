import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
        Banner quảng cáo
        </Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:8080/assets/zalo.gif"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Ứng dụng nhắn tin</Typography>
        <Typography color={medium}>Zalo Việt Nam</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
      Zalo là một ứng dụng nhắn tin nhanh đa nền tảng được phát triển bởi công ty VNG ở Việt Nam. Ngoài Việt Nam, ứng dụng này còn được sử dụng tại các quốc gia như Hoa Kỳ, Nhật Bản, Hàn Quốc, Úc, Đức, Myanmar và Singapore.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;