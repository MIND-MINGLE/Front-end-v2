import { useEffect, useState, useRef } from "react";
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
import { connectToChatHub, sendMessage, disconnectFromChatHub, ChatMessageRequest } from '../../../api/SignalR/SignalRAPI';
import { HubConnection } from "@microsoft/signalr";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

interface RightComponentsProps {
  currentChat: {
    chatGroupId: string;
    userInGroupId: string;
  } | null; // Cho phép null
}

interface ChatMessage {
  accountId: string;
  content: string;
  messageId?: string; // Thêm nếu server hỗ trợ
}

const RightComponents = ({ currentChat }: RightComponentsProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showExtraComponent, setShowExtraComponent] = useState("");
  const [shrink, setShrink] = useState(false);
  const [format, setFormat] = useState<"call" | "video">("call");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState("");
  const [signalRConnection, setSignalRConnection] = useState<HubConnection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = sessionStorage.getItem("account");
        if (!data) {
          setError("Không tìm thấy thông tin tài khoản");
          return;
        }
        const account = JSON.parse(data);
        setCurrentAccountId(account.UserId);

        if (currentChat?.chatGroupId) {
          const response = await getGroupChatMessage(currentChat.chatGroupId);
          if (response.isSuccess) {
            setMessages(response.result);
          } else {
            setError("Không thể tải tin nhắn");
          }
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Đã xảy ra lỗi khi tải tin nhắn");
      }
    };

    fetchMessages();

    connectToChatHub((message) => {
      console.log("📥 Incoming message:", message);
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (m) => m.accountId === message.accountId && m.content === message.content
        );
        return isDuplicate ? prevMessages : [...prevMessages, message];
      });
    }).then((conn) => {
      if (conn) {
        setSignalRConnection(conn);
        conn.invoke("JoinGroup", currentChat?.chatGroupId)
          .then(() => console.log(`Joined group: ${currentChat?.chatGroupId}`))
          .catch((err) => console.error("Error joining group:", err));
      } else {
        console.error("SignalR connection failed!");
      }
    }).catch((err) => console.error("Error connecting to SignalR:", err));

    return () => {
      if (signalRConnection) {
        disconnectFromChatHub();
      }
    };
  }, [currentChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const chatMessage: ChatMessageRequest = {
      accountId: currentAccountId,
      usersInGroupId: currentChat?.userInGroupId || "",
      content: inputMessage,
      messageStatus: "sent",
    };

    setInputMessage("");
    setMessages((prevMessages) => [...prevMessages, { ...chatMessage }]);
    await sendMessage(chatMessage);
  };

  const shrinkPage = () => {
    setShrink(!shrink);
  };

  const handleFormatChange = (newFormat: "call" | "video") => {
    setFormat(newFormat);
  };

  if (!currentChat || !currentChat.chatGroupId) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
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
          Chào mừng đến với Therapy Chat!
        </Typography>
        <Typography variant="body1" sx={{ color: "#666666", textAlign: "center", maxWidth: "500px", lineHeight: 1.6, backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "15px" }}>
          Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu. Các chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn!
        </Typography>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5, backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "15px", maxWidth: "500px", border: "1px solid #e0e0e0" }}>
          <Typography variant="h6" sx={{ color: "#1E73BE", fontWeight: "bold", textAlign: "center", fontSize: "1.1rem" }}>
            Mẹo nhỏ để có trải nghiệm tốt nhất:
          </Typography>
          <Box component="ul" sx={{ color: "#666666", m: 0, pl: 3, '& li': { marginBottom: '6px', '&:last-child': { marginBottom: 0 } } }}>
            <li>Hãy mô tả rõ vấn đề bạn đang gặp phải</li>
            <li>Đặt câu hỏi cụ thể để nhận được lời khuyên chính xác</li>
            <li>Chia sẻ cảm xúc của bạn một cách chân thành</li>
            <li>Lưu lại các lời khuyên hữu ích để tham khảo sau này</li>
          </Box>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1E73BE 0%, #90CAF9 100%)', opacity: 0.5 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" width="100%" height="100%" position="relative" bgcolor="white" overflow="hidden">
      {shrink && (
        <Box width="50%" bgcolor="#f0f0f0" height="100%">
          {showExtraComponent === "music" && <MusicPlaylist />}
          {showExtraComponent === "call" && (
            <CallPage format={format} onFormatChange={handleFormatChange} />
          )}
        </Box>
      )}
      <Box width={shrink ? "50%" : "100%"} height="100%" position="relative" bgcolor="white">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={3}
          py={2}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          bgcolor="#dff6ff"
          boxShadow="0px 4px 4px #00000040"
        >
          <IconButton>
            <IconComponentNode />
          </IconButton>
          <Typography variant="h6" color="#1d1b20" flex={1}>
            Name
          </Typography>
          <Box display="flex" gap={2}>
            <IconButton>
              <Icon1 />
            </IconButton>
            <IconButton onClick={() => { shrinkPage(); setShowExtraComponent("call"); setFormat("call"); }}>
              <Icon2 />
            </IconButton>
            <IconButton onClick={() => { shrinkPage(); setShowExtraComponent("call"); setFormat("video"); }}>
              <Icon3 />
            </IconButton>
            <IconButton onClick={() => { shrinkPage(); setShowExtraComponent("music"); }}>
              <Icon4 />
            </IconButton>
            <IconButton>
              <Icon5 />
            </IconButton>
          </Box>
        </Box>
        <Paper
          elevation={0}
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 200px)",
            justifyContent: "flex-start",
            pt: 0,
            pb: 4,
            px: 0,
            bgcolor: "white",
            overflowY: "auto",
          }}
        >
          <Box display="flex" flexDirection="column" gap={2} px={{ xs: 2, md: 4 }} py={2}>
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                alignSelf={message.accountId === currentAccountId ? "flex-end" : "flex-start"}
                px={3}
                py={2}
                borderRadius="16px"
                sx={{
                  background: message.accountId === currentAccountId ? "#0077b6" : "#f0f0f0",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="body1"
                  color={message.accountId === currentAccountId ? "white" : "black"}
                >
                  {message.content}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        </Paper>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          px={{ xs: 2, md: 4 }}
          py={3}
          position="absolute"
          bottom={0}
          left={0}
          width="100%"
        >
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
                    <SendIcon style={{ color: "#0077b6" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ borderRadius: "10px", border: "2px solid #0077b6" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RightComponents;