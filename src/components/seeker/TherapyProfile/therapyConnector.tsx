// src/pages/TherapistSelection.tsx
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Pagination,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom'; // Assuming you're using react-router
import styles from './therapistSelection.module.css';
import NavigationRail from '../NavBar';
import LoadingScreen from '../../common/LoadingScreen';
import { getAllTherapist } from '../../../api/Therapist/Therapist';

const TherapistSelection: React.FC = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const therapistsPerPage = 3;

  // Mock API call (replace with your actual endpoint)
  const fetchTherapists = async (page: number) => {
    setIsLoading(true);
    try {
      // Replace with your actual API call
      const response = await getAllTherapist();
      const data = await response.result;
      setTherapists(data.therapists || []);
      setTotalPages(Math.ceil(data.total / therapistsPerPage));
    } catch (err) {
      setError('Failed to fetch therapists. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTherapists(page);
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
    <NavigationRail/>
    <div className={styles.container}>
      {isLoading ? (
        <LoadingScreen/>
      ) : error ? (
        <Typography className={styles.error}>{error}</Typography>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center" style={{ marginTop: '20px' }}>
            {therapists.map((therapist, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div className={styles.therapistCard}>
                  <img
                    src={therapist.profileImage || 'default-profile.png'} // Replace with actual image URL
                    alt={therapist.name}
                  />
                  <Typography variant="h6" style={{ color: '#333' }}>
                    {therapist.name || 'Quynh Nguyen'}
                  </Typography>
                  <Typography style={{ color: 'textSecondary' }}>
                    Joined {therapist.joined || '3 years ago'} | Reviewed: {therapist.reviews || '20'}
                  </Typography>
                  <Typography style={{ color: 'textSecondary' }}>
                    <span style={{ marginRight: '5px' }}>G</span>
                    {therapist.email || 'aiquynh2812@gmail.com'}
                  </Typography>
                  <Typography style={{ color: 'textSecondary' }}>
                    Specialize In: {therapist.specialization || ''}
                  </Typography>
                  <Typography style={{ color: 'textSecondary' }}>
                    <span style={{ marginRight: '5px' }}>📞</span>
                    {therapist.phone || '0934722325'}
                  </Typography>
                  <Link to={`/therapist/${therapist.therapistId || index}`} style={{ textDecoration: 'none' }}>
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