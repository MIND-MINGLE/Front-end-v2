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
} from "@mui/material";
import { Appointment, Patient, RatingRequest } from "../../../../interface/IAccount";
import { getAppointmentByPatientId } from "../../../../api/Appointment/appointment";
import { useNavigate } from "react-router";
import { formatPriceToVnd } from "../../../../services/common";
import { createRating } from "../../../../api/Rating/RatingAPI";

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

const ReviewBox = styled(Box)(() => ({
  marginTop: "12px",
  padding: "12px",
  backgroundColor: "#e8f4fd",
  borderRadius: "8px",
  borderLeft: "4px solid #0077b6",
}));

const HistoryAppointment: React.FC = () => {
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewScore, setReviewScore] = useState<number | null>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointmentList();
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

  const gotoChat = () => {
    navigate(`/seeker/therapy-chat`);
  };

  const getStartedDate = (session: Appointment["session"]) => {
    const endDate = new Date(session.endTime);
    return `${session.dayOfWeek} - ${endDate.toLocaleDateString()}`;
  };

  // Review dialog handlers
  const handleOpenReviewDialog = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setReviewComment("");
    setReviewScore(0);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedAppointmentId(null);
  };

  const handleSubmitReview = async () => {
    if (!selectedAppointmentId || reviewScore === null) return;
  
    const patientAccount = sessionStorage.getItem("patient");
    if (!patientAccount) {
      setError("No patient account found");
      return;
    }
    const patient: Patient = JSON.parse(patientAccount);
  
    const reviewData: RatingRequest = {
      patientId: patient.patientId,
      appointmentId: selectedAppointmentId,
      comment: reviewComment,
      score: reviewScore,
    };
  
    try {
      const response = await createRating(reviewData);
      if (response.statusCode === 200 && response.result) {
        setSnackbarMessage("Review submitted successfully!");
        setSnackbarOpen(true);
        // Optimistically update the appointment with the new rating
        setAppointmentList((prev) =>
          prev.map((appt) =>
            appt.appointmentId === selectedAppointmentId
              ? { ...appt, rating: response.result }
              : appt
          )
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setSnackbarMessage("Failed to submit review. Refreshing data...");
      setSnackbarOpen(true);
      console.error(err);
      // Fallback: Refetch appointments to sync with server
      await fetchAppointmentList();
    }
  
    handleCloseReviewDialog();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
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

                  {/* Write a Review Button */}
                  {appt.status === "ENDED" && !appt.ratings ? (
                    <Box sx={{ mt: 2, textAlign: "right" }}>
                      <ReviewButton onClick={() => handleOpenReviewDialog(appt.appointmentId)}>
                        Write a Review
                      </ReviewButton>
                    </Box>
                  ):null}

                  {/* Display Existing Review */}
                  {appt.ratings!=null? (
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
                  ):null}
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
              onChange={(event, newValue) => setReviewScore(newValue)}
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
  );
};

export default HistoryAppointment;