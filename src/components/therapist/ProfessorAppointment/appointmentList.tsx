import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Pagination,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "../Header";
import { Appointment, Therapist } from "../../../interface/IAccount";
import { getAppointmentByTherapistId, patchAppointmentStatus } from "../../../api/Appointment/appointment";
import LoadingScreen from "../../common/LoadingScreen";
import styles from './appointmentList.module.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';

export default function AppointmentList() {
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "DECLINED">("PENDING");
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const itemsPerPage = 6; // 6 items total, 3 per row

  useEffect(() => {
    getAppointment();
  }, [refresh]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

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

  // Filter appointments based on active tab
  const filteredAppointments = appointmentList.filter(
    (appointment) => appointment.status === activeTab
  );

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Get count for each status
  const getStatusCount = (status: string) => {
    return appointmentList.filter((appointment) => appointment.status === status).length;
  };

  // Thêm hàm format số lượng
  const formatCount = (count: number) => {
    return count > 10 ? "10+" : count.toString();
  };

  // Cập nhật phần tabs trong component
  const tabs = [
    {
      id: "PENDING",
      label: "Pending",
      count: formatCount(getStatusCount("PENDING"))
    },
    {
      id: "APPROVED",
      label: "Approved",
      count: formatCount(getStatusCount("APPROVED"))
    },
    {
      id: "DECLINED",
      label: "Declined",
      count: formatCount(getStatusCount("DECLINED"))
    },
  ] as const;

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <Box className={styles.container}>
        {/* Thêm clouds */}
        <div className={`${styles.cloud} ${styles.cloud1}`}></div>
        <div className={`${styles.cloud} ${styles.cloud2}`}></div>
        <div className={`${styles.cloud} ${styles.cloud3}`}></div>



        <Header />

        <Box className={styles.contentWrapper}>
          <Box className={styles.titleContainer}>
            <Typography component="h1" className={styles.titleDecoration}>
              <span className={styles.pageTitle}>
                Appointment Management
              </span>
            </Typography>
            <Typography className={styles.titleSubtext}>
              Manage your appointments efficiently
            </Typography>
          </Box>

          {/* Tabs */}
          <Box className={styles.tabContainer}>
            <Box className={styles.tabs}>
              {tabs.map((tab) => (
                <Box
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  <span className={styles.tabCount}>{tab.count}</span>
                </Box>
              ))}
            </Box>
          </Box>

          {filteredAppointments.length === 0 ? (
            <Box className={styles.emptyState}>
              <Typography variant="h6" color="text.secondary">
                No {activeTab.toLowerCase()} appointments found
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={4}>
                {paginatedAppointments.map((appointment) => (
                  <Grid item xs={12} sm={6} md={4} key={appointment.appointmentId}>
                    <Paper className={styles.appointmentCard} elevation={0}>
                      <Box className={styles.cardHeader}>
                        <Typography className={styles.patientName}>
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </Typography>
                        <Typography
                          className={`${styles.statusBadge} ${styles[`status${appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()}`]}`}
                        >
                          {appointment.status}
                        </Typography>
                      </Box>

                      <Box className={styles.appointmentDetails}>
                        {/* Date và Time Row */}
                        <Box className={styles.detailsRow}>
                          <Box className={styles.detailContainer}>
                            <CalendarTodayIcon className={styles.detailIcon} />
                            <span className={styles.dateValue}>
                              {new Date(appointment.session.startTime).toLocaleDateString()}
                            </span>
                          </Box>

                          <Box className={styles.detailContainer}>
                            <AccessTimeIcon className={styles.detailIcon} />
                            <Box className={styles.timeDetails}>
                              <span className={styles.timeValue}>
                                {new Date(appointment.session.startTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                })}
                              </span>
                              <span className={styles.timeSeparator}>-</span>
                              <span className={styles.timeValue}>
                                {new Date(appointment.session.endTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                })}
                              </span>
                            </Box>
                          </Box>
                        </Box>

                        {/* Type và Fee Row */}
                        <Box className={styles.detailsRow}>
                          <Box className={styles.detailContainer}>
                            {appointment.appointmentType === "ONLINE" ? (
                              <ComputerIcon className={styles.detailIcon} />
                            ) : (
                              <PersonIcon className={styles.detailIcon} />
                            )}
                            <span className={styles.detailLabel}>Type:</span>
                            <span className={`${styles.typeChip} ${appointment.appointmentType === "ONLINE"
                              ? styles.typeOnline
                              : styles.typeOffline
                              }`}>
                              {appointment.appointmentType}
                            </span>
                          </Box>

                          <Box className={styles.detailContainer}>
                            <PaidIcon className={styles.detailIcon} />
                            <span className={styles.detailLabel}>Fee:</span>
                            <span className={styles.feeValue}>
                              {appointment.totalFee.toLocaleString()}
                              <span className={styles.currencyLabel}>VND</span>
                            </span>
                          </Box>
                        </Box>
                      </Box>

                      <Box className={styles.actionButtons}>
                        {activeTab === "PENDING" && (
                          <>
                            <Tooltip title="Approve this appointment" arrow>
                              <span>
                                <Button
                                  variant="contained"
                                  className={`${styles.button} ${styles.approveButton}`}
                                  onClick={() => handleApproved(appointment.appointmentId)}
                                >
                                  Approve
                                </Button>
                              </span>
                            </Tooltip>
                            <Tooltip title="Decline this appointment" arrow>
                              <span>
                                <Button
                                  variant="contained"
                                  className={`${styles.button} ${styles.declineButton}`}
                                  onClick={() => handleDeclined(appointment.appointmentId)}
                                >
                                  Decline
                                </Button>
                              </span>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box className={styles.pagination}>
                <Pagination
                  count={Math.ceil(filteredAppointments.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  classes={{
                    root: styles.pagination,
                    item: styles.paginationItem
                  }}
                />
              </Box>
            </>
          )}
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              backgroundColor: snackbarSeverity === "success" ? "#4caf50" : "#f44336",
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