import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getGroupChatByAccountId } from "../../../api/ChatGroup/ChatGroupAPI";
import { AccountProps } from "../../../interface/IAccount";
import LoadingScreen from "../../common/LoadingScreen";
import { useNavigate } from "react-router";

interface ChatProfile {
  chatGroupId: string;
  adminId: string;
  adminName: string;
  userInGroupId: string;
}
interface chatProps {
  chatGroupId: string;
  userInGroupId: string;
}

interface ChatProfileListProps {
  setCurrentChat: React.Dispatch<React.SetStateAction<chatProps>>
}
const ChatProfileList = ({ setCurrentChat }: ChatProfileListProps) => {
  const [profiles, setProfiles] = useState<ChatProfile[]>([]);
  const [onSelect, setOnSelect] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const nav = useNavigate()
  const returnHome = () => {
    nav("/seeker")
  }
  useEffect(() => {
    const fetchGroupChats = async () => {
      setIsLoading(true)
      const data = sessionStorage.getItem("account");
      if (data) {
        const account: AccountProps = JSON.parse(data); // Convert string back to object
        const accountId = account.UserId
        const response = await getGroupChatByAccountId(accountId);
        console.log("Profile: ", response)
        setProfiles(response.result);
      }
      setIsLoading(false)
    };
    fetchGroupChats();
  }, []);

  return (
    <>
      {isLoading ? <LoadingScreen /> : ""}
      <Box padding={0} width="100%" height="100vh" bgcolor="#D0E8FF" color="white">
        {/* Header */}
        <Box sx={{
          width: "auto",
          backgroundColor: "#1E73BE",
          color: "white", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          padding: "5px", paddingTop: "16px", paddingBottom: "16px"
        }}>
          <Typography paddingLeft={"15px"} variant="h6" fontWeight="bold">Therapy Message</Typography>
          <IconButton
            onClick={returnHome}
            sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>


        {/* Chat List */}
        <Box sx={{
          padding: "5px",
          width: "95%",
          backgroundColor: "none",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
          alignContent: "center"
        }}>
          {profiles && profiles.length > 0 ? (
            profiles.map((profile) => (
              <Box key={profile.chatGroupId} sx={{
                display: "flex", alignItems: "center",
                backgroundColor: onSelect === profile.chatGroupId ? "#A9D2FF" : "#3d9aff", padding: "10px", borderRadius: "10px", cursor: "pointer"
              }}
                onClick={() => {
                  setCurrentChat({
                    chatGroupId: profile.chatGroupId,
                    userInGroupId: profile.userInGroupId,
                  }
                  )
                  setOnSelect(profile.chatGroupId)
                  //alert("Click On Group: "+profile.chatGroudId)
                }}
              >
                <Avatar sx={{ zIndex: 0, bgcolor: "#6BA6FF", marginRight: "10px" }}>{profile.adminName[0]}</Avatar>
                <Box>
                  <Typography fontWeight="bold" color="white">{profile.adminName}</Typography>
                  <Typography color="white">{profile.userInGroupId}</Typography>
                </Box>
                {/* TODO */}
                <Typography sx={{ marginLeft: "auto", color: "white" }}>{ }</Typography>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 20px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                textAlign: "center",
                margin: "40px ",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <img
                src="/chat_4574037.png"
                alt="No Messages"
                style={{
                  width: "150px",
                  height: "150px",
                  marginBottom: "20px"
                }}
              />
              <Typography
                variant="h6"
                color="#1E73BE"
                fontWeight="bold"
                gutterBottom
              >
                Chưa có cuộc trò chuyện nào
              </Typography>
              <Typography
                color="#666666"
                sx={{
                  maxWidth: "280px",
                  marginBottom: "20px"
                }}
              >
                Hãy bắt đầu một cuộc trò chuyện mới với chuyên gia tư vấn để được hỗ trợ!
              </Typography>
              <Box
                onClick={() => nav("/seeker")}
                sx={{
                  backgroundColor: "#1E73BE",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  '&:hover': {
                    backgroundColor: "#1557A0"
                  }
                }}
              >
                <Typography>
                  Tìm chuyên gia ngay
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ChatProfileList;
