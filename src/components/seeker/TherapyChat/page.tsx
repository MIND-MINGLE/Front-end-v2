import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RightComponents from "./component";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ChatProfileList from "./tabs";
import { ChatProps } from "../../../interface/IAccount";
import LoadingScreen from "../../common/LoadingScreen";


const TherapyChatPage: React.FC = () => {
  const [currentChat, setCurrentChat] = useState<ChatProps>({
    chatGroupId: "",
    userInGroupId: "",
    name:"",
    therapistId:"",
    patientId:"",
  });
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [isSeeker, setIsSeeker] = useState(false);
  useEffect(()=>{
    const sessionAccount = sessionStorage.getItem('account');
    if(sessionAccount){
        const data = JSON.parse(sessionAccount)
        setIsSeeker(data.Role === "seeker"?true:false)
    }
  },[currentChat])
  return (
    <>
    {isLoading? <LoadingScreen/>:null}
      <Box
        display="flex"
        flexDirection={{ md: "row" }}
        height="98vh" // Đặt chiều cao toàn màn hình
        
      >
        {/* Sidebar */}
        <Box
          minWidth={{ xs: 150, md: 250 }}
          width={{ xs: "5vw", md: "vw" }}
          marginLeft={{ sx: 0, md: isSeeker?"50px":0 }}
          paddingLeft={{ sx: 0, md: isSeeker?5:0 }}
          display="flex"
          flexDirection="column"
          bgcolor="#D0E8FF"
        >
          <ChatProfileList setIsLoading={setIsLoading} isSeeker={isSeeker} setCurrentChat={setCurrentChat} />
        </Box>

        {/* Main Content */}
        <Box
          minWidth={{ xs: "95vw", md: "70vw" }}
          width={{ xs: "95vw", md: "85vw" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center" // Đảm bảo nội dung căn giữa
          bgcolor="#ffffff" // Màu nền chính
        >
          {!currentChat || currentChat.chatGroupId.trim().length === 0?
          <NoChatRoom/>:
          <RightComponents setIsLoading={setIsLoading} currentChat={currentChat} />
          }
         
        </Box>
      </Box>
    </>
  );
  function NoChatRoom(){
    return(
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "-100px",
          backgroundColor: "#ffffff",
          gap: 3,
          padding: 4,
          position: "relative",
          pt: "20%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        >
          <EmojiEmotionsOutlinedIcon sx={{ fontSize: 40, color: "#1E73BE", transform: "rotate(-10deg)" }} />
          <ChatBubbleOutlineIcon sx={{ fontSize: 50, color: "#1E73BE" }} />
          <SentimentSatisfiedAltIcon sx={{ fontSize: 40, color: "#1E73BE", transform: "rotate(10deg)" }} />
        </Box>
        <Typography variant="h4" sx={{ color: "#1E73BE", fontWeight: "bold", textAlign: "center", marginBottom: 1 }}>
          Welcome To Therapy Chat!
        </Typography>
        <Typography variant="body1" sx={{ color: "#666666", textAlign: "center", maxWidth: "500px", lineHeight: 1.6, backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "15px" }}>
          Click on the therapist's name on the left to start a conversation.
        </Typography>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5, backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "15px", maxWidth: "500px", border: "1px solid #e0e0e0" }}>
          <Typography variant="h6" sx={{ color: "#1E73BE", fontWeight: "bold", textAlign: "center", fontSize: "1.1rem" }}>
            Tips for Effective Communication
          </Typography>
          <Box component="ul" sx={{ color: "#666666", m: 0, pl: 3, '& li': { marginBottom: '6px', '&:last-child': { marginBottom: 0 } } }}>
            <li>Describes clearly of your current sistuation Hãy mô tả rõ vấn đề bạn đang gặp phải</li>
            <li>Ask question in the manner of utmost percision to ensure the best answer </li>
            <li>Sincerely open up about your feelings for us to better understand you </li>
            <li>Take note and enjoy!</li>
          </Box>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1E73BE 0%, #90CAF9 100%)', opacity: 0.5 }} />
      </Box>
    )
  }
};

export default TherapyChatPage;
