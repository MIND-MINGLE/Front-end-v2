import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  styled,
} from "@mui/material";
import { Appointment, Patient } from "../../../../interface/IAccount";
import { getAppointmentByPatientId } from "../../../../api/Appointment/appointment";
import { useNavigate } from "react-router";
import { formatPriceToVnd } from "../../../../services/common";

// Styled components
const AppointmentCard = styled(Card)(({ status }: { status?: string }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 119, 182, 0.2)",
  backgroundColor: "#F5F7FA",
  border: 
    status === "APPROVED" ? "2px solid #4caf50" : // Green for approved
    status === "PENDING" ? "2px solid #1b9df0" :  // Blue for pending
    status === "DECLINED" || status === "CANCELED" ? "2px solid #f44336" : // Red for declined/canceled
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
    status === "DECLINED" || status === "CANCELED" ? "#f44336" :
    "#757575", // Gray fallback
  color: "#FFFFFF",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "bold",
}));

const HistoryAppointment: React.FC = () => {
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate()
  const gotoChat=()=>{
    nav(`/seeker/therapy-chat`);
  }

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

  // Derive "Started Date" from dayOfWeek and endTime
  const getStartedDate = (session: Appointment["session"]) => {
    const endDate = new Date(session.endTime);
    return `${session.dayOfWeek} - ${endDate.toLocaleDateString()}`;
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
              onClick={()=>{appt.status==="PENDING"||appt.status==="APPROVED"?gotoChat():null}}
              status={appt.status}>
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
                </CardContent>
              </AppointmentCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HistoryAppointment;