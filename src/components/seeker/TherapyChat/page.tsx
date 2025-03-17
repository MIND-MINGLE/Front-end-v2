import { Box } from "@mui/material";
import NavigationRail from "../NavBar";
import React, { useState } from "react";
import RightComponents from "./component";
import ChatProfileList from "./tabs";

interface chatProps {
  chatGroupId: string;
  userInGroupId: string;
}

const TherapyChatPage: React.FC = () => {
  const [currentChat, setCurrentChat] = useState<chatProps>({
    chatGroupId: "",
    userInGroupId: "",
  });

  return (
    <>
      <NavigationRail />
      <Box
        display="flex"
        flexDirection={{ md: "row" }}
        height="100vh" // Đặt chiều cao toàn màn hình
        overflow="hidden" // Xóa khoảng trắng và cuộn không cần thiết
      >
        {/* Sidebar */}
        <Box
          minWidth={{ xs: 150, md: 250 }}
          width={{ xs: "5vw", md: "15vw" }}
          marginLeft={{ sx: 0, md: "70px" }}
          paddingLeft={{ sx: 0, md: 5 }}
          bgcolor="#f5f5f5" // Màu nền sidebar
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <ChatProfileList setCurrentChat={setCurrentChat} />
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
          <RightComponents currentChat={currentChat} />
        </Box>
      </Box>
    </>
  );
};

export default TherapyChatPage;
