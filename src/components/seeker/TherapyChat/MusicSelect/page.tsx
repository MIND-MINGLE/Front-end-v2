"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import NavigationRail from "../../NavBar";
import React from "react";
import RightComponents from "./component";

const TherapyChatPage: React.FC = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      border={8}
      borderColor="#cac4d0"
      overflow="hidden"
      position="relative"
      display="flex"
    >
      {/* Video Section */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "570px",
          height: "99vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-152.5%, -50%)",
          background: "#dff6ff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            width: 530, 
            height: "95vh", 
            bgcolor: "#dff6ff", 
            p: 2, 
          }} 
        > 
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              width: 500, 
              height: "95vh", 
              p: 2, 
              borderRadius: 2, 
              border: "1px solid", 
              borderColor: "divider", 
              boxShadow: 3, 
              overflow: "hidden", 
              bgcolor: "white",
            }} 
          > 
            <Box sx={{ mb: 2 }}> 
              <Typography variant="body2" color="black"> 
                Now Playing... 
              </Typography> 
              
              <Typography variant="h6" color="black">
                HELLOHELL (Akatsuki Records)
              </Typography> 
            </Box> 

            <Divider /> 

            <List> 
              {["Song 1", "Song 2", "Song 3"].map((song, index) => ( 
                <ListItem key={index} sx={{ p: 2, borderRadius: 1 }}> 
                  <ListItemIcon> 
                    <StarIcon /> 
                  </ListItemIcon> 
                  <ListItemText 
                    primary={<Typography variant="h6" fontWeight="bold" fontSize="1rem">{song}</Typography>}
                    secondary="Menu description." 
                    sx={{ color: "black" }} 
                  /> 
                </ListItem> 
              ))} 

              <Divider /> 

              <ListItem sx={{ p: 2, borderRadius: 1 }}> 
                <ListItemIcon> 
                  <StarIcon /> 
                </ListItemIcon> 
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold" fontSize="1rem">Random From List</Typography>} 
                  secondary="" 
                  sx={{ color: "black" }} 
                /> 
              </ListItem> 

              <ListItem sx={{ p: 2, borderRadius: 1 }}> 
                <ListItemIcon> 
                  <ArrowBackIcon /> 
                </ListItemIcon> 
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold" fontSize="1rem">Back to chat list</Typography>}
                  secondary="*ps: Don’t worry, your music still plays in the background :3" 
                  sx={{ color: "black" }}
                /> 
              </ListItem> 
            </List>
          </Box> 
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        width="calc(100vw - 379px)"
        height="99vh"
        position="absolute"
        top={0}
        left="649px"
        display="flex"
        flexDirection="column"
      >
        <RightComponents />
      </Box>
      {/* Navigation Sidebar */}
      <Box
        width="88px"
        height="2015px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        pt={2}
        pb={2}
        position="absolute"
        top={0}
        left={0}
        bgcolor="white"
      >
        <NavigationRail />
      </Box>
    </Box>
  );
};

export default TherapyChatPage;
