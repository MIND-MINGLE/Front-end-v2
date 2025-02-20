"use client";
import MicOffIcon from "@mui/icons-material/MicOff"; 
import PhoneIcon from "@mui/icons-material/Phone"; 
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

const NoVideo: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#dff6ff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "60%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            width: 127,
            height: 129,
            borderRadius: "50%",
          }}
          alt="Call Avatar"
          src="/callava.png"
        />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" gap={3} mt={3} mb={2}>
        <IconButton sx={{ backgroundColor: "#00000030", borderRadius: "50%", width: 48, height: 48 }}>
          <MicOffIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
        <IconButton sx={{ backgroundColor: "#ff4040", borderRadius: "50%", width: 48, height: 48 }}>
          <PhoneIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
        <IconButton sx={{ backgroundColor: "green", borderRadius: "50%", width: 48, height: 48 }}>
          <VideocamIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2} color="white">
        <Typography variant="h6" fontWeight="bold">
          John Doe
        </Typography>
        <Typography variant="body2" fontStyle="italic" color="#e0e0e0">
          Live on call
        </Typography>
      </Box>
    </Box>
  );
};

export default NoVideo;
