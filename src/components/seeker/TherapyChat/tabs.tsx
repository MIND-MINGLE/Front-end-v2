import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAllClientByChatGroupId, getGroupChatByAccountId } from "../../../api/ChatGroup/ChatGroupAPI";
import { AccountProps, ChatProfile, ChatProps, UserInGroup } from "../../../interface/IAccount";
import LoadingScreen from "../../common/LoadingScreen";
import { useNavigate } from "react-router";



interface ChatProfileListProps {
  setCurrentChat: React.Dispatch<React.SetStateAction<ChatProps>>
  isSeeker:boolean
}
const ChatProfileList = ({isSeeker, setCurrentChat }: ChatProfileListProps) => {
  const [profiles, setProfiles] = useState<ChatProfile[]>();
  const [onSelect, setOnSelect] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const nav = useNavigate()
  const returnHome = () => {
    nav("../")
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
  const getChatGroupInfo = async (profile:ChatProfile) => {
    const usersInGroup = await getAllClientByChatGroupId( profile.chatGroupId)
    console.log("usersInGroup:",usersInGroup)
    if(usersInGroup.statusCode===200){
      const otherUser:UserInGroup = isSeeker?
       usersInGroup.result.find((item:UserInGroup) => item.accountName !== profile.adminName)
       :
       usersInGroup.result.find((item:UserInGroup) => item.accountName === profile.adminName)
      console.log("otherUser:",otherUser)
      if(otherUser){
        setCurrentChat({
          chatGroupId: profile.chatGroupId,
          userInGroupId: profile.userInGroupId,
          name: profile.adminName,
          therapistId: profile.adminId,
          patientId: otherUser.clientId,
        }
        )
      }
      else{
        alert("Cannot Open Chat")
      }
    }
}

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
          width: "100%",
          backgroundColor: "none",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
          alignContent: "center"
        }}>
          {Array.isArray(profiles) ? 
            profiles.map((profile) => (
              <Box key={profile.chatGroupId} sx={{
                display: "flex", alignItems: "center",
                backgroundColor: onSelect === profile.chatGroupId ? "#A9D2FF" : "#3d9aff", padding: "10px", borderRadius: "10px", cursor: "pointer"
              }}
                onClick={() => {
                  getChatGroupInfo(profile)
                  setOnSelect(profile.chatGroupId)
                  //alert("Click On Group: "+profile.chatGroupId)
                  // We lost the chat group Id, so SignalR can't connect
                  // JESUS GOD JUST KILL ME ALREADY HOLY HELL
                }}
              >
                <Avatar sx={{ zIndex: 0, bgcolor: "#6BA6FF", marginRight: "10px" }}>{profile.adminName[0]}</Avatar>
                <Box>
                  <Typography fontWeight="bold" color="white">{profile.adminName}</Typography>
                </Box>
                {/* TODO */}
                <Typography sx={{ marginLeft: "auto", color: "white" }}>{ }</Typography>
              </Box>
            ))
           : 
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
          }
        </Box>
      </Box>
    </>
  );
};

export default ChatProfileList;
