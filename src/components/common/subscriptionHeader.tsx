import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SubscriptionTimerProps {
  checkSub: boolean; // Prop to trigger subscription check
}

export default function SubscriptionTimer({ checkSub }: SubscriptionTimerProps) {
  const [subscription, setSubscription] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch subscription from sessionStorage
  useEffect(() => {
    const getCurrentSubscription = () => {
      const subData = sessionStorage.getItem("package");
      if (subData) {
        setSubscription(subData);
      } else {
        setSubscription(null);
      }
    };
    getCurrentSubscription();
  }, [checkSub]);

  // Handle navigation to subscription page
  const handleNavigate = () => {
    navigate("/seeker/subscription"); 
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 16,
          left: 120,
          padding: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
          zIndex: 10,
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        {subscription ? (
          <>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Subscription: {subscription}
            </Typography>
          </>
        ) : (
            <Box>
          <Typography variant="subtitle1" color="error">
            No Active Subscription
          </Typography>
           <Button type="button" onClick={handleNavigate}>
             Purchase Subscription
           </Button>
           </Box>
        )}
      </Paper>
    </>
  );
}