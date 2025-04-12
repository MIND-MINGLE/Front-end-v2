// src/components/GlobalPaymentReminder.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Link,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Appointment, AppointmentPaymentRequest, Patient, PaymentProps } from "../interface/IAccount";
import { getAppointmentByPatientId } from "../api/Appointment/appointment";
import { createAppPayment, getPaymentByPatientId } from "../api/Payment/PaymentApi";

// Styled components
const ReminderBanner = styled(Box)(({ isRestricted }: { isRestricted?: boolean }) => ({
  position: "fixed",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#F5F7FA",
  border: isRestricted ? "1px solid #f44336" : "1px solid #0077b6", // Red for restricted, blue otherwise
  borderRadius: "12px",
  padding: "12px 24px",
  boxShadow: "0 4px 12px rgba(0, 119, 182, 0.2)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  zIndex: 1000,
  maxWidth: "90%",
  flexWrap: "wrap",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateX(-50%) scale(1.03)",
    boxShadow: "0 6px 16px rgba(0, 119, 182, 0.3)",
  },
}));

const PaymentButton = styled(Button)(() => ({
  background: "linear-gradient(to right, #4caf50, #388e3c)",
  color: "#FFFFFF",
  borderRadius: "20px",
  padding: "6px 16px",
  fontSize: "14px",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(to right, #43a047, #2e7d32)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
  },
}));

const StyledFormControl = styled(FormControl)(() => ({
  minWidth: "200px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0077b6",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0077b6",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#333333",
    "&.Mui-focused": {
      color: "#0077b6",
    },
  },
}));

