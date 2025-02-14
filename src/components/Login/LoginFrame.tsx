import React from "react";
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
import FacebookIcon from "@mui/icons-material/Facebook"; 
import GoogleIcon from "@mui/icons-material/Google"; 
import VisibilityIcon from "@mui/icons-material/Visibility"; 

type LoginFrameProps = {
  onForgotPassword: () => void; 
};

const LoginFrame: React.FC<LoginFrameProps> = ({ onForgotPassword }) => {
  return (
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
            label="Name"
            placeholder="Your name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Email"
            placeholder="Enter your email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            variant="outlined"
            size="small"
            type="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Checkbox />
        <Typography variant="body2" color="textSecondary">
          I agree to{" "}
          <Typography component="span" color="textPrimary" sx={{ fontWeight: 'bold' }}>
            Terms of use
          </Typography>{" "}
          and{" "}
          <Typography component="span" color="textPrimary" sx={{ fontWeight: 'bold' }}>
            Privacy Policy
          </Typography>
        </Typography>
      </Box>

            {/* TODO */}
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
  );
};

export default LoginFrame;
