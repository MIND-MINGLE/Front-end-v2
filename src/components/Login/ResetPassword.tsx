
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import SuccessfullySend from "./SuccessfullySend";

type ResetFrameProps = {
  onCancel: () => void; 
  onContinue: () => void;
};

const ResetFrame: React.FC<ResetFrameProps> = ({ onCancel, onContinue }) => {
  const [showSuccess] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {showSuccess && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.5)", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <SuccessfullySend onContinue={onContinue}/>
        </Box>
      )}

      <Box
        sx={{
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 1,
          overflow: "hidden",
          border: "0.75px solid",
          borderColor: "primary.main",
          p: 4,
          boxShadow: 2,
          zIndex: showSuccess ? 1000 : 1, 
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Reset your password
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              How would you like to receive a code to reset your password?
            </Typography>

            <RadioGroup defaultValue="email" sx={{ mb: 3 }}>
              <FormControlLabel
                value="sms"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2" color="primary">
                      Send code via SMS
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      0123456789
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="email"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2" color="primary">
                      Send code via Email
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      nguyenthiaiquynh2812@gmail.com
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Grid>
          <Divider />
          <Grid
            item
            xs={4}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                alt="Quynh Nguyen"
                src="/Ellipse 33.svg"
                sx={{ width: 50, height: 50, mb: 1 }}
              />
              <Typography variant="body2" color="textPrimary">
                Quynh Nguyen
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Rental user
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="body2"
          color="primary"
          sx={{ textAlign: "center", mb: 3 }}
        >
          You cannot access this phone number and email.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              mr: 2,
              bgcolor: "grey.300",
              color: "text.primary",
              width: 150,
              height: 40,
            }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: blue[700],
              color: "common.white",
              width: 150,
              height: 40,
            }}
            onClick={onContinue} 
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetFrame;