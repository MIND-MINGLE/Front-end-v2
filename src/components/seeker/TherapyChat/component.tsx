import { useEffect, useState, useRef } from "react";
import IconComponentNode from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Icon2 from "@mui/icons-material/Mic";
import MoodIcon from "@mui/icons-material/Mood";
import Icon5 from "@mui/icons-material/MoreVert";
import Icon4 from "@mui/icons-material/MusicNote";
import Icon3 from "@mui/icons-material/ScreenShare";
import SendIcon from "@mui/icons-material/Send";
import Icon1 from "@mui/icons-material/Warning";
import { Box, IconButton, InputAdornment, Paper, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import MusicPlaylist from "./MusicSelect";
import CallPage from "./CallPage";
import { getGroupChatMessage } from "../../../api/ChatMessage/ChatMessageAPI";
import { connectToChatHub, sendMessage, ChatMessageRequest } from '../../../api/SignalR/SignalRAPI';
import { HubConnection } from "@microsoft/signalr";
import { AccountProps, Appointment, ChatMessage, ChatProps, EmergencyEndRequest, Patient, Therapist } from "../../../interface/IAccount";
import { getCurrentAppointment } from "../../../api/Appointment/appointment";
import { createEmergencyEnd } from "../../../api/EmergencyEnd/EmergencyEnd";
import { getTherapistById } from "../../../api/Therapist/Therapist";
import { getPatientByAccountId } from "../../../api/Account/Seeker";
import { useNavigate } from "react-router";

interface RightComponentsProps {
  currentChat: ChatProps | null; // Cho phép null
  setIsLoading:React.Dispatch<React.SetStateAction<boolean>>
}


const RightComponents = ({ setIsLoading,currentChat }: RightComponentsProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showExtraComponent, setShowExtraComponent] = useState("");
  const [shrink, setShrink] = useState(false);
  const [format, setFormat] = useState<"call" | "video">("call");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
  const [openEmergencyDialog, setOpenEmergencyDialog] = useState(false); // Added state for dialog
  const [emergencyReason, setEmergencyReason] = useState("");
  const [therapist, setTherapist] = useState<Therapist>();
  const [patient, setPatient] = useState<Patient>();
  const [currentAppointment, setCurrentAppointment] = useState<Appointment>()
  const [connectionStatus, setConnectionStatus] = useState("Loading...");
  const[alertIsLoading, setAlertIsLoading] = useState(false)
  const nav = useNavigate()
  useEffect(()=>{
    const getAppointment = async () => {
      if(therapist!=undefined && patient!=undefined){
      const currentResponse = await getCurrentAppointment(therapist.therapistId,patient.patientId)
      if(currentResponse.statusCode ===200){
        setCurrentAppointment(currentResponse.result);
      }
    }
  }
    getAppointment()
  },[therapist,patient])
  useEffect(()=>{
    const getConnectionStatus = ()=>{
      setConnectionStatus(hubConnection?.state === "Connected"
        ? "Connected"
        : hubConnection?.state === "Connecting"
          ? "Connecting..."
          : "Lost Connection")
    }
    getConnectionStatus()
  },[hubConnection])

  useEffect(() => {
    const getTherapist = async ()=>{
      if(currentChat!=null && currentChat?.therapistId.trim()!==""){
        const response = await getTherapistById(currentChat.therapistId);
        if(response.statusCode === 200){
          setTherapist(response.result);
        }
      }
    } 
    const getPatient = async ()=>{
      if(currentChat!=null && currentChat?.patientId.trim()!==""){
        const response = await getPatientByAccountId(currentChat.patientId);
        if(response?.statusCode === 200){
          setPatient(response.result);
        }
      }
    }
    const initializeChat = async () => {
      setIsLoading(true)
      try {
        // Fetch user data (same as V1)
        const userData = sessionStorage.getItem("account");
        if (!userData) {
          setError("Không tìm thấy thông tin tài khoản");
          return;
        }
        const account = JSON.parse(userData);
        setCurrentAccountId(account.UserId);
  
        // Fetch messages if chat exists (like V1)
        if (currentChat?.chatGroupId) {
          const response = await getGroupChatMessage(currentChat.chatGroupId);
          if (response.isSuccess) {
            setMessages(response.result);
          } else {
            setError("Không thể tải tin nhắn");
          }
        }
  
        // Set up SignalR (inspired by V1)
        const connection = await connectToChatHub((message) => {
          setMessages((prev) => {
            const isDuplicate = prev.some(
              (m) => m.accountId === message.accountId && m.content === message.content
            );
            return isDuplicate ? prev : [...prev, message];
          });
        });
         // Thêm hiển thị trạng thái kết nối
  
        if (connection && currentChat?.chatGroupId) {
          setHubConnection(connection);
          await connection.invoke("JoinGroup", currentChat.chatGroupId);
          console.log(`Joined group: ${currentChat.chatGroupId}`);
          setError(null)
        } else if (!connection) {
          setError("Không thể kết nối SignalR");
        }
      } catch (error) {
        console.error("Lỗi khởi tạo chat:", error);
        setError("Không thể kết nối đến server chat");
      }
      setIsLoading(false)
    };
  
    initializeChat();
    getTherapist();
    getPatient();
    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
    
  }, [currentChat?.chatGroupId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChat) {
      setError("Không có nội dung hoặc phòng chat để gửi");
      return;
    }
  
    try {
      const chatMessage: ChatMessageRequest = {
        accountId: currentAccountId,
        usersInGroupId: currentChat.userInGroupId,
        content: inputMessage.trim(),
        messageStatus: "sent",
      };
  
      setInputMessage("");
      setMessages((prev) => [...prev, { ...chatMessage }]);
      await sendMessage(chatMessage);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      setError("Không thể gửi tin nhắn. Vui lòng thử lại");
    }
  };

  const shrinkPage = () => {
    setShrink(!shrink);
  };

  const handleFormatChange = (newFormat: "call" | "video") => {
    setFormat(newFormat);
  };

  // Added dialog handlers
  const handleOpenEmergencyDialog = () => {
    setOpenEmergencyDialog(true);
  };

  const handleCloseEmergencyDialog = () => {
    setOpenEmergencyDialog(false);
  };

  const handleConfirmEmergency = () => {
   // console.log("Emergency confirmed");
    setOpenEmergencyDialog(false);
  };

  const handleCancelEmergency = () => {
   // console.log("Emergency canceled");
    setOpenEmergencyDialog(false);
  };

  if (error!=null) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  

  const handleEmergencyEnd= async()=>{
    setAlertIsLoading(true)
    if(therapist!=undefined && patient!=undefined && currentAppointment!=undefined){
        const currentLocalAccount = sessionStorage.getItem('account')
        if(currentLocalAccount){
          const currentAccount:AccountProps = JSON.parse(currentLocalAccount)
          const emergencyEndrequest:EmergencyEndRequest={
            appointmentId: currentAppointment.appointmentId,
            accountId: currentAccount.UserId,
            reason: emergencyReason
          }
          const emergencyEndResponse = await createEmergencyEnd(emergencyEndrequest)
          if(emergencyEndResponse.statusCode===200){
            handleConfirmEmergency
            alert("Emergency End Success")
            sessionStorage.removeItem("appointment")
            nav("/")
          }
        }
      else{
        alert("Cannot Emergency End")
        handleConfirmEmergency
      }
    }
    setIsLoading(false)
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
            {currentChat?.name}
          </Typography>
          <Box display="flex" gap={2}>
            <IconButton onClick={handleOpenEmergencyDialog}>
              <Icon1 color="error"/>
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
            {!currentAppointment?.emergencyEndId? 
                 <Box
                 display="flex"
                 alignItems="center"
                 justifyContent="center"
                 gap={2}
                 px={{ xs: 2, md: 4 }}
                 py={1}
                 position="absolute"
                 bottom={0}
                 left={0}
                 width="90%"
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
              :null
            }
     

      </Box>

      {/* Thêm indicator trạng thái kết nối */}
      <Box
        sx={{
          position: 'absolute',
          top: 70,
          right: 20,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: connectionStatus === "Connected" ? '#4caf50' : '#ff9800',
          color: 'white',
          opacity: 0.8
        }}
      >
        {connectionStatus}
      </Box>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: '#f44336',
            color: 'white',
            zIndex: 1000
          }}
        >
          {error}
        </Box>
      )}

      {/* Added Emergency End Dialog */}
      <Dialog
        open={openEmergencyDialog}
        onClose={handleCloseEmergencyDialog}
        aria-labelledby="emergency-end-dialog-title"
        aria-describedby="emergency-end-dialog-description"
        sx={{backgroundColor:"rgba(255, 0, 0, 0.5)"}}
      >
        <DialogTitle id="emergency-end-dialog-title">
          <Box display="flex" alignItems="center" gap={1}>
            <Icon1 color="error" />
            <Typography variant="h6">Emergency End Detected</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="emergency-end-dialog-description">
            EMERGENCY END DETECTED! DO YOU WANT TO PROCEED?
          </DialogContentText>
          <TextField
            color="error"
            fullWidth
            variant="outlined"
            label="Reason for Emergency End"
            value={emergencyReason}
            onChange={(e) => setEmergencyReason(e.target.value)}
            margin="normal"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
          loading={alertIsLoading}
          onClick={handleCancelEmergency} color="primary">
            No
          </Button>
          <Button 
            loading={alertIsLoading}
          onClick={()=>{handleEmergencyEnd()}} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RightComponents;