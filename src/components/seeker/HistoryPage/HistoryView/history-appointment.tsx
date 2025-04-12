import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Snackbar,
  Alert,
  DialogContentText,
  Link,
} from "@mui/material";
import { Appointment, AppointmentPaymentRequest, Patient, PaymentProps, RatingRequest } from "../../../../interface/IAccount";
import { getAppointmentByPatientId } from "../../../../api/Appointment/appointment";
import { useNavigate } from "react-router";
import { formatPriceToVnd } from "../../../../services/common";
import { createRating } from "../../../../api/Rating/RatingAPI";
import { createAppPayment, getPaymentByPatientId } from "../../../../api/Payment/PaymentApi";

// Styled components
const AppointmentCard = styled(Card)(({ status }: { status?: string }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 119, 182, 0.2)",
  backgroundColor: "#F5F7FA",
  border:
    status === "APPROVED" ? "2px solid #4caf50" :
    status === "PENDING" ? "2px solid #1b9df0" :
    status === "ENDED" ? "2px solid #f44336" :
    status === "DECLINED" || status === "CANCELED" ? "2px solid #828282" :
    "1px solid #e0e0e0",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 6px 16px rgba(0, 119, 182, 0.3)",
  },
}));

const CardTitle = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "24px",
  color: "#0077b6",
  marginBottom: "8px",
}));

const CardText = styled(Typography)(() => ({
  fontSize: "18px",
  color: "#333333",
  marginBottom: "4px",
}));

const StatusBadge = styled(Box)(({ status }: { status?: string }) => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor:
    status === "APPROVED" ? "#4caf50" :
    status === "PENDING" ? "#1b9df0" :
    status === "ENDED" ? "#f44336" :
    status === "DECLINED" || status === "CANCELED" ? "#828282" :
    "#757575",
  color: "#FFFFFF",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "bold",
}));

