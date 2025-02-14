
import { Box } from "@mui/material";
import HeaderLogin from "../HeaderLogin";
import ChangePasswordFrame from "./ChangePassForm";

const ChangePassword = () => {

  return (
    <Box
      sx={{
        background: "white",
        width: "100%",
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
        <ChangePasswordFrame />
      </Box>
    </Box>
  );
};

export default ChangePassword;
