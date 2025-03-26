import React,{ useState} from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FacebookIcon from "@mui/icons-material/Facebook"; 
import GoogleIcon from "@mui/icons-material/Google"; 
import VisibilityIcon from "@mui/icons-material/Visibility"; 
import { LoginAccount } from "../../api/Account/Account";
import { useNavigate } from "react-router";
import LoadingScreen from "../common/LoadingScreen";

type LoginFrameProps = {
  onForgotPassword: () => void; 
};

const LoginFrame: React.FC<LoginFrameProps> = ({ onForgotPassword }) => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false)
  const nav = useNavigate();

  const login = async () => {
    setErrorMessage(""); 
    try {
      setLoading(true)
      const res = { 
        emailOrAccountName: account, 
        accountName: "", 
        password: password };
      const data = await LoginAccount(res); 

      if (data.statusCode === 200) {
        console.log("Login Success:", data.result);
        localStorage.setItem("token", JSON.stringify(data.result)); // Store jwt info
        nav("/") // return to role select page
      } else {
        setErrorMessage(data.errorMessage || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
    setLoading(false)
  };

  return (
    <>
      {loading?<LoadingScreen/>:""}
   
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
      }}
    >
      <Typography variant="h5" color="primary" sx={{ mb: 3, textAlign: "center" }}>
        Sign in to Mindmingle
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Email"
            placeholder="Enter your email"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            variant="outlined"
            size="small"
            type={showPassword?"text":"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={()=>setShowPassword(!showPassword)}
                  edge="end">
                 {showPassword?<VisibilityOffIcon/>:<VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {errorMessage && (
        <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: "100%",
          height: 40,
          mt: 3,
          borderRadius: 1,
          background: "linear-gradient(180deg, rgb(0,119,182) 0%, rgb(27,157,240) 94.27%)",
        }}
        onClick={login} // Call login function
      >
        Sign in
      </Button>

      <Button
        variant="outlined"
        color="primary"
        sx={{
          width: "100%",
          height: 40,
          mt: 3,
          borderRadius: 1,
        }}
        onClick={onForgotPassword}
      >
        Forget Password?
      </Button>

      <Box sx={{ my: 3, textAlign: "center" }}>
        <Divider>
          <Typography variant="body2" color="primary">
            OR
          </Typography>
        </Divider>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ borderRadius: 28, textTransform: "none", width: "150px" }}
        >
          Sign in with Google
        </Button>
        <Button
          variant="outlined"
          startIcon={<FacebookIcon />}
          sx={{ borderRadius: 28, textTransform: "none", width: "150px" }}
        >
          Sign in with Facebook
        </Button>
      </Box>
    </Box>
    </>
  );
};

export default LoginFrame;