const ReviewButton = styled(Button)(() => ({
  background: "linear-gradient(to right, #ff9800, #f57c00)",
  color: "#FFFFFF",
  borderRadius: "20px",
  padding: "6px 16px",
  fontSize: "14px",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(to right, #fb8c00, #ef6c00)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(245, 124, 0, 0.3)",
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

const ReviewBox = styled(Box)(() => ({
  marginTop: "12px",
  padding: "12px",
  backgroundColor: "#e8f4fd",
  borderRadius: "8px",
  borderLeft: "4px solid #0077b6",
}));

const HistoryAppointment: React.FC = () => {
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);
  const [paymentList, setPaymentList] = useState<PaymentProps[]>([]);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewScore, setReviewScore] = useState<number | null>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointmentList();
    fetchPaymentList();
  }, []);

  const fetchAppointmentList = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientAccount = sessionStorage.getItem("patient");
      if (patientAccount) {
        const data: Patient = JSON.parse(patientAccount);
        const appointmentData = await getAppointmentByPatientId(data.patientId);
        if (appointmentData.statusCode === 200) {
          const appointments: Appointment[] = appointmentData.result;
          setAppointmentList(appointments);
        } else {
          setError("Failed to fetch appointment history");
        }
      } else {
        setError("No patient account found");
      }
    } catch (err) {
      setError("Error fetching appointment history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentList = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientAccount = sessionStorage.getItem("patient");
      if (patientAccount) {
        const data: Patient = JSON.parse(patientAccount);
        const paymentData = await getPaymentByPatientId(data.patientId);
        if (paymentData.statusCode === 200) {
          setPaymentList(paymentData.result);
        } else {
          setPaymentList([]);
        }
      } else {
        setError("No patient account found");
      }
    } catch (err) {
      setError("Error fetching payment history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const gotoChat = () => {
    navigate(`/seeker/therapy-chat`);
  };

  const getStartedDate = (session: Appointment["session"]) => {
    const endDate = new Date(session.endTime);
    return `${session.dayOfWeek} - ${endDate.toLocaleDateString()}`;
  };

  const isUnpaidAppointment = (appointmentId: string) => {
    return !paymentList.some(
      (payment) =>
        payment.appointment?.appointmentId === appointmentId &&
        payment.paymentStatus === "PAID"
    );
  };

  const handleOpenPaymentDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setAppDialogOpen(false);
    setSelectedAppointment(null);
    setPaymentUrl("");
  };

  const handleSubmitPayment = async () => {
    setLoading(true)
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
        // Close dialog on success
        handleClosePaymentDialog();
        
        // Refresh payment list to reflect new payment
        await fetchPaymentList();
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (err) {
      setSnackbarMessage("Error initiating payment");
      setSnackbarOpen(true);
      console.error(err);
    }
    finally{
      setLoading(false)
    }
  };

  // Review dialog handlers
  const handleOpenReviewDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReviewComment("");
    setReviewScore(0);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedAppointment(null);
  };

  const handleSubmitReview = async () => {
    if (!selectedAppointment || reviewScore === null) return;

    const patientAccount = sessionStorage.getItem("patient");
    if (!patientAccount) {
      setError("No patient account found");
      return;
    }
    const patient: Patient = JSON.parse(patientAccount);

    const reviewData: RatingRequest = {
      patientId: patient.patientId,
      appointmentId: selectedAppointment.appointmentId,
      comment: reviewComment,
      score: reviewScore,
      therapistId: selectedAppointment.therapistId,
    };

    try {
      const response = await createRating(reviewData);
      if (response.statusCode === 200 && response.result) {
        setSnackbarMessage("Review submitted successfully!");
        setSnackbarOpen(true);
        // Refresh appointments to sync with server
        await fetchAppointmentList();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setSnackbarMessage("Failed to submit review. Refreshing data...");
      setSnackbarOpen(true);
      console.error(err);
      await fetchAppointmentList();
    }

    handleCloseReviewDialog();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", px: 2 }}>
        <Typography variant="h5" color="#0077b6" sx={{ mb: 3, fontWeight: "bold" }}>
          Appointment History
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : appointmentList.length === 0 ? (
          <Typography color="textSecondary">No appointment history found.</Typography>
        ) : (
          <Grid container spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
            {appointmentList.map((appt) => (
              <Grid item xs={12} sm={6} md={6} key={appt.appointmentId}>
                <AppointmentCard
                  onClick={() => (appt.status === "PENDING" || appt.status === "APPROVED" ? gotoChat() : null)}
                  status={appt.status}
                >
                  <CardContent sx={{ position: "relative", p: 2 }}>
                    <StatusBadge status={appt.status}>{appt.status}</StatusBadge>
                    <CardTitle>
                      {appt.therapist ? `${appt.therapist.firstName} ${appt.therapist.lastName}` : "Unknown Therapist"}
                    </CardTitle>
                    <CardText>Type: {appt.appointmentType}</CardText>
                    <CardText>Start: {new Date(appt.session.startTime).toLocaleTimeString()}</CardText>
                    <CardText>End: {new Date(appt.session.endTime).toLocaleTimeString()}</CardText>
                    <CardText>Started Date: {getStartedDate(appt.session)}</CardText>
                    <CardText>Total Fee: {formatPriceToVnd(appt.totalFee)}</CardText>

                    {/* Payment and Review Buttons */}
                    {appt.status === "ENDED" && (
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        {isUnpaidAppointment(appt.appointmentId) && (
                          <PaymentButton onClick={() => handleOpenPaymentDialog(appt)}>
                            Payment
                          </PaymentButton>
                        )}
                        {!appt.ratings && (
                          <ReviewButton onClick={() => handleOpenReviewDialog(appt)}>
                            Write a Review
                          </ReviewButton>
                        )}
                      </Box>
                    )}

                    {/* Display Existing Review */}
                    {appt.ratings != null && (
                      <ReviewBox>
                        <Typography variant="subtitle2" color="#0077b6" sx={{ fontWeight: "bold" }}>
                          Your Review
                        </Typography>
                        <Rating value={appt.ratings.score} readOnly size="small" sx={{ color: "#ff9800", my: 1 }} />
                        <Typography variant="body2" color="#333">
                          {appt.ratings.comment}
                        </Typography>
                        <Typography variant="caption" color="#757575" sx={{ mt: 1 }}>
                          {new Date(appt.ratings.createdAt).toLocaleDateString()}
                        </Typography>
                      </ReviewBox>
                    )}
                  </CardContent>
                </AppointmentCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Review Dialog */}
        <Dialog
          open={openReviewDialog}
          onClose={handleCloseReviewDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "#0077b6" }}>
            Write a Review
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Typography variant="body1" color="#333">
                How would you rate this appointment?
              </Typography>
              <Rating
                name="review-score"
                value={reviewScore}
                onChange={(_, newValue) => setReviewScore(newValue)}
                precision={1}
                size="large"
                sx={{ color: "#ff9800" }}
              />
              <TextField
                label="Your Comments"
                multiline
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="Share your experience..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseReviewDialog}
              sx={{ color: "#757575", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              sx={{
                backgroundColor: "#0077b6",
                color: "#FFFFFF",
                textTransform: "none",
                "&:hover": { backgroundColor: "#005f8d" },
              }}
              disabled={!reviewComment.trim() || reviewScore === null}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={appDialogOpen} onClose={handleClosePaymentDialog}>
          <DialogTitle>Your Appointment Has Ended</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You’ll now be redirected to the Payment Section.
            </DialogContentText>
            <DialogContentText>---</DialogContentText>
            <Typography color="warning.main">
              *You can cancel the payment if you can't pay now. There will be a 7-day period for you to complete your payment before we soft-lock your account. Thank you!
            </Typography>
            {paymentUrl !== "" && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography color="warning.main">
                  Popup blocked. Please use this link:
                </Typography>
                <Link href={paymentUrl} target="_blank">
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
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              Proceed to Payment
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

        {/* Snackbar for Feedback */}
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
      </Box>
    </>
  );
};

export default HistoryAppointment;