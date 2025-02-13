"use client";
import {
  AddCircle,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import NavigationRail from "../NavBar";
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
      {/* Sidebar */}
      <Box
        width="291px"
        height="649px"
        display="flex"
        flexDirection="column"
        position="absolute"
        top={0}
        left="88px"
        bgcolor="#0077b6"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
          bgcolor="#0077b6"
        >
          <Typography variant="h6" color="white">
            {" "}
            Therapy Message{" "}
          </Typography>
          <IconButton onClick={() => console.log("Add Therapy Button Clicked")}>
            <AddCircle style={{ color: "white" }} />
          </IconButton>
        </Box>

        <List>
          {Array.from({ length: 9 }).map((_, index) => (
            <React.Fragment key={index}>
              <ListItem
                component="button"
                onClick={() => console.log(`Therapist ${index + 1} Clicked`)}
                sx={{
                  backgroundColor: "#dff6ff",
                  "&:hover": {
                    backgroundColor: "#c1e7f9",
                  },
                  boxShadow: "none",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={`/thumbnail-${index + 1}.png`} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ color: "black", fontWeight: "bold" }}>
                      Name
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: "black", fontSize: "0.875rem" }}>
                      Supporting line text lorem ipsum dolor sit amet,
                      consectetur.
                    </Typography>
                  }
                />
                <Typography variant="caption" color="textSecondary">
                  10 min
                </Typography>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box
        width="calc(100vw - 379px)"
        height="99vh"
        position="absolute"
        top={0}
        left="379px"
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
