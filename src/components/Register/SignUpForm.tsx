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
import styles from './SignUpForm.module.css';

const SignUpForm = ({ onCreateAccount }: { onCreateAccount: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)
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
  // State for terms acceptance
  const [isFormValid, setIsFormValid] = useState(false);

  // Thêm state để track việc user đã tương tác với field chưa
  const [touched, setTouched] = useState({
    email: false,
    accountName: false,
    password: false,
    confirmPassword: false,
  });

  // Sửa lại useEffect để chỉ validate khi field đã được touch
  useEffect(() => {
    setErrors({
      email: touched.email && formData.email.trim() === "" ? "Email is required" : "",
      accountName: touched.accountName && formData.accountName.trim() === "" ? "User Name is required" : "",
      password: touched.password && formData.password.length < 6 ? "Password must be at least 6 characters" : "",
      confirmPassword: touched.confirmPassword && formData.confirmPassword !== formData.password ? "Passwords do not match" : "",
    });

    // Determine if the form is valid - chỉ check khi tất cả các field đã được touch
    const allFieldsTouched = Object.values(touched).every(t => t);
    const noErrors = Object.values(errors).every((error) => error === "");
    setIsFormValid(allFieldsTouched && noErrors && accept);
  }, [formData, touched, accept]);

  // Thêm handler cho việc track touched state
  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Handler for terms checkbox
  const handleAccept = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccept(event.target.checked);
  };

  const onSubmit = async () => {
    setIsLoading(true)
    const role = localStorage.getItem("role")
    let response = null;
    switch (role) {
      case "seeker": {
        response = await RegisterPatientAccount(formData);
        break;
      }
      case "doc": {
        response = await RegisterDocAccount(formData);
        break;
      }
      case "agent": {
        response = await RegisterAgentAccount(formData);
        break;
      }
      default: {
        alert("No role found")
      }
    }
    if (response != null) {
      sessionStorage.setItem("account", response.result);
      onCreateAccount()
    }
    else {
      alert("Error in creating account")
    }
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <Box className={styles.container}>
        <Typography className={styles.title}>
          Sign up to Mindmingle
        </Typography>

        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                className={styles.inputField}
                fullWidth
                label="User Name"
                placeholder="account123"
                variant="outlined"
                size="small"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                onBlur={() => handleBlur('accountName')}
                error={touched.accountName && !!errors.accountName}
                helperText={touched.accountName ? errors.accountName : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={styles.inputField}
                fullWidth
                label="Email"
                placeholder="mailname@gmail.com"
                variant="outlined"
                size="small"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => handleBlur('email')}
                error={touched.email && !!errors.email}
                helperText={touched.email ? errors.email : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={styles.inputField}
                fullWidth
                label="Password"
                placeholder="Your password"
                variant="outlined"
                size="small"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onBlur={() => handleBlur('password')}
                error={touched.password && !!errors.password}
                helperText={touched.password ? errors.password : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={styles.inputField}
                fullWidth
                label="Confirm Password"
                placeholder="Confirm your password"
                variant="outlined"
                size="small"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword ? errors.confirmPassword : ""}
              />
            </Grid>
          </Grid>
        </Box>

        <Box className={styles.termsContainer}>
          <Checkbox
            checked={accept}
            onChange={handleAccept}
            sx={{ '&.Mui-checked': { color: '#1976d2' } }}
          />
          <Typography className={styles.termsText}>
            I agree to{" "}
            <span className={styles.termsLink}>Terms of Use</span>{" "}
            and{" "}
            <span className={styles.termsLink}>Privacy Policy</span>
          </Typography>
        </Box>

        <Button
          className={styles.submitButton}
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
          onClick={() => { onSubmit() }}
        >
          Create Account
        </Button>
      </Box>
    </>
  );
};

export default SignUpForm;