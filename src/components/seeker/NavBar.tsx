import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import HealingIcon from "@mui/icons-material/Healing";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Stack, Typography, Tooltip } from "@mui/material";
import { JSX } from "react";
import { Link, useLocation } from "react-router-dom";

export const NavigationRail = (): JSX.Element => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const NavItem = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
        <Tooltip title={label} placement="right" arrow>
            <Link
                to={to}
                style={{
                    textDecoration: "none",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                        padding: "10px 0", // Tăng padding để mục lớn hơn
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.1)", // Hiệu ứng phóng to
                            "& .MuiAvatar-root": {
                                bgcolor: "#1E73BE", // Màu nổi bật khi hover
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Thêm bóng
                            },
                            "& .MuiTypography-root": {
                                color: "#1E73BE",
                                fontWeight: "bold",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "white", // Icon trắng khi hover
                            },
                        },
                        ...(isActive(to) && {
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                width: "5px", // Thanh dọc đậm hơn
                                height: "100%",
                                background: "linear-gradient(180deg, #1E73BE 0%, #90CAF9 100%)", // Gradient cho thanh active
                                borderTopRightRadius: "4px",
                                borderBottomRightRadius: "4px",
                            },
                            "& .MuiAvatar-root": {
                                bgcolor: "#1E73BE", // Màu nổi bật khi active
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Thêm bóng
                            },
                            "& .MuiTypography-root": {
                                color: "#1E73BE",
                                fontWeight: "bold",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "white", // Icon trắng khi active
                            },
                        }),
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: isActive(to) ? "#1E73BE" : "transparent",
                            width: { xs: 50, md: 56 }, // Tăng kích thước avatar
                            height: { xs: 50, md: 56 },
                            transition: "all 0.3s ease",
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Typography
                        align="center"
                        variant="body2"
                        sx={{
                            fontSize: { xs: "0.85rem", md: "1rem" }, // Tăng cỡ chữ
                            fontWeight: isActive(to) ? "bold" : "normal",
                            transition: "all 0.3s ease",
                            color: isActive(to) ? "#1E73BE" : "text.secondary",
                        }}
                    >
                        {label}
                    </Typography>
                </Box>
            </Link>
        </Tooltip>
    );

    return (
        <Box
            sx={{
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                alignItems: "center",
                gap: 2,
                padding:"10px",
                bgcolor: "white",
                top: 0,
                boxShadow: "4px 0 20px rgba(0,0,0,0.15)", // Bóng đậm hơn
                width: { xs: "80px", md: "80px" }, // Tăng chiều rộng
                marginLeft: 0,
                background: "linear-gradient(180deg, #ffffff 0%, #f0f8ff 100%)", // Gradient nhẹ cho nền
                transition: "all 0.3s ease",
                zIndex: 1000,
                "&:hover": {
                    width: { xs: "85px", md: "100px" }, // Phóng to nhẹ khi hover vào rail
                },
            }}
        >
            <Stack direction="column" alignItems="center" gap={1}>
                <Avatar
                    sx={{
                        bgcolor: "#1E73BE", // Màu nổi bật cho nút Add
                        width: { xs: 50, md: 50 },
                        height: { xs: 50, md: 50 },
                        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)", // Bóng đậm
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "rotate(90deg) scale(1.2)", // Hiệu ứng xoay và phóng to
                            bgcolor: "#1565C0", // Màu đậm hơn khi hover
                        },
                    }}
                >
                    <AddIcon sx={{
                        color: "white", // Icon trắng
                        fontSize: { xs: 24, md: 28 }, // Tăng kích thước icon
                    }} />
                </Avatar>
            </Stack>

            <Stack
                direction="column"
                alignItems="center"
                gap={4} // Tăng khoảng cách giữa các mục
                width="100%"
                sx={{
                    "& .MuiAvatar-root": {
                        width: { xs: 50, md: 50 },
                        height: { xs: 50, md: 50 },
                    },
                    "& .MuiTypography-root": {
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        display: { xs: "none", md: "block" }, // Ẩn text trên mobile
                    },
                    "& .MuiSvgIcon-root": {
                        fontSize: { xs: 24, md: 28 }, // Tăng kích thước icon
                        color: "text.secondary",
                    },
                }}
            >
                <NavItem to="/seeker" icon={<HomeIcon />} label="Home" />
                <NavItem to="/seeker/therapy-chat" icon={<HealingIcon />} label="Therapy" />
                <NavItem to="/seeker/history" icon={<HistoryIcon />} label="History" />
                <NavItem to="/seeker/events" icon={<EventIcon />} label="Event" />
                <NavItem to="/seeker/profile" icon={<PersonIcon />} label="Profile" />
            </Stack>
        </Box>
    );
};

export default NavigationRail;