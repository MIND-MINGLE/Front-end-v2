"use client";
import React, { useState } from "react";
import HeaderLogin from "../Login/HeaderLogin";
import SignUpForm from "./SignUpForm";
import CopyrightFooter from "../coworking/Components/CopyrightFooter/CopyrightFooter";
import { Box, Button, Typography } from "@mui/material";
import {Link} from "react-router";
import EnterCode from "./EnterCodeRegister";

const RegisterPage: React.FC = () => {
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const handleCreateAccount = () => {
        setIsCreatingAccount(true);
      };
    
      const handleUpdateInformation = () => {
        setIsCreatingAccount(false);
      };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF", 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", 
          backgroundColor: "white",
          zIndex: 1,
        }}
      >
        <HeaderLogin />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1, 
          padding: "0 16px",
          marginBottom: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "80%" }}>
                <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Already have an account?
                </Typography>
                <Link to="/login">
                    <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                            textTransform: "none",
                            borderRadius: 20,
                            fontWeight: 500,
                            padding: "8px 20px",
                            ml: 2,
                        }}
                    >
                        Sign In
                    </Button>
                </Link>
            </Box>
        </Box>
        {isCreatingAccount ? (
          <EnterCode onUpdateInfo={handleUpdateInformation}/>
        ) : (
          <SignUpForm onCreateAccount={handleCreateAccount} />
        )}
      </Box>

      <Box
          sx={{
            width: "100%",
          }}
        >
        </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100vw",
          padding: "16px",
          backgroundColor: "#FFFFFF", 
        }}
      >
        <CopyrightFooter />
      </Box>
    </Box>
  );
};
export default RegisterPage;
