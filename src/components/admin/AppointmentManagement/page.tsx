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
} from '@mui/material';
import styles from './AppointmentManagement.module.css';
import SearchIcon from '@mui/icons-material/Search';

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

const AppointmentManagementPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, selectedStatus, selectedType, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('https://mindmingle202.azurewebsites.net/api/Appointment/getAll');
      if (response.data.statusCode === 200) {
        setAppointments(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Typography className={styles.title}>
        Appointment Management
      </Typography>

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
              filteredAppointments.map((appointment) => (
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
    </div>
  );
};

export default AppointmentManagementPage;