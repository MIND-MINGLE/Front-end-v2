import { useEffect, useState } from "react";
import { Appointment } from "../../interface/IAccount"; // Assuming this is where your interface is defined
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import for navigation

interface AppointmentTimerProps {
  getApp: boolean;
  popUp:boolean;
}

export default function AppointmentTimer({ getApp,popUp }: AppointmentTimerProps) {
  const [currentApp, setCurrentApp] = useState<Appointment | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const navigate = useNavigate(); // Hook for navigation

  // Fetch the current appointment from sessionStorage
  useEffect(() => {
    const getCurrentAppointment = () => {
      const currentList = sessionStorage.getItem("appointment");
      if (currentList) {
        const appointments: Appointment[] = JSON.parse(currentList);
        setCurrentApp(appointments[0]); // Set the first appointment
        console.log("currentApp: ", appointments[0]);
      }else{
        setCurrentApp(null)
      }
    };
    getCurrentAppointment();
  }, [getApp]);

  // Countdown timer logic
  useEffect(() => {
    if (!currentApp?.session?.startTime) return;

    const calculateTimeLeft = () => {
      const startTime = new Date(currentApp.session.startTime).getTime();
      const now = new Date().getTime();
      const difference = startTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setOpenDialog(true); // Open dialog when timer reaches zero
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount or when currentApp changes
  }, [currentApp]);

  // Handle navigation when the button in the dialog is clicked
  const handleNavigate = () => {
    setOpenDialog(false); // Close the dialog
    navigate("therapy-chat"); // Navigate to the chat page (adjust the path as needed)
  };

  return (
    <>
    {currentApp?
    <>
      <Paper
        elevation={3}
        sx={popUp?{ 
          position: "fixed",
          top: 16,
          right: 16,
          padding: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
          zIndex: 1000,
          minWidth: "200px",
          textAlign: "center",
        }:{
          position: "fixed",
          bottom: 16,
          right: 16,
          padding: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
          zIndex: 1000,
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Appointment Starts In
        </Typography>
        <Box display="flex" justifyContent="space-around" gap={1}>
          <Box>
            <Typography variant="h6" color="textPrimary">
              {timeLeft.days}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Days
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="textPrimary">
              {timeLeft.hours}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Hours
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="textPrimary">
              {timeLeft.minutes}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Minutes
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="textPrimary">
              {timeLeft.seconds}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Seconds
            </Typography>
          </Box>
        </Box>
      </Paper>

      {popUp?
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="appointment-timer-dialog-title"
        aria-describedby="appointment-timer-dialog-description"
      >
        <DialogTitle id="appointment-timer-dialog-title">
          <Typography variant="h6">Appointment Notification</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="appointment-timer-dialog-description">
            Your appointment is up! It’s time to join your session.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNavigate} color="primary" variant="contained">
            Go to Chat
          </Button>
        </DialogActions>
      </Dialog>
      :null}
    </>
   
    :
    null}
     </>
  );
}