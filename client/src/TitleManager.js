import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleManager = () => {
    const location = useLocation();

    useEffect(() => {
        const pageTitles = {
            "/": "Đăng nhập - Lotus",
            "/home": "Trang chủ",
            "/admin": "Admin",
            "/admin/dashboard": "Dashboard",
        };

        if (location.pathname.startsWith("/profile")) {
            document.title = "Hồ sơ người dùng";
        } else {
            document.title = pageTitles[location.pathname] || "MyApp";
        }
    }, [location.pathname]);
    return null;
};

export default TitleManager;