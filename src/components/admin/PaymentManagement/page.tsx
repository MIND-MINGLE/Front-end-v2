import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
  Chip,
  Card,
} from '@mui/material';
import styles from './PaymentManagement.module.css';
import { getAllPayment } from '../../../api/Payment/PaymentApi';

type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELED';

interface Payment {
  paymentId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  appointment: {
    appointmentId: string;
  }
  patient: {
    firstName: string;
    lastName: string;
  };
}

interface ApiResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

const PaymentManagementPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);



  const fetchPayments = async (pageIndex: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await getAllPayment(pageIndex, pageSize) as ApiResponse<Payment>;
      setPayments(response.items);
      setTotalItems(response.totalCount);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(pageIndex, rowsPerPage);
  }, [pageIndex, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    const newPageIndex = newPage + 1;
    setPageIndex(newPageIndex);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageIndex(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };


  const getStatusLabel = (status: PaymentStatus) => {
    if (!status) return 'Unknown';

    switch (status.toString().toUpperCase()) {
      case 'PAID':
        return 'PAID';
      case 'PENDING':
        return 'PENDING';
      case 'CANCELED':
        return 'CANCELED';
      default:
        return status.toString();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography className={styles.title}>
          Payment Management
        </Typography>
      </div>

      <Card className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tableHeader}>Payment ID</TableCell>
                    <TableCell className={styles.tableHeader}>Therapist</TableCell>
                    <TableCell className={styles.tableHeader}>Patient</TableCell>
                    <TableCell className={styles.tableHeader}>Has Appointment</TableCell>
                    <TableCell className={styles.tableHeader} align="right">Amount</TableCell>
                    <TableCell className={styles.tableHeader} align="center">Status</TableCell>
                    <TableCell className={styles.tableHeader}>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.paymentId} className={styles.tableRow} hover>
                      <TableCell>{payment.paymentId}</TableCell>
                      <TableCell>{payment.patient.firstName} {payment.patient.lastName}</TableCell>
                      <TableCell>{payment.patient.firstName} {payment.patient.lastName}</TableCell>
                      <TableCell>{payment.appointment ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell align="center">
                        <div className={`${styles.statusChip} ${styles[payment.paymentStatus.toLowerCase()]}`}>
                          {getStatusLabel(payment.paymentStatus)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={pageIndex - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default PaymentManagementPage;