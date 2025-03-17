"use client";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import HeaderLogin from "../../Login/HeaderLogin";
import CopyrightFooter from "../../coworking/Components/CopyrightFooter/CopyrightFooter";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import DatePicker
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"; // Date adapter
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Required for DatePicker
import { RegisterPatientAccount } from '../../../api/Account/Seeker';
import { format, parse, isValid, isFuture } from "date-fns"; // date-fns utilities

// Styled components for custom styling
const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  padding: theme.spacing(4),
  maxWidth: "500px",
  width: "100%",
  margin: theme.spacing(4, "auto"),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "50px",
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

const RegisterDoctorPage: React.FC = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "", // Store as string in yyyy-MM-dd format
    gender: "",
    phoneNumber: "",
    pricePerHour:0
  });

  // State for loading, errors, and snackbar
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Validate DOB (yyyy-MM-dd format, not in the future)
  const validateDob = (dob: string) => {
    if (!dob) return false;
    const parsedDate = parse(dob, "yyyy-MM-dd", new Date());
    const isValidDate = isValid(parsedDate);
    const isFutureDate = isFuture(parsedDate);
    return isValidDate && !isFutureDate;
  };

  // Validate phone number (basic validation)
  const validatePhoneNumber = (phone: string) => {
    const regex = /^\+?\d{10,15}$/;
    return regex.test(phone);
  };

  // Memoized validation function
  const validateForm = useMemo(() => {
    return () => {
      const newErrors: { [key: string]: string } = {};
      if (formData.pricePerHour <= 0) newErrors.pricePerHour = "Invalid money amount";
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      else if (!validateDob(formData.dob)) newErrors.dob = "Invalid date or future date (yyyy-MM-dd)";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
      else if (!validatePhoneNumber(formData.phoneNumber))
        newErrors.phoneNumber = "Invalid phone number (e.g., +1234567890)";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  }, [formData]);

  // Handle form input changes
  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Handle date change for DatePicker
  const handleDateChange = (date: Date | null) => {
    if (date && isValid(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setFormData((prev) => ({ ...prev, dob: formattedDate }));
      setErrors((prev) => ({ ...prev, dob: "" }));
    } else {
      setFormData((prev) => ({ ...prev, dob: "" }));
    }
  };

  // Handle form submission
  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const accountId = localStorage.getItem("account");
    const accountData = {
      accountId: accountId || "",
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      pricePerHour:formData.pricePerHour
    };

    const result = await RegisterPatientAccount(accountData);
    setLoading(false);
    if (result!=null) {
      setSnackbar({ open: true, message: "Account registered successfully!", severity: "success" });
      setTimeout(() => navigate("/session-register"), 1500);
    } else {
      setSnackbar({
        open: true,
        message: result.error || "Registration failed. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          backgroundColor: "#F5F7FA",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          <HeaderLogin />
        </Box>

        {/* Form Container */}
        <FormContainer>
          <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
            Patient Register
          </Typography>

          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange("lastName")}
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
          />
          <DatePicker
            label="Date of Birth"
            value={formData.dob ? parse(formData.dob, "yyyy-MM-dd", new Date()) : null}
            onChange={handleDateChange}
            maxDate={new Date()} // Disable future dates
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                error: !!errors.dob,
                helperText: errors.dob || "Format: yyyy-MM-dd",
                required: true,
              },
            }}
            format="yyyy-MM-dd" // Ensure display format is yyyy-MM-dd
          />
          <TextField
            select
            label="Gender"
            value={formData.gender}
            onChange={handleChange("gender")}
            fullWidth
            margin="normal"
            error={!!errors.gender}
            helperText={errors.gender}
            required
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
            <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
          </TextField>
          <TextField
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            fullWidth
            margin="normal"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber || "Example: +1234567890"}
            required
          />
           <TextField
            label="Hourly Rate"
            value={formData.pricePerHour}
            onChange={handleChange("pricePerHour")}
            fullWidth
            margin="normal"
            error={!!errors.pricePerHour}
            helperText={errors.pricePerHour || "Example: 1000000"}
            required
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <SubmitButton
              variant="contained"
              onClick={handleCreateAccount}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? "Registering..." : "Register"}
            </SubmitButton>
          </Box>
        </FormContainer>

        {/* Footer */}
        <Box sx={{ width: "100%", mt: "auto", padding: "16px", backgroundColor: "#FFFFFF" }}>
          <CopyrightFooter />
        </Box>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default RegisterDoctorPage;