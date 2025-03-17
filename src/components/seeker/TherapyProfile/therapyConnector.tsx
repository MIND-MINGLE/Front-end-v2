import React, { useEffect, useState } from 'react';
import { Grid, Pagination, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './therapistSelection.module.css';
import NavigationRail from '../NavBar';
import LoadingScreen from '../../common/LoadingScreen';
import { getAllTherapist } from '../../../api/Therapist/Therapist';

// Define the Therapist type based on your schema
interface Therapist {
  therapistId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string; // Formatted as "dd/MM/yyyy" from backend
  gender: string;
}

const TherapistSelection: React.FC = () => {
  const [allTherapists, setAllTherapists] = useState<Therapist[]>([]); // Store all therapists
  const [displayedTherapists, setDisplayedTherapists] = useState<Therapist[]>([]); // Paginated subset
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const therapistsPerPage = 3;

  const fetchTherapists = async () => {
    setIsLoading(true);
    try {
      const response = await getAllTherapist();
      const data = response.result;
      const therapistList = data || [];
      
      // Store all therapists
      setAllTherapists(therapistList);
      
      // Calculate total pages
      setTotalPages(Math.ceil(therapistList.length / therapistsPerPage));
      
      // Set initial displayed therapists (first page)
      setDisplayedTherapists(therapistList.slice(0, therapistsPerPage));
    } catch (err) {
      setError('Failed to fetch therapists. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch therapists only once on component mount
  useEffect(() => {
    fetchTherapists();
  }, []);

  // Update displayed therapists when page changes
  useEffect(() => {
    const start = (page - 1) * therapistsPerPage;
    const end = start + therapistsPerPage;
    setDisplayedTherapists(allTherapists.slice(start, end));
  }, [page, allTherapists]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <NavigationRail />
      <div className={styles.container}>
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <Typography className={styles.error}>{error}</Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center" style={{ marginTop: '20px' }}>
              {displayedTherapists.map((therapist) => (
                <Grid item xs={12} sm={6} md={4} key={therapist.therapistId}>
                  <div className={styles.therapistCard}>
                    <img
                      src="default-profile.png" // Replace with dynamic image if added later
                      alt={`${therapist.firstName} ${therapist.lastName}`}
                    />
                    <Typography variant="h6" style={{ color: '#333' }}>
                      {`${therapist.firstName} ${therapist.lastName}`}
                    </Typography>
                    <Typography style={{ color: 'textSecondary' }}>
                      Gender: {therapist.gender}
                    </Typography>
                    <Typography style={{ color: 'textSecondary' }}>
                      Date of Birth: {therapist.dob}
                    </Typography>
                    <Typography style={{ color: 'textSecondary' }}>
                      <span style={{ marginRight: '5px' }}>📞</span>
                      {therapist.phoneNumber}
                    </Typography>
                    <Link to={`../therapist/${therapist.accountId}`} style={{ textDecoration: 'none' }}>
                      <button className={styles.selectButton}>Select Therapist</button>
                    </Link>
                  </div>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px' }}
              />
            )}

            <div className={styles.footerNote}>
              <span>ℹ️</span> Remember, your choice matters! You can always select a new therapist
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TherapistSelection;