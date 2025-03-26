import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import HealingIcon from "@mui/icons-material/Healing";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { JSX, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/navbar.css"

export const NavigationRail = (): JSX.Element => {
    const location = useLocation();
    const [packageName, setPackageName] = useState("");

    useEffect(() => {
        const checkPackage = () => {
            const storedPackage = sessionStorage.getItem("package");
            if (storedPackage !== null) {
                setPackageName(storedPackage);
                return true; // Package found, stop checking
            }
            return false; // Keep checking
        };
        if (checkPackage()) return;
        // If not found initially, poll every 500ms
        const interval = setInterval(() => {
            if (checkPackage()) {
                clearInterval(interval); // Stop polling once package is found
            }
        }, 500); // Check every 0.5 seconds

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []); // Empty dependency array since we only run one on mount

    const isActive = (path: string) => location.pathname === path;

    const NavItem = ({ to, icon, label }: { to: string; icon: JSX.Element | null; label: string }) => (
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
                    opacity:icon?1:0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px 0",
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.1)",
                        "& .MuiAvatar-root": {
                            bgcolor: "#1E73BE",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        },
                        "& .MuiTypography-root": {
                            color: "#1E73BE",
                            fontWeight: "bold",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "white",
                        },
                    },
                    ...(isActive(to) && {
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            width: "5px",
                            height: "100%",
                            background: "linear-gradient(180deg, #1E73BE 0%, #90CAF9 100%)",
                            borderTopRightRadius: "4px",
                            borderBottomRightRadius: "4px",
                        },
                        "& .MuiAvatar-root": {
                            bgcolor: "#1E73BE",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        },
                        "& .MuiTypography-root": {
                            color: "#1E73BE",
                            fontWeight: "bold",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "white",
                        },
                    }),
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: isActive(to) ? "#1E73BE" : "transparent",
                        width: { xs: 50, md: 56 },
                        height: { xs: 50, md: 56 },
                        transition: "all 0.3s ease",
                    }}
                >
                    {icon}
                </Avatar>
                {label && (
                    <Typography
                        align="center"
                        variant="body2"
                        sx={{
                            fontSize: { xs: "0.85rem", md: "1rem" },
                            fontWeight: isActive(to) ? "bold" : "normal",
                            transition: "all 0.3s ease",
                            color: isActive(to) ? "#1E73BE" : "text.secondary",
                        }}
                    >
                        {label}
                    </Typography>
                )}
            </Box>
        </Link>
    );

    return (
        <Box
            sx={{
                gap: 2,
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                alignItems: "center",
                padding: "10px",
                bgcolor: "white",
                top: 0,
                boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
                width: { xs: "80px", md: "80px" },
                background: "linear-gradient(180deg, #ffffff 0%, #f0f8ff 100%)",
                transition: "all 0.3s ease",
                zIndex: 1000,
                "&:hover": {
                    width: { xs: "85px", md: "100px" },
                },
            }}
        >
            {/* Buy Premium Package */}
          <Stack direction="column" alignItems="center" sx={{ position: "relative" }} className="subscription-item">
        <Avatar
        sx={{
            bgcolor: "#1E73BE",
            width: { xs: 50, md: 50 },
            height: { xs: 50, md: 50 },
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
                scale: "120%",
                bgcolor: "#1565C0",
            },
            backgroundImage: packageName === "MindMingle Plus" ? "url('/pack1.png')" : packageName === "MindMingle Premium" ? "url('/pack2.png')" : "",
            backgroundSize: "100%",
        }}
    >
        <NavItem to="/seeker/subscription" icon={packageName === "" ? <AddIcon /> : null} label="" />
    </Avatar>
    {/* Custom Tooltip */}
    <Box
    sx={{
        position: "absolute",
        top: "50%",
        left: "100%",
        transform: "translateY(-10%)",
        marginLeft: "30px",
        padding: "20px 25px", // Reduced padding to fit within 200px
        border: "1px solid #1E73BE",
        backgroundColor: "white",
        borderRadius: "6px",
        width: "300px",
        opacity: 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
        zIndex: 1001,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        whiteSpace: "normal", // Allows text to wrap
    }}
    className="custom-tooltip"
>
    <Typography
        variant="h4" // Header style
        sx={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1E73BE", // Distinct color for header
            marginBottom: "8px", // Space between header and body
        }}
    >
       {packageName===""?"Buy Subscription":`Thank You!`}
    </Typography>
   
       {packageName===""?
        <Typography
        variant="h6" // Body style
        sx={{
            fontSize: "18px",
            color: "#333", // Readable color for body text
            lineHeight: 1.4, // Improves readability
        }}
        >
       Purchase a monthly subscription! Enhance your sessions with video calling and lower costs on every appointment. Lighter costs, happier life!
       </Typography>
       :
       <>
       <Typography
       variant="h6" // Body style
       sx={{
           fontSize: "18px",
           color: "#333", // Readable color for body text
           lineHeight: 1.4, // Improves readability
       }}
       >
       You're using: </Typography>
        <Typography
        variant="h5" // Body style
        sx={{
            fontSize: "18px",
            color: "blue", 
            lineHeight: 1.4,
            fontWeight: "bold",
        }}>
       {packageName}
       </Typography>
       </>
    }
</Box>
</Stack>

            {/* Other Navigation Items */}
            <Stack
                direction="column"
                alignItems="center"
                gap={4}
                width="100%"
                sx={{
                    "& .MuiAvatar-root": {
                        width: { xs: 50, md: 50 },
                        height: { xs: 50, md: 50 },
                    },
                    "& .MuiTypography-root": {
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        display: { xs: "none", md: "block" },
                    },
                    "& .MuiSvgIcon-root": {
                        fontSize: { xs: 24, md: 28 },
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