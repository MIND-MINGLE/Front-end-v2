
import  { useState } from "react";
import { Box } from "@mui/material";
import HeaderLogin from "./HeaderLogin";
import LoginForm from "./LoginFrame";
import Footer from "../coworking/Components/CopyrightFooter/CopyrightFooter";
import ResetFrame from "./ResetPassword";
import EnterCode from "./EnterCode";
import SuccessfullySend from "./SuccessfullySend";

const LoginPage = () => {
  const [currentStep, setCurrentStep] = useState("login");

  const handleForgotPassword = () => {
    setCurrentStep("reset");
  };

  const handleShowSuccess = () => {
    setCurrentStep("success");
  };

  const handleContinueToEnterCode = () => {
    setCurrentStep("enterCode");
  };

  return (
    <Box
      sx={{
        background: "white",
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        padding: "16px",
      }}
    >
      <HeaderLogin />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 200px)",
        }}
      >
        {currentStep === "login" && (
          <LoginForm onForgotPassword={handleForgotPassword} />
        )}
        {currentStep === "reset" && (
          <ResetFrame
            onCancel={() => setCurrentStep("login")}
            onContinue={handleShowSuccess} 
          />
        )}
        {currentStep === "success" && (
          <SuccessfullySend onContinue={handleContinueToEnterCode} />
        )}
        {currentStep === "enterCode" && (
          <EnterCode onCancel={() => setCurrentStep("login")} /> 
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginPage;
