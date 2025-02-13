"use client";
import {
  Box,
} from "@mui/material";
import NavigationRail from "../../NavBar";
import React from "react";
import EventDetails from "./Components/EventDetails";

const HistoryPage: React.FC = () => {
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
        <Box 
            width="100%"
            height="99vh"
            position="absolute"
            top={0}
            left="88px"
            display="flex"
            flexDirection="column"
        >
          <EventDetails />
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

export default HistoryPage;
