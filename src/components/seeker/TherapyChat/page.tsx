
import {
  Box,
} from "@mui/material";
import NavigationRail from "../NavBar";
import React from "react";
import RightComponents from "./component";
import ChatProfileList from "./tabs";

const TherapyChatPage: React.FC = () => {
  return (
    <>
    <NavigationRail />
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} height="100%" justifyContent="flex-end">
  <Box width={{ xs: "100vw", md: "15vw",marginLeft:"5vw" }}>
    <ChatProfileList />
  </Box>
  <Box width={{ xs: "100vw", md: "85vw" }} display="flex" flexDirection="column" alignItems="center">
    <RightComponents />
  </Box>
</Box>

    </>
  );
};

export default TherapyChatPage;
