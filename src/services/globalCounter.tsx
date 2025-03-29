import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Appointment } from "../interface/IAccount";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { patchAppointmentStatus } from "../api/Appointment/appointment";

export default function GlobalCounter() {
  const [currentApp, setCurrentApp] = useState<Appointment | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time left in seconds
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog visibility
  const [isDisabling, setIsDisabling] = useState(false); // API loading state
  const navigate = useNavigate();

  // Fetch appointment initially and poll every 10 seconds
  useEffect(() => {
    const getCurrentAppointment = () => {
      const currentList = sessionStorage.getItem("appointment");
      if (currentList) {
        const appointments: Appointment[] = JSON.parse(currentList);
        setCurrentApp(appointments[0]); // Set the first appointment
        console.log("currentApp: ", appointments[0]);
      } else {
        setCurrentApp(null);
      }
    };

    // Initial fetch
    getCurrentAppointment();

    // Polling every 10 seconds
    const pollingInterval = setInterval(() => {
      getCurrentAppointment();
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(pollingInterval);
  }, []);

  // Calculate and update countdown based on endTime
  useEffect(() => {
    if (!currentApp?.session?.endTime) return;

    const updateCountdown = () => {
      const endTime = new Date(currentApp.session.endTime).getTime();
      const now = new Date().getTime();
      const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000)); // Seconds remaining
      setTimeLeft(timeRemaining);

      if (timeRemaining <= 0 && currentApp) {
        setDialogOpen(true); // Show dialog when time is up
      }
    };

    // Update immediately and every second
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);

    // Cleanup interval on unmount or when currentApp changes
    return () => clearInterval(timerInterval);
  }, [currentApp]);

  // Format timeLeft into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Handle disabling the appointment
  const handleDisableAppointment = async () => {
    if (!currentApp) return;
    setIsDisabling(true);
    try {
      //console.log("Disabling appointment:", currentApp.appointmentId);
      const response = await patchAppointmentStatus("Ended", currentApp.appointmentId)
      if(response.status ===200){
        sessionStorage.removeItem("appointment");
        setCurrentApp(null);
        navigate(-1);
      }else{
        alert("Appoitment ENDED! Returing to homepage...")
        sessionStorage.removeItem("appointment");
        setCurrentApp(null);
        navigate(-1);
      }

    
    } catch (error) {
      console.error("Failed to disable appointment:", error);
      // Optionally show an error dialog here
    } finally {
      setIsDisabling(false);
      setDialogOpen(false);
    }
  };

  return (
    <>
      {/* Dialog for End of Appointment */}
      <Dialog open={dialogOpen} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>Appointment Ended</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your appointment has ended. It will now be disabled, and you’ll be redirected.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleDisableAppointment}
            disabled={isDisabling}
          >
            {isDisabling ? "Disabling..." : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}