import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  TablePagination,
} from '@mui/material';
import styles from './AppointmentManagement.module.css';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAllAppointment } from '../../../api/Appointment/appointment';
import { getAllPaymentPending, handlePaymentStatus } from '../../../api/Payment/PaymentApi';

interface Appointment {
  appointmentId: string;
  appointmentType: 'ONLINE' | 'OFFLINE';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELED';
  totalFee: number;
  createdAt: string;
  session: {
    startTime: string;
    endTime: string;
  };
  patient: {
    firstName: string;
    lastName: string;
  };
  therapist: {
    firstName: string;
    lastName: string;
  };
  emergencyEnd?: {
    reason: string;
    accountId: string;
    emergencyEndId: string;
  };
}
interface PaymentResponse {
  items: Payment[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

interface Payment {
  paymentId: string;
  patientId: string;
  appointment: {
    appointmentId: string;
  }
  patient: {
    firstName: string;
    lastName: string;
  };
  amount: number;
  therapistReceive: number;
  paymentUrl: string;
  paymentMethod: string;
  paymentStatus: string;
  subscriptionId: string;
}

const AppointmentManagementPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentPageSize] = useState(10);
  const [openPayments, setOpenPayments] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(6);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, selectedStatus, selectedType, appointments]);

  const fetchPendingPayments = async () => {
    try {
      setPaymentLoading(true);
      const response:PaymentResponse = await getAllPaymentPending(paymentPage,paymentPageSize);
      if (response.items) {
        const filteredPayments = response.items.filter(payment =>
          payment.paymentStatus === "PENDING" && payment.appointment !== null
        );
        setPendingPayments(filteredPayments);
      }
    } catch (err: any) {
      console.error('Error fetching pending payments:', err);
    } finally {
      setPaymentLoading(false);
    }
  };
  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointment();
      if (response.statusCode === 200) {
        setAppointments(response.result);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenPendingPayments = async () => {
    try {
      setOpenPayments(true);
      await fetchPendingPayments();
    } catch (err) {
      console.error('Error opening pending payments:', err);
      setSnackbarMessage('Error opening pending payments');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  const handlePaymentAction = async (payment: Payment, action: 'PAID' | 'CANCELED') => {
    try {
      setProcessingPayment(true);
      const response = await handlePaymentStatus(payment.paymentId,action);

      if (response.statusCode === 200) {
        setPendingPayments(prevPayments =>
          prevPayments.filter(p => p.paymentId !== payment.paymentId)
        );

        if (action === 'PAID') {
          setSnackbarMessage('Payment has been approved successfully');
        } else {
          setSnackbarMessage('Payment has been canceled successfully');
        }
        setSnackbarSeverity('success');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setSnackbarMessage(`Failed to ${action === 'PAID' ? 'approve' : 'cancel'} payment`);
      setSnackbarSeverity('error');
    } finally {
      setProcessingPayment(false);
      setOpenSnackbar(true);
    }
  };
  const handlePaymentPageChange = (event: unknown, newPage: number) => {
    setPaymentPage(newPage);
    fetchPendingPayments();
  };
  const filterAppointments = () => {
    let filtered = [...appointments];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => {
        const patientName = getFullName(appointment.patient.firstName, appointment.patient.lastName).toLowerCase();
        const therapistName = getFullName(appointment.therapist.firstName, appointment.therapist.lastName).toLowerCase();
        return patientName.includes(searchLower) || therapistName.includes(searchLower);
      });
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(appointment => appointment.appointmentType === selectedType);
    }

    setFilteredAppointments(filtered);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'DECLINED': return 'error';
      case 'CANCELED': return 'default';
      default: return 'default';
    }
  };

  const controlsStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" className={styles.title}>
          Appointment Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<ReceiptLongIcon />}
          onClick={handleOpenPendingPayments}
          className={styles.viewRequestsButton}
        >
          View Appointment Payments
        </Button>
      </Box>

      <Box sx={controlsStyle}>
        <TextField
          className={styles.searchField}
          placeholder="Search by patient or therapist name..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="DECLINED">Declined</MenuItem>
            <MenuItem value="CANCELED">Canceled</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={selectedType}
            label="Type"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="ONLINE">Online</MenuItem>
            <MenuItem value="OFFLINE">Offline</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableHeader}>Patient Name</TableCell>
              <TableCell className={styles.tableHeader}>Therapist Name</TableCell>
              <TableCell className={styles.tableHeader}>Session Time</TableCell>
              <TableCell className={styles.tableHeader}>Type</TableCell>
              <TableCell className={styles.tableHeader}>Status</TableCell>
              <TableCell className={styles.tableHeader}>Total Fee</TableCell>
              <TableCell className={styles.tableHeader}>Created At</TableCell>
              <TableCell className={styles.tableHeader}>Emergency End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow key={appointment.appointmentId} className={styles.tableRow}>
                    <TableCell className={styles.tableCell}>
                      {getFullName(appointment.patient.firstName, appointment.patient.lastName)}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {getFullName(appointment.therapist.firstName, appointment.therapist.lastName)}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <div className={styles.sessionTime}>
                        <span className={styles.timeSlot}>
                          Start: {formatDateTime(appointment.session.startTime)}
                        </span>
                        <span className={styles.timeSlot}>
                          End: {formatDateTime(appointment.session.endTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Chip
                        label={appointment.appointmentType}
                        className={`${styles.typeChip} ${appointment.appointmentType === 'ONLINE'
                          ? styles.typeOnline
                          : styles.typeOffline
                          }`}
                        size="small"
                      />
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Chip
                        label={appointment.status}
                        className={`${styles.statusChip} ${styles[appointment.status.toLowerCase()]}`}
                        size="small"
                      />
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <span className={styles.price}>
                        {formatPrice(appointment.totalFee)}
                      </span>
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {formatDateTime(appointment.createdAt)}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {appointment.emergencyEnd && (
                        <div className={styles.emergencyContainer}>
                          <Typography variant="caption" className={styles.emergencyReason}>
                            {appointment.emergencyEnd.reason}
                          </Typography>
                          <Typography variant="caption" className={styles.emergencyAccount}>
                            ID: {appointment.emergencyEnd.accountId}
                          </Typography>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className={styles.noDataCell}>
                  <Box className={styles.noDataContent}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.noDataIcon}
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <Typography variant="h6" className={styles.noDataTitle}>
                      Không tìm thấy kết quả
                    </Typography>
                    <Typography variant="body2" className={styles.noDataText}>
                      {searchTerm
                        ? "Không tìm thấy cuộc hẹn nào phù hợp với từ khóa tìm kiếm"
                        : "Không có cuộc hẹn nào phù hợp với bộ lọc đã chọn"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAppointments.length > 0 && (
        <TablePagination
          component="div"
          count={filteredAppointments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[6]}
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
              display: 'none',
            },
          }}
        />
      )}

      <Dialog
        open={openPayments}
        onClose={() => setOpenPayments(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Pending Appointment Payments</DialogTitle>
        <DialogContent>
          {paymentLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : pendingPayments.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                minHeight: '200px',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <ReceiptLongIcon
                sx={{
                  fontSize: '64px',
                  color: 'rgba(0, 0, 0, 0.2)'
                }}
              />
              <Typography
                variant="h6"
                color="text.secondary"
                align="center"
              >
                Hiện tại chưa có payment nào đang chờ xử lý
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment ID</TableCell>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Payment Proof</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingPayments
                      .slice(paymentPage * paymentPageSize, paymentPage * paymentPageSize + paymentPageSize)
                      .map((payment) => (
                        <TableRow key={payment.paymentId}>
                          <TableCell>{payment.paymentId}</TableCell>
                          <TableCell>
                            {`${payment.patient.firstName} ${payment.patient.lastName}`}
                          </TableCell>
                          <TableCell>{formatPrice(payment.amount)}</TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell>
                            <img
                              src={payment.paymentUrl}
                              alt="Payment proof"
                              className={styles.paymentProof}
                              onClick={() => handleImageClick(payment.paymentUrl)}
                              style={{ cursor: 'pointer' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                color="success"
                                onClick={() => handlePaymentAction(payment, 'PAID')}
                                disabled={processingPayment}
                                sx={{
                                  padding: '8px',
                                  '& svg': { fontSize: '28px' },
                                  '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)'
                                  }
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handlePaymentAction(payment, 'CANCELED')}
                                disabled={processingPayment}
                                sx={{
                                  padding: '8px',
                                  '& svg': { fontSize: '28px' },
                                  '&:hover': {
                                    backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                  }
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={pendingPayments.length}
                page={paymentPage}
                onPageChange={handlePaymentPageChange}
                rowsPerPage={paymentPageSize}
                rowsPerPageOptions={[10]}
                sx={{
                  '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
                    display: 'none',
                  },
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        maxWidth="lg"
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <IconButton
            onClick={() => setOpenImageModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CancelIcon />
          </IconButton>
          <img
            src={selectedImage}
            alt="Payment proof full size"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            onClick={() => setOpenImageModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AppointmentManagementPage;