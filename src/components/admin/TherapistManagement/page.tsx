import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './TherapistManagement.module.css';
import { getAllTherapist } from '../../../api/Therapist/Therapist';

interface Therapist {
  therapistId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: string;
  pricePerHour: number;
}

const TherapistManagementPage: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    filterTherapists();
  }, [searchTerm, selectedGender, therapists]);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const response = await getAllTherapist();
      if (response.statusCode === 200) {
        setTherapists(response.result);
      } else {
        setError('Failed to fetch therapists');
      }
    } catch (err) {
      setError('Error fetching therapists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTherapists = () => {
    let filtered = [...therapists];

    if (selectedGender !== 'all') {
      filtered = filtered.filter(therapist => therapist.gender === selectedGender);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(therapist =>
        `${therapist.firstName} ${therapist.lastName}`.toLowerCase().includes(searchLower) ||
        therapist.phoneNumber.includes(searchLower)
      );
    }

    setFilteredTherapists(filtered);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
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

  const currentTherapists = filteredTherapists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className={styles.container}>
      <Typography className={styles.title}>
        Therapist Management
      </Typography>

      <Box className={styles.controls}>
        <Box className={styles.searchBox}>
          <SearchIcon className={styles.searchIcon} />
          <TextField
            placeholder="Search by name or phone number..."
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

        <FormControl className={styles.genderFilter}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            label="Gender"
          >
            <MenuItem value="all">All Genders</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableHeader}>ID</TableCell>
              <TableCell className={styles.tableHeader}>Full Name</TableCell>
              <TableCell className={styles.tableHeader}>Phone Number</TableCell>
              <TableCell className={styles.tableHeader}>Date of Birth</TableCell>
              <TableCell className={styles.tableHeader}>Gender</TableCell>
              <TableCell className={styles.tableHeader}>Price Per Hour</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTherapists.map((therapist) => (
              <TableRow
                key={therapist.therapistId}
                className={styles.tableRow}
              >
                <TableCell>{therapist.therapistId}</TableCell>
                <TableCell>
                  {getFullName(therapist.firstName, therapist.lastName)}
                </TableCell>
                <TableCell>{therapist.phoneNumber}</TableCell>
                <TableCell className={styles.dateCell}>
                  {formatDate(therapist.dob)}
                </TableCell>
                <TableCell>
                  <span className={`${styles.genderChip} ${styles[therapist.gender]}`}>
                    {therapist.gender}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={styles.priceChip}>
                    {formatPrice(therapist.pricePerHour)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredTherapists.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[15]}
      />
    </div>
  );
};

export default TherapistManagementPage;