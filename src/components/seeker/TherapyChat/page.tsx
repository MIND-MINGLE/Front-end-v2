
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
  <Box display="flex" flexDirection={{ md: "row" }} height="100%">
    <Box minWidth={250} width={{ xs: "5vw", md: "20vw",marginLeft:70 }}
    paddingLeft={5}
    >
    <ChatProfileList 
      setCurrentChat={setCurrentChat}
    />
  </Box>
  <Box minWidth={600} width={{ xs: "100vw", md: "80vw" }} display="flex" flexDirection="column" alignItems="center">
    <RightComponents
      currentChat={currentChat}
    />
  </Box>
</Box>
    </>
  );
};

export default TherapyChatPage;
