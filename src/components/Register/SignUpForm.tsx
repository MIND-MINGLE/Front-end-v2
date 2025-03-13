
import {
  Box,
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { RegisterAgentAccount, RegisterDocAccount, RegisterPatientAccount } from "../../api/Account/Account";
import { AccountRequestProps } from "../../interface/IAccount";
import LoadingScreen from "../common/LoadingScreen";

const SignUpForm = ({ onCreateAccount }: { onCreateAccount: () => void }) => {
  const [isLoading,setIsLoading] = useState(false)
  // State for form data
  const [formData, setFormData] = useState<AccountRequestProps>({
    email: "",
    accountName: "",
    password: "",
    confirmPassword: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    email: "",
    accountName: "",
    password: "",
    confirmPassword: "",
  });

  // State for terms acceptance
  const [accept, setAccept] = useState(false);

  // useEffect to validate form data whenever it changes
  useEffect(() => {
    setErrors({
      email: formData.email.trim() === "" ? "Email is required" : "",
      accountName: formData.accountName.trim() === "" ? "User Name is required" : "",
      password: formData.password.length < 6 ? "Password must be at least 6 characters" : "",
      confirmPassword: formData.confirmPassword !== formData.password ? "Passwords do not match" : "",
    });
  }, [formData]);

  // Handler for terms checkbox
  const handleAccept = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccept(event.target.checked);
  };

  // Determine if the form is valid
  const isFormValid = accept && Object.values(errors).every((error) => error === "");

  const onSubmit =async()=>{
    setIsLoading(true)
    const role = localStorage.getItem("role")
    let response = null;
    switch (role) {
      case "seeker":{
         response  = await RegisterPatientAccount(formData);
        break;}
      case "doc":{
         response  = await RegisterDocAccount(formData);
        break;}
      case "agent":{
         response  = await RegisterAgentAccount(formData);
        break;}
      default:{
        alert("No role found")
      }
    }
    if(response!=null){
      localStorage.setItem("account",response.result);
      onCreateAccount()
    }
    else{
      alert("Error in creating account")
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
        boxShadow: 3,
        p: 4,
        m: "auto",
        mt: 5,
        maxWidth: "90%",
      }}
    >
      <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
        Sign up to Mindmingle
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="User Name"
              placeholder="account123" // Fixed typo from "acount123"
              variant="outlined"
              size="small"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              error={!!errors.accountName}
              helperText={errors.accountName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              placeholder="mailname@gmail.com"
              variant="outlined"
              size="small"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              placeholder="Your password"
              variant="outlined"
              size="small"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              placeholder="Confirm your password"
              variant="outlined"
              size="small"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex", // Fixed from "center" to "flex" for proper alignment
          alignItems: "center",
          mt: 3,
        }}
      >
        <Checkbox checked={accept} onChange={handleAccept} />
        <Typography variant="body2" color="textSecondary">
          I agree to{" "}
          <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
            Terms of Use
          </Typography>{" "}
          and{" "}
          <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
            Privacy Policy
          </Typography>
        </Typography>
      </Box>

      <Button
        disabled={!isFormValid}
        variant="contained"
        color="primary"
        sx={{
          mt: 3,
          width: "100%",
          py: 1,
          fontSize: "1rem",
          fontWeight: 500,
          borderRadius: 1,
        }}
        onClick={()=>{onSubmit()}}
      >
        Create Account
      </Button>
    </Box>
    </>
  );
};

export default SignUpForm;