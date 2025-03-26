import React, { useState } from "react";
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
import { LoginAccount } from "../../api/Account/Account";
import { useNavigate } from "react-router";
import LoadingScreen from "../common/LoadingScreen";
import styles from './LoginFrame.module.css';

type LoginFrameProps = {
  onForgotPassword: () => void;
};

const LoginFrame: React.FC<LoginFrameProps> = ({ onForgotPassword }) => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const login = async () => {
    if (!account || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

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
          <Typography className={styles.termsText}>
            I agree to{" "}
            <span className={styles.termsLink}>Terms of use</span>
            {" "}and{" "}
            <span className={styles.termsLink}>Privacy Policy</span>
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

        <Divider className={styles.divider}>
          <Typography className={styles.dividerText}>
            or continue with
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            className={styles.googleButton}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            className={styles.facebookButton}
          >
            Facebook
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LoginFrame;
