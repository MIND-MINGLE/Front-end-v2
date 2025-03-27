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
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
import SubscriptionPopUp from "../../common/SubscriptionPopUp";
import AppointmentTimer from "../../common/appointmentTimer";

interface RightComponentsProps {
  currentChat: ChatProps | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightComponents = ({ setIsLoading, currentChat }: RightComponentsProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showExtraComponent, setShowExtraComponent] = useState("");
  const [shrink, setShrink] = useState(false);
  const [format, setFormat] = useState<"call" | "video" | null>("call");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
  const [openEmergencyDialog, setOpenEmergencyDialog] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [customEmergencyReason, setCustomEmergencyReason] = useState(""); // For "Other" option
  const [therapist, setTherapist] = useState<Therapist>();
  const [patient, setPatient] = useState<Patient>();
  const [currentAppointment, setCurrentAppointment] = useState<Appointment>();
  const [connectionStatus, setConnectionStatus] = useState("Loading...");
  const [alertIsLoading, setAlertIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);
  const nav = useNavigate();

  useEffect(() => {
    const getAppointment = async () => {
      if (therapist && patient) {
        const currentResponse = await getCurrentAppointment(therapist.therapistId, patient.patientId);
        if (currentResponse.statusCode === 200) {
          setCurrentAppointment(currentResponse.result);
        }
      }
    };
    getAppointment();
  }, [therapist, patient]);

  useEffect(() => {
    const getConnectionStatus = () => {
      setConnectionStatus(
        hubConnection?.state === "Connected"
          ? "Connected"
          : hubConnection?.state === "Connecting"
          ? "Connecting..."
          : "Lost Connection"
      );
    };
    getConnectionStatus();
  }, [hubConnection]);

