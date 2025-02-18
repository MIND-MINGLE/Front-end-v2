
import {
  Avatar,
  Box,
  Divider,
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
      width="100vw"
      height="100vh"
      overflow="hidden"
      position="relative"
      display="flex"
    >
      {/* Sidebar */}
      <Box
        width="12vw"
        minWidth="100px"
        height="100%"
        display="flex"
        flexDirection="column"
        position="absolute"
        top={0}
        left="88px"
        bgcolor="#0077b6"
      >
        <Box
          display="flex"
          minWidth="100px"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
          bgcolor="#0077b6"
        >
          <Typography variant="h6" color="white">
            Therapy Message
          </Typography>
        </Box>
        <List>
          {Array.from({ length: 9 }).map((_, index) => (
            <React.Fragment key={index}>
              <ListItem
                component="button"
                onClick={() => console.log(`Therapist ${index + 1} Clicked`)}
                sx={{
                  borderRadius:"0",
                  height:"15vh",
                  minWidth:"100px",
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
                      Desciption Go Here...
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
        height="100vh"
        position="absolute"
        top={0}
        left="17vw"
        display="flex"
        flexDirection="column"
      >
        <RightComponents />
      </Box>
      {/* Navigation Sidebar */}
        <NavigationRail />
    </Box>
  );
};

export default TherapyChatPage;
