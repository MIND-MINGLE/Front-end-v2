import React from "react";
import styles from "./MainContent.module.css";
import { Button, Typography, Box } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router";

const MainContent: React.FC = () => {
  const nav = useNavigate()
  const gotoPage =(route:string)=>{
    nav(`${route}`)
  }
  return (
    <main className={styles.mainContent}>
      {/* Animated Background */}
      <div className={styles.animatedBackground} />
      {/* Welcoming Banner */}
      <Box className={styles.banner}>
        <Typography variant="h2" className={styles.bannerTitle}>
          Welcome to Mind Mingle
        </Typography>
        <Typography variant="h5" className={styles.bannerSubtitle}>
         Therapist, Your Shift Start Now
        </Typography>
      </Box>

      {/* Navigation Buttons Container */}
      <Box className={styles.buttonContainer}>
        <Button
         onClick={()=>{gotoPage("appointment")}}
          variant="contained"
          className={styles.navButton}
          startIcon={<EventIcon />}
        >
          View Appointments
        </Button>
        <Button
          onClick={()=>{gotoPage("session-calendar/create-session")}}
          variant="contained"
          className={styles.navButton}
          startIcon={<AddIcon />}
        >
          Create Sessions
        </Button>
        <Button
        onClick={()=>{gotoPage("chat")}}
          variant="contained"
          className={styles.navButton}
          startIcon={<ChatIcon />}
        >
          Chat Room
        </Button>
        <Button
         onClick={()=>{gotoPage("profile")}}
          variant="contained"
          className={styles.navButton}
          startIcon={<PersonIcon />}
        >
          Your Profile
        </Button>
      </Box>
    </main>
  );
};

export default MainContent;