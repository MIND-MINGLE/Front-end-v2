
import {
  Box,
} from "@mui/material";
import NavigationRail from "../NavBar";
import React, { useState } from "react";
import RightComponents from "./component";
import ChatProfileList from "./tabs";
interface chatProps{
  chatGroupId: string;
  userInGroupId: string;
}

const TherapyChatPage: React.FC = () => {
  const [currentChat,setCurrentChat] = useState<chatProps>({
    chatGroupId:"",
    userInGroupId:""
  })
  return (
    <>
    <NavigationRail />
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} height="100%" justifyContent="flex-end">
  <Box width={{ xs: "100vw", md: "15vw",marginLeft:"5vw" }}>
    <ChatProfileList 
      setCurrentChat={setCurrentChat}
    />
  </Box>
  <Box width={{ xs: "100vw", md: "85vw" }} display="flex" flexDirection="column" alignItems="center">
    <RightComponents
      currentChat={currentChat}
    />
  </Box>
</Box>
    </>
  );
};

export default TherapyChatPage;
