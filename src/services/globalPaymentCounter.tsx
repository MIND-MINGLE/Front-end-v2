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
const ReminderBanner = styled(Box)(({ isRestricted, isHidden }: { isRestricted?: boolean; isHidden?: boolean }) => ({
  position: "fixed",
  bottom: isHidden ? "calc(-100vh)" : "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#F5F7FA",
  border: isRestricted ? "1px solid #f44336" : "1px solid #0077b6",
  borderRadius: "12px",
  padding: "12px 24px",
  boxShadow: "0 4px 12px rgba(0, 119, 182, 0.2)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  zIndex: 1000,
  maxWidth: "90%",
  flexWrap: "wrap",
  transition: "bottom 0.3s ease, box-shadow 0.3s ease",
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

const ToggleButton = styled(Button)(() => ({
  position: "fixed",
  right: "20px",
  background: "linear-gradient(to right, #4caf50, #388e3c)",
  color: "#FFFFFF",
  borderRadius: "20px",
  minWidth: "40px",
  width: "40px",
  height: "40px",
  padding: 0,
  zIndex: 1001,
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

interface Subscription {
  subscriptionId: string;
  packageName: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  isDisabled: boolean;
}

const GlobalPaymentReminder: React.FC = () => {
  const [unpaidAppointments, setUnpaidAppointments] = useState<Appointment[]>([]);
  const [overdueAppointments, setOverdueAppointments] = useState<Appointment[]>([]);
  const [isAccountRestricted, setIsAccountRestricted] = useState(false);
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [isBannerHidden, setIsBannerHidden] = useState(false);
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

  const getSubscriptionDiscount = () => {
    const packageData = sessionStorage.getItem("package");
    if (!packageData) return { packageName: null, discount: 1.0 };
    try {
      const subscription: Subscription = JSON.parse(packageData);
      if (subscription.isDisabled) return { packageName: null, discount: 1.0 };
      if (subscription.packageName === "MindMingle Premium") {
        return { packageName: "MindMingle Premium", discount: 0.7 };
      }
      if (subscription.packageName === "MindMingle Plus") {
        return { packageName: "MindMingle Plus", discount: 0.9 };
      }
      return { packageName: null, discount: 1.0 };
    } catch {
      return { packageName: null, discount: 1.0 };
    }
  };

  const fetchUnpaidAppointments = async () => {
    setLoading(true);
    try {
      const patientAccount = sessionStorage.getItem("patient");
      if (!patientAccount) {
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
      let unpaid: Appointment[] = [];
      if (appointmentData.statusCode === 200 && paymentData.statusCode !== 200) {
        const appointments: Appointment[] = appointmentData.result;
        unpaid = appointments.filter((appt) => appt.status === "ENDED");
      } else if (appointmentData.statusCode === 200 && paymentData.statusCode === 200) {
        const appointments: Appointment[] = appointmentData.result;
        const payments: PaymentProps[] = paymentData.result;
        unpaid = appointments.filter(
          (appt) =>
            appt.status === "ENDED" &&
            !payments.some(
              (payment) =>
                payment.appointment?.appointmentId === appt.appointmentId &&
                payment.paymentStatus === "PAID"
            )
        );
      } else {
        throw new Error("Failed to fetch data");
      }
      const overdue = unpaid.filter((appt) => isPastGracePeriod(appt.session.endTime));
      const withinGrace = unpaid.filter((appt) => !isPastGracePeriod(appt.session.endTime));
      setUnpaidAppointments(withinGrace);
      setOverdueAppointments(overdue);

      const restricted = overdue.length > 0;
      setIsAccountRestricted(restricted);
      sessionStorage.setItem("isAccountRestricted", JSON.stringify(restricted));

      const allPending = [...overdue, ...withinGrace];
      setSelectedAppointment(allPending.length > 0 ? allPending[0] : null);
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
    const interval = setInterval(fetchUnpaidAppointments, 300000);
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

  const handleToggleBanner = () => {
    setIsBannerHidden((prev) => !prev);
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
    const { discount } = getSubscriptionDiscount();
    const discountedFee = (selectedAppointment.totalFee + selectedAppointment.platformFee) * discount;
    const discountedTherapistReceive =
      (selectedAppointment.totalFee - selectedAppointment.platformFee) * discount;

    const paymentData: AppointmentPaymentRequest = {
      appointmentId: selectedAppointment.appointmentId,
      patientId: patient.patientId,
      amount: Math.round(discountedFee),
      therapistReceive: Math.round(discountedTherapistReceive),
      paymentUrl: "",
    };

    try {
      setLoading(true);
      const response = await createAppPayment(paymentData);
      if (response.statusCode === 200) {
        sessionStorage.removeItem("appointment");
        const payOSURL = response.result;
        setPaymentUrl(payOSURL);
        const paymentWindow = window.open(payOSURL, "_blank");
        if (!paymentWindow) {
          setSnackbarMessage("Popup blocked. Please use the payment link.");
          setSnackbarOpen(true);
        }
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
        await fetchUnpaidAppointments();
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
    const { packageName, discount } = getSubscriptionDiscount();
    const discountedFee = appt.totalFee * discount;
    return `${therapist} on ${date}${status} - ${formatPriceToVnd(discountedFee)}${packageName ? ` (${packageName})` : ""}`;
  };

  const formatPriceToVnd = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const allPendingAppointments = [...overdueAppointments, ...unpaidAppointments];
  if (allPendingAppointments.length === 0 || loading) return null;

  return (
    <>
      <ReminderBanner isRestricted={isAccountRestricted} isHidden={isBannerHidden}>
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
                  {(() => {
                    const { packageName, discount } = getSubscriptionDiscount();
                    return packageName && selectedAppointment.totalFee > 0 ? (
                      <>
                        {" "}
                        {packageName} discount: {formatPriceToVnd(selectedAppointment.totalFee)} →{" "}
                        {formatPriceToVnd(selectedAppointment.totalFee * discount)}
                      </>
                    ) : null;
                  })()}
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

      <ToggleButton
        onClick={handleToggleBanner}
        sx={{
          bottom: "20px",
          transition: "bottom 0.3s ease",
        }}
      >
        {!isBannerHidden ? "↓" : "↑"}
      </ToggleButton>

      <Dialog open={appDialogOpen} onClose={handleClosePaymentDialog}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#0077b6" }}>
          {isAccountRestricted ? "Account Restricted" : "Complete Your Payment"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="#333333">
            {isAccountRestricted
              ? "Your account is restricted until all overdue payments are settled."
              : "Please review the payment details below."}
          </DialogContentText>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography color="#333333">
                Therapist: {selectedAppointment.therapist?.firstName}{" "}
                {selectedAppointment.therapist?.lastName}
              </Typography>
              <Typography color="#333333">
                Date: {new Date(selectedAppointment.session.endTime).toLocaleDateString()}
              </Typography>
              <Typography color="#333333">
                Original Fee: {formatPriceToVnd(selectedAppointment.totalFee)}
              </Typography>
              <Typography color="#333333">
                Platform Fee: {formatPriceToVnd(selectedAppointment.platformFee)}
              </Typography>
              {(() => {
                const { packageName, discount } = getSubscriptionDiscount();
                const discountedFee = selectedAppointment.totalFee * discount;
                const discountPercentage = packageName === "MindMingle Premium" ? "30%" : packageName === "MindMingle Plus" ? "10%" : null;
                return (
                  <>
                    {packageName && (
                      <Typography color="#ff9800" sx={{ fontWeight: "bold" }}>
                        Discount: {discountPercentage} off with {packageName}
                      </Typography>
                    )}
                    <Typography color="#333333" sx={{ fontWeight: "bold" }}>
                      Final Amount: {formatPriceToVnd(Math.round(discountedFee))}
                    </Typography>
                  </>
                );
              })()}
            </Box>
          )}
          <DialogContentText color="#333333" sx={{ mt: 2 }}>
            You’ll be redirected to the payment section.
          </DialogContentText>
          <DialogContentText color="#333333">---</DialogContentText>
          <Typography color="#ff9800">
            {isAccountRestricted
              ? "*Please complete the payment to restore full account access."
              : "*You can cancel if you can’t pay now. You have 7 days to complete payment before account restrictions apply."}
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