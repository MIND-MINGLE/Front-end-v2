import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import HealingIcon from "@mui/icons-material/Healing";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { JSX, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/navbar.css";
import { Subscription } from "../../interface/IAccount";
import MusicPlaylist from "../common/musicpage";


export const NavigationRail = (): JSX.Element => {
  const location = useLocation();
  const [currentPackage, setCurrentPackage] = useState<Subscription | null>(null);
  const [isMusicVisible, setIsMusicVisible] = useState(false); // Toggle visibility with opacity/z-index

  useEffect(() => {
    const checkPackage = () => {
      const storedPackage = sessionStorage.getItem("package");
      if (storedPackage !== null) {
        setCurrentPackage(JSON.parse(storedPackage));
        return true;
      }
      return false;
    };
    if (checkPackage()) return;
    const interval = setInterval(() => {
      if (checkPackage()) {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({
    to,
    icon,
    label,
    onClick,
  }: {
    to: string;
    icon: JSX.Element | null;
    label: string;
    onClick?: () => void;
  }) => (
    <Box
      component={to ? Link : "div"}
      to={to}
      onClick={onClick}
      sx={{
        textDecoration: "none",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          opacity: icon ? 1 : 0,
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
          ...(isActive(to) &&
            to && {
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
            bgcolor: isActive(to) && to ? "#1E73BE" : "transparent",
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
              fontWeight: isActive(to) && to ? "bold" : "normal",
              transition: "all 0.3s ease",
              color: isActive(to) && to ? "#1E73BE" : "text.secondary",
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const handleMusicToggle = () => {
    if (currentPackage) {
      setIsMusicVisible(!isMusicVisible);
    } else {
      alert("Music is a subscription-only feature. Please purchase a plan to access it!");
    }
  };

  return (
    <Box
      sx={{
        gap: 2,
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        alignItems: "center",
        paddingLeft: "0px",
        paddingTop:"1%",
        paddingRight: "0px",
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
            backgroundImage:
              currentPackage?.packageName === "MindMingle Plus"
                ? "url('/pack1.png')"
                : currentPackage?.packageName === "MindMingle Premium"
                ? "url('/pack2.png')"
                : "",
            backgroundSize: "100%",
          }}
        >
          <NavItem to="/seeker/subscription" icon={currentPackage === null ? <AddIcon /> : null} label="" />
        </Avatar>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "100%",
            transform: "translateY(-10%)",
            marginLeft: "30px",
            padding: "20px 25px",
            border: "1px solid #1E73BE",
            backgroundColor: "white",
            borderRadius: "6px",
            width: "300px",
            opacity: 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            zIndex: 1001,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            whiteSpace: "normal",
          }}
          className="custom-tooltip"
        >
          <Typography variant="h4" sx={{ fontSize: "24px", fontWeight: "bold", color: "#1E73BE", marginBottom: "8px" }}>
            {currentPackage === null ? "Buy Subscription" : "Thank You!"}
          </Typography>
          {currentPackage === null ? (
            <Typography variant="h6" sx={{ fontSize: "18px", color: "#333", lineHeight: 1.4 }}>
              Purchase a monthly subscription! Enhance your sessions with video calling and lower costs on every appointment. Lighter costs, happier life!
            </Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontSize: "18px", color: "#333", lineHeight: 1.4 }}>
                You're using:
              </Typography>
              <Typography variant="h5" sx={{ fontSize: "18px", color: "blue", lineHeight: 1.4, fontWeight: "bold" }}>
                {currentPackage?.packageName}
              </Typography>
            </>
          )}
        </Box>
      </Stack>

      {/* Navigation Items */}
      <Stack
        direction="column"
        alignItems="center"
        gap={4}
        width="100%"
        sx={{
          "& .MuiAvatar-root": { width: { xs: 50, md: 50 }, height: { xs: 50, md: 50 } },
          "& .MuiTypography-root": { fontSize: { xs: "0.85rem", md: "1rem" }, display: { xs: "none", md: "block" } },
          "& .MuiSvgIcon-root": { fontSize: { xs: 24, md: 28 }, color: "text.secondary" },
        }}
      >
        <NavItem to="/seeker" icon={<HomeIcon />} label="Home" />
        <NavItem to="/seeker/therapy-chat" icon={<HealingIcon />} label="Therapy" />
        <NavItem to="/seeker/history" icon={<HistoryIcon />} label="History" />
        <div onClick={() => alert("Feature Under Construction! Please Wait Calmly...")}>
          <NavItem to="" icon={<EventIcon />} label="Event" />
        </div>
        {/* Music Tab - Subscription Only, Before Profile */}
        {currentPackage && (
          <NavItem to="" icon={<MusicNoteIcon />} label="Music" onClick={handleMusicToggle} />
        )}
        <NavItem to="/seeker/profile" icon={<PersonIcon />} label="Profile" />
      </Stack>

      {/* MusicPlaylist - Always Mounted, Controlled by Opacity/Z-Index */}
    <Box
        sx={{
            position: "fixed",
            opacity: isMusicVisible && currentPackage ? 1 : 0,
            zIndex: isMusicVisible && currentPackage ? 10: -1000,
            pointerEvents: isMusicVisible && currentPackage ? "auto" : "none",
            transition: "opacity 0.3s ease",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width:"200vw",
            height:"200vw",
        }}  
      >
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: isMusicVisible && currentPackage ? 1 : 0,
          zIndex: isMusicVisible && currentPackage ? 2000 : -1000,
          pointerEvents: isMusicVisible && currentPackage ? "auto" : "none",
          transition: "opacity 0.3s ease",
          width: { xs: "90vw", md: "60vw" },
          maxHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            width: "100%",
            maxHeight: "100%",
            overflowY: "auto",
            p: 2,
          }}
        >
          <MusicPlaylist onClose={() => setIsMusicVisible(false)} />
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default NavigationRail;