  useEffect(() => {
    const getTherapist = async () => {
      if (currentChat?.therapistId.trim()) {
        const response = await getTherapistById(currentChat.therapistId);
        if (response.statusCode === 200) {
          setTherapist(response.result);
        }
      }
    };
    const getPatient = async () => {
      if (currentChat?.patientId.trim()) {
        const response = await getPatientByAccountId(currentChat.patientId);
        if (response?.statusCode === 200) {
          setPatient(response.result);
        }
      }
    };
    const initializeChat = async () => {
      setIsLoading(true);
      try {
        const userData = sessionStorage.getItem("account");
        if (!userData) {
          setError("Không tìm thấy thông tin tài khoản");
          return;
        }
        const account = JSON.parse(userData);
        setCurrentAccountId(account.UserId);

        if (currentChat?.chatGroupId) {
          const response = await getGroupChatMessage(currentChat.chatGroupId);
          if (response.isSuccess) {
            setMessages(response.result);
          } else {
            setError("Không thể tải tin nhắn");
          }
        }

        const connection = await connectToChatHub((message) => {
          setMessages((prev) => {
            const isDuplicate = prev.some(
              (m) => m.accountId === message.accountId && m.content === message.content
            );
            return isDuplicate ? prev : [...prev, message];
          });
        });

        if (connection && currentChat?.chatGroupId) {
          setHubConnection(connection);
          await connection.invoke("JoinGroup", currentChat.chatGroupId);
          console.log(`Joined group: ${currentChat.chatGroupId}`);
          setError(null);
        } else if (!connection) {
          setError("Không thể kết nối SignalR");
        }
      } catch (error) {
        console.error("Lỗi khởi tạo chat:", error);
        setError("Không thể kết nối đến server chat");
      }
      setIsLoading(false);
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

  const handleOpenEmergencyDialog = () => {
    setOpenEmergencyDialog(true);
  };

  const handleCloseEmergencyDialog = () => {
    setOpenEmergencyDialog(false);
    setEmergencyReason(""); // Reset reason on close
    setCustomEmergencyReason(""); // Reset custom reason
  };

  const handleCancelEmergency = () => {
    setOpenEmergencyDialog(false);
    setEmergencyReason("");
    setCustomEmergencyReason("");
  };

  const handleEmergencyEnd = async (reason?: string) => {
    setAlertIsLoading(true);
    if (therapist && patient && currentAppointment) {
      const currentLocalAccount = sessionStorage.getItem('account');
      if (currentLocalAccount) {
        const currentAccount: AccountProps = JSON.parse(currentLocalAccount);
        const finalReason = reason || emergencyReason; // Use provided reason or state
        const emergencyEndRequest: EmergencyEndRequest = {
          appointmentId: currentAppointment.appointmentId,
          accountId: currentAccount.UserId,
          reason: finalReason === "Other" ? customEmergencyReason : finalReason,
        };
        const emergencyEndResponse = await createEmergencyEnd(emergencyEndRequest);
        if (emergencyEndResponse.statusCode === 200) {
          alert("Emergency End Success");
          sessionStorage.removeItem("appointment");
          nav("/");
        } else {
          alert("Failed to End Emergency");
        }
      } else {
        alert("Cannot Emergency End - Account Not Found");
      }
    }
    setAlertIsLoading(false);
    setOpenEmergencyDialog(false);
    setEmergencyReason("");
    setCustomEmergencyReason("");
  };

  const handlePremiumFeature = (extraComponent: "video" | "call" | "music" | string, format: "video" | "call" | null) => {
    const subscription = sessionStorage.getItem('package'); 
    if (subscription) {
      if (subscription === "MindMingle Premium") {
        setFormat(format);
        setShowExtraComponent(extraComponent);
        shrinkPage();
      } else if (subscription === "MindMingle Plus") {
        if (format === "video" || extraComponent === "video") {
          handleOpenPopup();
          setFormat(format);
        } else {
          setFormat(format);
          setShowExtraComponent(extraComponent);
          shrinkPage();
        }
      }
    } else {
      handleOpenPopup();
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Predefined emergency reasons
  const emergencyReasons = [
    "Technical Issue",
    "Patient Unresponsive",
    "Harassment",
    "Provocation",
    "Harmful Behaviour",
    "Suicidal Emergency",
    "Medical Emergency",
    "Other",
  ];

  return (
    <>
      <SubscriptionPopUp
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title="This Is Subscription Feature Zone!"
        content="Subscribe now for exclusive services and epic vibes!"
      />
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
          {currentAppointment?.emergencyEndId===null && currentAppointment?.status==="APPROVED"?
            <Box display="flex" gap={2}>
              <IconButton onClick={handleOpenEmergencyDialog}>
                <Icon1 color="error" />
              </IconButton>
              <IconButton onClick={() => handlePremiumFeature("call", "call")}>
                <Icon2 />
              </IconButton>
              <IconButton onClick={() => handlePremiumFeature("call", "video")}>
                <Icon3 />
              </IconButton>
              <IconButton onClick={() => handlePremiumFeature("music", null)}>
                <Icon4 />
              </IconButton>
              <IconButton>
                <Icon5 />
              </IconButton>
            </Box>
          :null}
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
          {currentAppointment?.emergencyEndId===null && currentAppointment?.status==="APPROVED" ? (
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
          ) :
          <>
          <AppointmentTimer getApp={true} popUp={false} />
           <Typography variant="h4" sx={{ color: "#1E73BE", fontWeight: "bold", textAlign: "center", marginBottom: 1 }}>
                    Appointment Has Not Started Yet
            </Typography>
            </>
          }
        </Box>

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
            opacity: 0.8,
          }}
        >
          {connectionStatus}
        </Box>

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
              zIndex: 1000,
            }}
          >
            {error}
          </Box>
        )}

        {/* Updated Emergency End Dialog with Dropdown */}
        <Dialog
          open={openEmergencyDialog}
          onClose={handleCloseEmergencyDialog}
          aria-labelledby="emergency-end-dialog-title"
          aria-describedby="emergency-end-dialog-description"
          sx={{ backgroundColor: "rgba(255, 0, 0, 0.5)" }}
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
            <FormControl fullWidth variant="outlined" color="error" sx={{ mt: 2 }}>
              <InputLabel>Reason for Emergency End</InputLabel>
              <Select
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                label="Reason for Emergency End"
              >
                <MenuItem value="">
                  <em>Select a reason</em>
                </MenuItem>
                {emergencyReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {emergencyReason === "Other" && (
              <TextField
                color="error"
                fullWidth
                variant="outlined"
                label="Specify Reason"
                value={customEmergencyReason}
                onChange={(e) => setCustomEmergencyReason(e.target.value)}
                margin="normal"
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelEmergency}
              color="primary"
              disabled={alertIsLoading}
            >
              No
            </Button>
            <Button
              onClick={() => handleEmergencyEnd()}
              color="error"
              variant="contained"
              disabled={alertIsLoading || !emergencyReason || (emergencyReason === "Other" && !customEmergencyReason)}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default RightComponents;