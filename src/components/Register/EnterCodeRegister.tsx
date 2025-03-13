import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import LoadingScreen from "../common/LoadingScreen";
import { verifyAccount } from "../../api/Account/Account";
import { useNavigate } from "react-router";

interface VerifyProps {
  accountId: string;
  verificationCode: string;
}

const EnterCode = ({ onUpdateInfo }: { onUpdateInfo: () => void }): React.JSX.Element => {
  // State to manage VerifyProps data
  const [verifyData, setVerifyData] = useState<VerifyProps>({
    accountId: "",
    verificationCode: "",
  });
  const [isLoading,setIsLoading] = useState(false)
  const nav = useNavigate()

  // Retrieve accountId from LocalStorage when the component mounts
  useEffect(() => {
    const storedAccountId = localStorage.getItem("account");
    if (storedAccountId) {
      setVerifyData((prev) => ({ ...prev, accountId: storedAccountId }));
    }
  }, [isLoading]);

  const verify = async()=>{
    setIsLoading(true)
    const response = await verifyAccount(verifyData)
    if(response){
      console.log(response)
      alert("Account Verified")
      nav("/")
    }
    setIsLoading(false)
  }

  return (
    <>
    {isLoading?<LoadingScreen/>:null}
    <Box
      sx={{
        width: 600,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: 1,
        borderColor: "primary.main",
        position: "relative",
        p: 4,
        boxShadow: 3,
        m: "auto",
        mt: 5,
        maxWidth: "90%",
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        color="primary"
        sx={{
          textAlign: "center",
          mb: 2,
          fontWeight: 500,
        }}
      >
        Enter the confirmation code from the email
      </Typography>

      {/* Description Text */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: "center",
          mb: 3,
        }}
      >
        To secure your account, enter the code we sent to your email.
      </Typography>

      {/* Text Field for Code */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <TextField
          fullWidth
          label="Enter Code"
          placeholder="_ _ _ _ _ _"
          variant="outlined"
          value={verifyData.verificationCode}
          onChange={(e) =>
            setVerifyData({ ...verifyData, verificationCode: e.target.value })
          }
          sx={{
            width: "80%",
            mb: 0,
            backgroundColor: "white",
          }}
        />
      </Box>

      {/* Resend Code Button */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button variant="text" color="primary">
          Resend Code
        </Button>
      </Box>

      {/* Action Buttons (Update and Continue) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          sx={{
            width: "50%",
          }}
          onClick={onUpdateInfo}
        >
          Update Information
        </Button>
          <Button
            onClick={()=>{
              verify()
              
            }}
            variant="contained"
            color="primary"
            sx={{
              width: "100%",
            }}
          >
            Continue
          </Button>
      </Box>
    </Box>
    </>
  );
};

export default EnterCode;