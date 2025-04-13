import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GoogleAccountAuthen, GoogleLoginAccount, LoginAccount } from "../../api/Account/Account";
import { useNavigate } from "react-router";
import LoadingScreen from "../common/LoadingScreen";
import styles from './LoginFrame.module.css';
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleAccountRequestProps } from "../../interface/IAccount";

type LoginFrameProps = {
  onForgotPassword: () => void;
};

const LoginFrame: React.FC<LoginFrameProps> = ({ onForgotPassword }) => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSeeker, setIsSeeker] = useState(false);
  const nav = useNavigate();

  const login = async () => {
    if (!account || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    const checkUserRole = async () => {
      try {
       const localRole = localStorage.getItem("role");
        if (localRole === "seeker") {
          setIsSeeker(true);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        return false;
      }
    }
    useEffect(()=>{
      checkUserRole();
      const interval = setInterval(checkUserRole, 3000);
      return () => clearInterval(interval);
    },[])
    setErrorMessage("");
    try {
      setLoading(true);
      const res = {
        emailOrAccountName: account,
        accountName: "",
        password: password
      };
      const data = await LoginAccount(res);

      if (data.statusCode === 200) {
        localStorage.setItem("token", JSON.stringify(data.result));
        nav("/");
      } else {
        setErrorMessage(data.errorMessage || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

 const GoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        const { access_token } = tokenResponse;
        var decodeData:GoogleAccountRequestProps = await GoogleAccountAuthen(access_token)
        const currentRole = localStorage.getItem("role");
        if (!currentRole) {
          return;
        }
        decodeData={
          ...decodeData,
          roleId: currentRole
        }
        await loginWithGoogle(decodeData);
    },
    onError: (error) => {
        alert("Login Failed! Your Mail is restrcited or not registered");
        console.error('Google login failed:', error);
       
    }
})
const loginWithGoogle = async (data: GoogleAccountRequestProps) => {
  try {
    setLoading(true);
    const res = await GoogleLoginAccount(data);
    if (res.statusCode === 200) {
      localStorage.setItem("token", JSON.stringify(res.result));
      nav("/");
    } else {
      setErrorMessage(res.errorMessage || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Google Login Error:", error);
    setErrorMessage("Something went wrong. Please try again.");
  }
  setLoading(false);
}

  return (
    <>
      {loading && <LoadingScreen />}
      <Box className={styles.container}>
        <Typography className={styles.title}>
          Welcome to Mindmingle
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Email"
          placeholder="Enter your email"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className={styles.inputField}
        />

        <TextField
          fullWidth
          label="Password"
          placeholder="Enter your password"
          variant="outlined"
          size="small"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {errorMessage && (
          <Typography className={styles.errorMessage}>
            {errorMessage}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox className={styles.checkbox} />
          <Typography className={styles.termsLink}>
            Remember Me!?
          </Typography>
        </Box>

        <Button
          variant="contained"
          className={styles.signInButton}
          onClick={login}
        >
          Sign in
        </Button>

        <Button
          variant="outlined"
          className={styles.forgotButton}
          onClick={onForgotPassword}
        >
          Forgot Password?
        </Button>
        {
          isSeeker??(
          <>
        <Divider className={styles.divider}>
          <Typography className={styles.dividerText}>
            or continue with
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
          onClick={()=>{GoogleLogin()}}
            variant="outlined"
            startIcon={<GoogleIcon />}
            className={styles.googleButton}
          >
            Google
          </Button>
          <Button
          onClick={()=>{alert("Feature Under Contruction!")}}
            variant="outlined"
            startIcon={<FacebookIcon />}
            className={styles.facebookButton}
          >
            Facebook
          </Button>
        </Box>
        </>
        )
      }
      </Box>
    </>
  );
};

export default LoginFrame;
