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
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './PatientManagement.module.css';

interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  dob: string | null;
  gender: string;
  phoneNumber: string;
}

const PatientManagementPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://mindmingle202.azurewebsites.net/api/Patient/patient');
      if (response.data.statusCode === 200) {
        setPatients(response.data.result);
      } else {
        setError('Failed to fetch patients');
      }
    } catch (err) {
      setError('Error fetching patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchLower) ||
      patient.phoneNumber.includes(searchLower)
    );
    setFilteredPatients(filtered);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
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

  const currentPatients = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Patient Management
      </Typography>

      <Box className={styles.searchBox}>
        <SearchIcon className={styles.searchIcon} />
        <TextField
          placeholder="Search by name or email..."
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
              <TableCell className={styles.tableHeader}>Patient ID</TableCell>
              <TableCell className={styles.tableHeader}>Full Name</TableCell>
              <TableCell className={styles.tableHeader}>Date of Birth</TableCell>
              <TableCell className={styles.tableHeader}>Gender</TableCell>
              <TableCell className={styles.tableHeader}>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPatients.map((patient) => (
              <TableRow
                key={patient.patientId}
                className={styles.tableRow}
                hover
              >
                <TableCell>{patient.patientId}</TableCell>
                <TableCell>{getFullName(patient.firstName, patient.lastName)}</TableCell>
                <TableCell>{patient.dob ? formatDate(patient.dob) : 'Not set'}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredPatients.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

export default PatientManagementPage;
