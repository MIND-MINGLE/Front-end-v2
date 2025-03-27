import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Pagination,
  Tooltip,
  styled,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "../Header"; // Your existing header
import { Appointment, Therapist } from "../../../interface/IAccount";
import { getAppointmentByTherapistId, patchAppointmentStatus } from "../../../api/Appointment/appointment";
import LoadingScreen from "../../common/LoadingScreen";

// Styled components
const AppointmentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  background: "#FFFFFF",
  boxShadow: "0 4px 12px rgba(0, 119, 182, 0.2)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 6px 16px rgba(0, 119, 182, 0.3)",
  },
}));

const StatusBadge = styled(Typography)(({ status }: { status: string }) => ({
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#FFFFFF",
  backgroundColor:
    status === "PENDING"
      ? "#ff9800" // Orange for pending
      : status === "APPROVED"
      ? "#4caf50" // Green for approved
      : "#f44336", // Red for declined/canceled
}));

const ActionButton = styled(Button)(() => ({
  margin: "0 8px",
  borderRadius: "20px",
  textTransform: "none",
}));

export default function AppointmentList() {
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);
  const [isLoading,setIsLoading] = useState(false)
  const [refresh,setRefresh] = useState(false)
  const [page, setPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const itemsPerPage = 6; // 6 items total, 3 per row

  useEffect(() => {
    getAppointment();
  }, [refresh]);

  const getAppointment = async () => {
    setIsLoading(true)
      const sessionAccount = sessionStorage.getItem("therapist");
      if (sessionAccount) {
        try {
          const data: Therapist = JSON.parse(sessionAccount);
          const appointmentData = await getAppointmentByTherapistId(data.therapistId);
          if (appointmentData.statusCode === 200) {
            const appointments: Appointment[] = appointmentData.result;
            setAppointmentList(appointments);
          }
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      } else {
        console.log("No therapist found");
      }
      setIsLoading(false)
    }

  // Pagination logic
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(event)
    setPage(value);
  };
  const handleApproved = async (appId: string) => {
    try {
      const response = await patchAppointmentStatus("Approved", appId);
      if (response.statusCode === 200) {
        setSnackbarMessage("Appointment approved successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setRefresh(!refresh); // Trigger re-fetch
      } else {
        throw new Error("Failed to approve appointment");
      }
    } catch (error) {
      setSnackbarMessage("Error approving appointment");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error in handleApproved:", error);
    }
  };

  const handleDeclined = async (appId: string) => {
    try {
      const response = await patchAppointmentStatus("Declined", appId);
      if (response.statusCode === 200) {
        setSnackbarMessage("Appointment declined successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setRefresh(!refresh); // Trigger re-fetch
      } else {
        throw new Error("Failed to decline appointment");
      }
    } catch (error) {
      setSnackbarMessage("Error declining appointment");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error in handleDeclined:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const paginatedAppointments = appointmentList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
    {isLoading?<LoadingScreen/>:null}
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #DFF6FF 0%, #FFFFFF 100%)",
      }}
    >
      <Header />

      {/* Main Content */}
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", pt: 12, pb: 4, px: 2 }}>
        <Typography
          variant="h4"
          color="#0077b6"
          sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
        >
          Appointment List
        </Typography>

        {appointmentList.length === 0 ? (
          <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center" }}>
            No appointments found.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedAppointments.map((appointment) => (
                <Grid item xs={12} sm={6} md={4} key={appointment.appointmentId}>
                  <AppointmentCard elevation={2}>
                    <Typography variant="h6" color="#0077b6" gutterBottom>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(appointment.session.startTime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Time: {new Date(appointment.session.startTime).toLocaleTimeString()} -{" "}
                      {new Date(appointment.session.endTime).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Type: {appointment.appointmentType}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fee: {appointment.totalFee.toLocaleString()} VND
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <StatusBadge status={appointment.status}>
                        {appointment.status}
                      </StatusBadge>
                    </Box>
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Approve this appointment" arrow>
                        <ActionButton
                          variant="contained"
                          sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#45a049" } }}
                          disabled={appointment.status !== "PENDING"}
                          onClick={()=>{handleApproved(appointment.appointmentId)}}
                        >
                          Approve
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Decline this appointment" arrow>
                        <ActionButton
                          variant="contained"
                          sx={{ backgroundColor: "#f44336", "&:hover": { backgroundColor: "#e53935" } }}
                          disabled={appointment.status !== "PENDING"}
                          onClick={()=>{handleDeclined(appointment.appointmentId)}}
                        >
                          Decline
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </AppointmentCard>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={Math.ceil(appointmentList.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#0077b6",
                    "&.Mui-selected": {
                      backgroundColor: "#0077b6",
                      color: "#FFFFFF",
                    },
                  },
                }}
              />
            </Box>
          </>
        )}
      </Box>
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor: snackbarSeverity === "success" ? "#4caf50" : "#f44336", // Green for success, red for error
            color: "#FFFFFF",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
}