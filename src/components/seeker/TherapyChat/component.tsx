import { useEffect, useState } from "react";
import IconComponentNode from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Icon2 from "@mui/icons-material/Mic";
import MoodIcon from "@mui/icons-material/Mood";
import Icon5 from "@mui/icons-material/MoreVert";
import Icon4 from "@mui/icons-material/MusicNote";
import Icon3 from "@mui/icons-material/ScreenShare";
import SendIcon from "@mui/icons-material/Send";
import Icon1 from "@mui/icons-material/Settings";
import { Box, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import MusicPlaylist from "./MusicSelect";
import CallPage from "./CallPage";
import { getGroupChatMessage } from "../../../api/ChatMessage/ChatMessageAPI";
import { connectToChatHub, sendMessage, disconnectFromChatHub,ChatMessageRequest } from '../../../api/SignalR/SignalRAPI';

interface RightComponentsProps {
  currentChat: chatProps;
}

interface ChatMessage {
  accountId: string;
  content: string;
}

interface chatProps {
  chatGroupId: string;
  userInGroupId: string;
}

const RightComponents = ({ currentChat }: RightComponentsProps) => {
  const [showExtraComponent, setShowExtraComponent] = useState("");
  const [shrink, setShrink] = useState(false);
  const [format, setFormat] = useState("video");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const data = sessionStorage.getItem("account");
      if (data) {
        const account = JSON.parse(data);
        setCurrentAccountId(account.UserId);
        if (currentChat) {
          const response = await getGroupChatMessage(currentChat.chatGroupId);
          if (response.isSuccess) {
            setMessages(response.result);
          }
        }
      }
    };

    fetchMessages();

    // Connect to SignalR and listen for messages
    connectToChatHub((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      disconnectFromChatHub();
    };
  }, [currentChat]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const chatMessage: ChatMessageRequest = {
      accountId: currentAccountId,
      usersInGroupId: currentChat.userInGroupId,
      content: inputMessage,
      messageStatus: "sent",
    };
    setMessages([
      ...messages,
      chatMessage
    ])

    await sendMessage(chatMessage);
    setInputMessage("");
  };
  const shrinkPage = () => {
    setShrink(!shrink);
  };

  return (
    <Box display="flex" width="90%" height="100%" position="relative" bgcolor="white">
      {shrink && (
        <Box width="50%" bgcolor="#f0f0f0" height="100%">
          {showExtraComponent === "music" && <MusicPlaylist />}
          {showExtraComponent === "call" && <CallPage format={format} />}
        </Box>
      )}
      {currentChat.chatGroupId === "" ? (
        ""
      ) : (
        <Box width={shrink ? "50%" : "100%"} height="100%" position="relative" bgcolor="white">
          {/* HEADER BOX - DO NOT REMOVE */}
          <Box display="flex" alignItems="center" justifyContent="space-between" px={3} py={2} position="absolute" top={0} left={0} width="100%" bgcolor="#dff6ff" boxShadow="0px 4px 4px #00000040">
            <IconButton>
              <IconComponentNode />
            </IconButton>
            <Typography variant="h6" color="#1d1b20" flex={1}>Name</Typography>
            <Box display="flex" gap={2}>
              <IconButton><Icon1 /></IconButton>
              <IconButton onClick={() => { shrinkPage(); setShowExtraComponent("call"); setFormat("call"); }}><Icon2 /></IconButton>
              <IconButton onClick={() => { shrinkPage(); setShowExtraComponent("call"); setFormat("video"); }}><Icon3 /></IconButton>
              <IconButton onClick={() => { shrinkPage(); setShowExtraComponent("music"); }}><Icon4 /></IconButton>
              <IconButton><Icon5 /></IconButton>
            </Box>
          </Box>

          {/* MESSAGES BOX */}
          <Paper elevation={0} sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", pt: 0, pb: 4, px: 0, bgcolor: "white" }}>
            <Box display="flex" flexDirection="column" gap={2} px={{ xs: 2, md: 4 }} py={2}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignSelf={message.accountId === currentAccountId ? "flex-end" : "flex-start"}
                  px={3}
                  py={2}
                  borderRadius="16px"
                  sx={{ background: message.accountId === currentAccountId ? "#0077b6" : "#f0f0f0" }}
                >
                  <Typography variant="body1" color={message.accountId === currentAccountId ? "white" : "black"}>
                    {message.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* INPUT BOX */}
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} px={{ xs: 2, md: 4 }} py={3} position="absolute" bottom={0} left={0} width="100%">
            <IconButton>
              <AddCircleIcon />
            </IconButton>
            <IconButton>
              <MoodIcon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Text messages here"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconComponentNode />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage}>
                      <SendIcon style={{color:"#0077b6"}} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: "10px", border: "2px solid #0077b6" }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RightComponents;