const GlobalPaymentReminder: React.FC = () => {
  const [unpaidAppointments, setUnpaidAppointments] = useState<Appointment[]>([]);
  const [overdueAppointments, setOverdueAppointments] = useState<Appointment[]>([]);
  const [isAccountRestricted, setIsAccountRestricted] = useState(false);
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isPastGracePeriod = (endTime: string) => {
    const endDate = new Date(endTime);
    const deadline = new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return deadline.getTime() < new Date().getTime();
  };

  const getDaysRemaining = (endTime: string) => {
    const endDate = new Date(endTime);
    const deadline = new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  const fetchUnpaidAppointments = async () => {
    setLoading(true);
    try {
      const patientAccount = sessionStorage.getItem("patient");
      if (!patientAccount) {
        //console.log("No patient account found");
        setUnpaidAppointments([]);
        setOverdueAppointments([]);
        setSelectedAppointment(null);
        setIsAccountRestricted(false);
        sessionStorage.removeItem("isAccountRestricted");
        return;
      }

      const patient: Patient = JSON.parse(patientAccount);
      const [appointmentData, paymentData] = await Promise.all([
        getAppointmentByPatientId(patient.patientId),
        getPaymentByPatientId(patient.patientId),
      ]);

      if (appointmentData.statusCode === 200 && paymentData.statusCode === 200) {
        const appointments: Appointment[] = appointmentData.result;
        const payments: PaymentProps[] = paymentData.result;
        //("Fetched payments:", payments);

        const unpaid = appointments.filter(
          (appt) =>
            appt.status === "ENDED" &&
            !payments.some(
              (payment) =>
                payment.appointment?.appointmentId === appt.appointmentId &&
                payment.paymentStatus === "PAID"
            )
        );

        const overdue = unpaid.filter((appt) => isPastGracePeriod(appt.session.endTime));
        const withinGrace = unpaid.filter((appt) => !isPastGracePeriod(appt.session.endTime));

        //("Unpaid within grace:", withinGrace);
        //console.log("Overdue appointments:", overdue);
        setUnpaidAppointments(withinGrace);
        setOverdueAppointments(overdue);

        const restricted = overdue.length > 0;
        setIsAccountRestricted(restricted);
        sessionStorage.setItem("isAccountRestricted", JSON.stringify(restricted));

        // Set default selectedAppointment (prefer overdue, then unpaid)
        const allPending = [...overdue, ...withinGrace];
        setSelectedAppointment(allPending.length > 0 ? allPending[0] : null);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching unpaid appointments:", err);
      setUnpaidAppointments([]);
      setOverdueAppointments([]);
      setSelectedAppointment(null);
      setIsAccountRestricted(false);
      sessionStorage.removeItem("isAccountRestricted");
      setSnackbarMessage("Error fetching payment data");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidAppointments();
    const interval = setInterval(fetchUnpaidAppointments, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleOpenPaymentDialog = () => {
    if (selectedAppointment) {
      setAppDialogOpen(true);
    }
  };

  const handleClosePaymentDialog = () => {
    setAppDialogOpen(false);
    setPaymentUrl("");
  };

  const handleSubmitPayment = async () => {
    const patientAccount = sessionStorage.getItem("patient");
    if (!patientAccount) {
      setSnackbarMessage("No patient account found");
      setSnackbarOpen(true);
      return;
    }
    if (selectedAppointment === null) {
      setSnackbarMessage("No appointment selected");
      setSnackbarOpen(true);
      return;
    }

    const patient: Patient = JSON.parse(patientAccount);
    const paymentData: AppointmentPaymentRequest = {
      appointmentId: selectedAppointment.appointmentId,
      patientId: patient.patientId,
      amount: selectedAppointment.totalFee,
      therapistReceive: selectedAppointment.totalFee - selectedAppointment.platformFee,
      paymentUrl: "",
    };

    try {
      setLoading(true);
      const response = await createAppPayment(paymentData);
      if (response.statusCode === 200) {
        //console.log("Payment initiated for appointment:", selectedAppointment.appointmentId);
        sessionStorage.removeItem("appointment");
        const payOSURL = response.result;
        setPaymentUrl(payOSURL);
        const paymentWindow = window.open(payOSURL, "_blank");
        if (!paymentWindow) {
          setSnackbarMessage("Popup blocked. Please use the payment link.");
          setSnackbarOpen(true);
        }
        // Optimistic update
        setUnpaidAppointments((prev) =>
          prev.filter((appt) => appt.appointmentId !== selectedAppointment.appointmentId)
        );
        setOverdueAppointments((prev) =>
          prev.filter((appt) => appt.appointmentId !== selectedAppointment.appointmentId)
        );
        const allPending = [...overdueAppointments, ...unpaidAppointments].filter(
          (appt) => appt.appointmentId !== selectedAppointment.appointmentId
        );
        setSelectedAppointment(allPending.length > 0 ? allPending[0] : null);
        setIsAccountRestricted(allPending.some((appt) => isPastGracePeriod(appt.session.endTime)));
        sessionStorage.setItem(
          "isAccountRestricted",
          JSON.stringify(allPending.some((appt) => isPastGracePeriod(appt.session.endTime)))
        );
        handleClosePaymentDialog();
        await fetchUnpaidAppointments(); // Sync with server
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (err) {
      setSnackbarMessage("Error initiating payment");
      setSnackbarOpen(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatAppointmentLabel = (appt: Appointment) => {
    const therapist = appt.therapist
      ? `${appt.therapist.firstName} ${appt.therapist.lastName}`
      : "Unknown Therapist";
    const date = new Date(appt.session.endTime).toLocaleDateString();
    const status = isPastGracePeriod(appt.session.endTime) ? " (Overdue)" : "";
    return `${therapist} on ${date}${status}`;
  };

  const allPendingAppointments = [...overdueAppointments, ...unpaidAppointments];
  if (allPendingAppointments.length === 0 || loading) return null;

  return (
    <>
      <ReminderBanner isRestricted={isAccountRestricted}>
        <Typography variant="body1" color="#333333" sx={{ flex: "1 1 auto", fontSize: "18px" }}>
          {isAccountRestricted ? (
            <>
              Your account is restricted due to {overdueAppointments.length} overdue payment
              {overdueAppointments.length > 1 ? "s" : ""}. Please settle all payments.
            </>
          ) : (
            <>
              You have {allPendingAppointments.length} unpaid appointment
              {allPendingAppointments.length > 1 ? "s" : ""}.
              {selectedAppointment && !isPastGracePeriod(selectedAppointment.session.endTime) && (
                <>
                  {" Pay within "}
                  {getDaysRemaining(selectedAppointment.session.endTime)} days to avoid account restrictions.
                </>
              )}
            </>
          )}
        </Typography>
        <StyledFormControl variant="outlined">
          <InputLabel>Select Appointment</InputLabel>
          <Select
            value={selectedAppointment?.appointmentId || ""}
            onChange={(e) =>
              setSelectedAppointment(
                allPendingAppointments.find((appt) => appt.appointmentId === e.target.value) || null
              )
            }
            label="Select Appointment"
          >
            {allPendingAppointments.map((appt) => (
              <MenuItem key={appt.appointmentId} value={appt.appointmentId}>
                {formatAppointmentLabel(appt)}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <PaymentButton
          onClick={handleOpenPaymentDialog}
          disabled={!selectedAppointment}
        >
          Pay Now
        </PaymentButton>
      </ReminderBanner>

      <Dialog open={appDialogOpen} onClose={handleClosePaymentDialog}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#0077b6" }}>
          {isAccountRestricted ? "Account Restricted" : "Your Appointment Has Ended"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="#333333">
            {isAccountRestricted
              ? "Your account is restricted until all overdue payments are settled."
              : "You’ll now be redirected to the Payment Section."}
          </DialogContentText>
          <DialogContentText color="#333333">---</DialogContentText>
          <Typography color="#ff9800">
            {isAccountRestricted
              ? "*Please complete the payment to restore full account access."
              : "*You can cancel the payment if you wish. There will be a 7-day period for you to complete your payment before we soft-lock your account. Thank you!"}
          </Typography>
          {paymentUrl !== "" && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography color="#ff9800">
                Popup blocked. Please use this link:
              </Typography>
              <Link href={paymentUrl} target="_blank" sx={{ color: "#0077b6" }}>
                Proceed to Payment
              </Link>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleSubmitPayment}
            disabled={loading}
            sx={{
              background: "linear-gradient(to right, #4caf50, #388e3c)",
              color: "#FFFFFF",
              borderRadius: "20px",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(to right, #43a047, #2e7d32)",
              },
            }}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </Button>
          <Button
            onClick={handleClosePaymentDialog}
            sx={{ color: "#757575", textTransform: "none" }}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes("success") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GlobalPaymentReminder;