import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import styles from './SubscriptionManagement.module.css';

interface Subscription {
  purchasedPackageId: string;
  patientId: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  subscription: {
    packageName: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    isDisabled: boolean;
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
  amount: number;
  therapistReceive: number;
  paymentUrl: string;
  paymentMethod: string;
  paymentStatus: string;
  subscriptionId: string;
}

interface CreatePurchaseRequest {
  patientId: string;
  subscriptionId: string;
}

const SubscriptionManagementPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [openPayments, setOpenPayments] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotalCount, setPaymentTotalCount] = useState(0);
  const [paymentPageSize] = useState(10);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [searchTerm, subscriptions]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://mindmingle202.azurewebsites.net/api/PurchasedPackage');
      if (response.data.statusCode === 200) {
        setSubscriptions(response.data.result);
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (err) {
      setError('Error fetching subscriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterSubscriptions = () => {
    if (!searchTerm) {
      setFilteredSubscriptions(subscriptions);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = subscriptions.filter(sub =>
      sub.purchasedPackageId.toLowerCase().includes(searchLower) ||
      sub.patientId.toLowerCase().includes(searchLower) ||
      sub.subscription.packageName.toLowerCase().includes(searchLower)
    );
    setFilteredSubscriptions(filtered);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
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

  const fetchPendingPayments = async () => {
    try {
      setPaymentLoading(true);
      const response = await axios.get<PaymentResponse>('https://mindmingle202.azurewebsites.net/api/Payment/get-all-by-pending-status', {
        params: {
          pageIndex: paymentPage,
          pageSize: paymentPageSize,
        },
      });

      if (response.data) {
        setPendingPayments(response.data.items);
        setPaymentTotalCount(response.data.totalCount);
      }
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      setSnackbarMessage('Error fetching pending payments');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setPaymentLoading(false);
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

  const handlePaymentPageChange = (event: unknown, newPage: number) => {
    setPaymentPage(newPage + 1);
    fetchPendingPayments();
  };

  const handlePaymentAction = async (payment: Payment, action: 'PAID' | 'CANCELED') => {
    try {
      setProcessingPayment(true);
      const endpoint = action === 'PAID'
        ? `https://mindmingle202.azurewebsites.net/api/Payment/${payment.paymentId}/status/paid`
        : `https://mindmingle202.azurewebsites.net/api/Payment/${payment.paymentId}/status/canceled`;

      const response = await axios.patch(endpoint);

      if (response.status === 200) {
        if (action === 'PAID') {
          const subscription = subscriptions[0];
          if (subscription) {
            await createPurchasePackage({
              patientId: payment.patientId,
              subscriptionId: subscription.subscriptionId
            });
            setSnackbarMessage('Payment has been approved and subscription created successfully');
            await fetchSubscriptions();
          }
        } else {
          setSnackbarMessage('Payment has been canceled successfully');
        }
        setSnackbarSeverity('success');
        await fetchPendingPayments();
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

  const createPurchasePackage = async (request: CreatePurchaseRequest) => {
    try {
      await axios.post('https://mindmingle202.azurewebsites.net/api/PurchasedPackage', request);
    } catch (err) {
      console.error('Error creating purchase package:', err);
      throw err;
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  const currentSubscriptions = filteredSubscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className={styles.container}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" className={styles.title}>
          Subscription Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<ReceiptLongIcon />}
          onClick={handleOpenPendingPayments}
          className={styles.viewRequestsButton}
        >
          View Pending Requests
        </Button>
      </Box>

      <Box className={styles.searchBox}>
        <SearchIcon className={styles.searchIcon} />
        <TextField
          placeholder="Search by ID or package name..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          fullWidth
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Box>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableHeader}>Purchase ID</TableCell>
              <TableCell className={styles.tableHeader}>Patient ID</TableCell>
              <TableCell className={styles.tableHeader}>Package Name</TableCell>
              <TableCell className={styles.tableHeader}>Price</TableCell>
              <TableCell className={styles.tableHeader}>Start Date</TableCell>
              <TableCell className={styles.tableHeader}>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSubscriptions.map((sub) => (
              <TableRow
                key={sub.purchasedPackageId}
                className={styles.tableRow}
                hover
              >
                <TableCell>{sub.purchasedPackageId}</TableCell>
                <TableCell>{sub.patientId}</TableCell>
                <TableCell>
                  <span className={styles.packageChip}>
                    {sub.subscription.packageName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={styles.priceChip}>
                    {formatPrice(sub.subscription.price)}
                  </span>
                </TableCell>
                <TableCell>{formatDate(sub.startDate)}</TableCell>
                <TableCell>{formatDate(sub.endDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredSubscriptions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[15]}
      />

      <Dialog
        open={openPayments}
        onClose={() => setOpenPayments(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Pending Payment Requests</DialogTitle>
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
                      <TableCell>Patient ID</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Payment Proof</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingPayments.map((payment) => (
                      <TableRow key={payment.paymentId}>
                        <TableCell>{payment.paymentId}</TableCell>
                        <TableCell>{payment.patientId}</TableCell>
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
                                '& svg': {
                                  fontSize: '28px'
                                },
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
                                '& svg': {
                                  fontSize: '28px'
                                },
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
                count={paymentTotalCount}
                page={paymentPage - 1}
                onPageChange={handlePaymentPageChange}
                rowsPerPage={paymentPageSize}
                rowsPerPageOptions={[10]}
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
            }}
            className={styles.fullSizeImage}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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

export default SubscriptionManagementPage;