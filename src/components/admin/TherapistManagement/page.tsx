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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  styled,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './TherapistManagement.module.css';
import { getAllTherapist,updateTherapistAccount } from '../../../api/Therapist/Therapist';
import { formatPriceToVnd } from '../../../services/common';

interface Therapist {
  therapistId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string;
  dob: string;
  gender: string;
  pricePerHour: number;
  account: Account;
}

interface Account {
  accountId: string;
  accountName: string;
  email: string;
  avatar: string;
  isDisabled: boolean;
}

// Styled components
const ActivateButton = styled(Button)(() => ({
  background: 'linear-gradient(to right, #4caf50, #388e3c)',
  color: '#FFFFFF',
  borderRadius: '20px',
  padding: '4px 12px',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(to right, #43a047, #2e7d32)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
  },
}));

const StatusChip = styled('span')<{ isDisabled: boolean }>(({ isDisabled }) => ({
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 500,
  color: '#FFFFFF',
  backgroundColor: isDisabled ? '#f44336' : '#4caf50',
}));

const TherapistManagementPage: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

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
      filtered = filtered.filter((therapist) => therapist.gender === selectedGender);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (therapist) =>
          `${therapist.firstName} ${therapist.lastName}`.toLowerCase().includes(searchLower) ||
          therapist.phoneNumber.includes(searchLower)
      );
    }

    setFilteredTherapists(filtered);
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const formatDate = (dateString: string) => {
    try {
      // Handle backend format: "YYYY-MM-DD HH:mm:ss.SSSSSS"
      const datePart = dateString.split(' ')[0]; // Extract "YYYY-MM-DD"
      const [year, month, day] = datePart.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const handleOpenDialog = (accountId: string) => {
    setSelectedAccountId(accountId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAccountId(null);
    setDialogLoading(false);
  };

  const handleActivateAccount = async () => {
    if (!selectedAccountId) return;
    setDialogLoading(true);
    try {
      const result = await updateTherapistAccount(selectedAccountId);
      if (result.statusCode === 200) {
        await fetchTherapists();
        handleCloseDialog();
      } else {
        setError('Failed to activate account');
      }
    } catch (err) {
      setError('Error activating account');
      console.error(err);
    } finally {
      setDialogLoading(false);
    }
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
      <Typography className={styles.title}>Therapist Management</Typography>

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
              <TableCell className={styles.tableHeader}>Full Name</TableCell>
              <TableCell className={styles.tableHeader}>Phone Number</TableCell>
              <TableCell className={styles.tableHeader}>Date of Birth</TableCell>
              <TableCell className={styles.tableHeader}>Gender</TableCell>
              <TableCell className={styles.tableHeader}>Price Per Hour</TableCell>
              <TableCell className={styles.tableHeader}>Account Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTherapists.map((therapist) => (
              <TableRow key={therapist.therapistId} className={styles.tableRow}>
                <TableCell>{getFullName(therapist.firstName, therapist.lastName)}</TableCell>
                <TableCell>{therapist.phoneNumber}</TableCell>
                <TableCell className={styles.dateCell}>{formatDate(therapist.dob)}</TableCell>
                <TableCell>
                  <span className={`${styles.genderChip} ${styles[therapist.gender]}`}>
                    {therapist.gender}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={styles.priceChip}>
                    {formatPriceToVnd(therapist.pricePerHour)}
                  </span>
                </TableCell>
                <TableCell>
                  {therapist.account.isDisabled ? (
                    <>
                      <StatusChip isDisabled={true}>Disabled</StatusChip>
                      <ActivateButton
                        size="small"
                        onClick={() => handleOpenDialog(therapist.accountId)}
                        sx={{ ml: 1 }}
                      >
                        Activate
                      </ActivateButton>
                    </>
                  ) : (
                    <StatusChip isDisabled={false}>Active</StatusChip>
                  )}
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#0077b6' }}>
          Activate Therapist Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="#333333">
            Are you sure you want to activate this therapist’s account? This will enable their account to start accepting appointments.
          </DialogContentText>
          <DialogContentText color="#333333">---</DialogContentText>
          <Typography color="#ff9800">
            *This action cannot be undone without further admin intervention.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleActivateAccount}
            disabled={dialogLoading}
            sx={{
              background: 'linear-gradient(to right, #4caf50, #388e3c)',
              color: '#FFFFFF',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #43a047, #2e7d32)',
              },
            }}
          >
            {dialogLoading ? 'Activating...' : 'Confirm'}
          </Button>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: '#757575', textTransform: 'none' }}
            disabled={dialogLoading}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TherapistManagementPage;