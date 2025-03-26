import React, { useEffect, useState } from 'react';
import { Grid, Pagination, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { Phone, Cake, Person, PriceCheck } from '@mui/icons-material';
import styles from './therapistSelection.module.css';
import LoadingScreen from '../../common/LoadingScreen';
import { getAllTherapist } from '../../../api/Therapist/Therapist';
import { Therapist } from '../../../interface/IAccount';

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

  const calculateAge = (dobString: string) => {
    // Chuyển đổi từ dd/MM/yyyy sang Date object
    const [day, month, year] = dobString.split('/').map(Number);
    const dob = new Date(year, month - 1, day); // month - 1 vì tháng trong JS bắt đầu từ 0

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    // Kiểm tra xem đã qua sinh nhật trong năm nay chưa
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Typography variant="h4" className={styles.pageTitle}>
          <span className={styles.gradientText}>Choose Your Therapist</span>
        </Typography>

        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <Typography color="error" textAlign="center" variant="h6">
            {error}
          </Typography>
        ) : (
          <>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              sx={{
                minHeight: '70vh',
                py: 4
              }}
            >
              {displayedTherapists.map((therapist) => (
                <Grid item xs={12} sm={12} md={4} key={therapist.therapistId}>
                  <div className={styles.therapistCard}>
                    <div className={styles.avatar}>
                      {therapist.account.avatar ? (
                        <img src={therapist.account.avatar} alt={`${therapist.firstName} ${therapist.lastName}`} />
                      ) : (
                        `${therapist.firstName?.[0]}${therapist.lastName?.[0]}`
                      )}
                    </div>

                    <Typography variant="h6" className={styles.therapistName}>
                      {`${therapist.firstName} ${therapist.lastName}`}
                    </Typography>

                    <div className={styles.infoContainer}>
                      {/* Price Section */}
                      <div className={styles.priceContainer}>
                        <PriceCheck sx={{ fontSize: '2rem', color: 'white' }} />
                        <Typography className={styles.priceText}>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(therapist.pricePerHour)}
                          <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>/hour</span>
                        </Typography>
                      </div>

                      {/* Contact Information */}
                      <div className={styles.infoItem}>
                        <Phone className={styles.infoIcon} />
                        <div>
                          <div className={styles.infoLabel}>Contact</div>
                          <Typography className={styles.contactInfo}>
                            +84 {therapist.phoneNumber}
                          </Typography>
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className={styles.infoContainer}>
                        {/* Gender Information */}
                        <div className={styles.infoItem}>
                          <Person className={styles.infoIcon} />
                          <div>
                            <div className={styles.infoLabel}>Gender</div>
                            <Typography className={styles.basicInfo}>
                              {therapist.gender}
                            </Typography>
                          </div>
                        </div>

                        {/* Age Information */}
                        <div className={styles.infoItem}>
                          <Cake className={styles.infoIcon} />
                          <div>
                            <div className={styles.infoLabel}>Age</div>
                            <Typography className={styles.basicInfo}>
                              {calculateAge(therapist.dob)} years
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link to={`../therapist/${therapist.accountId}`} className={styles.selectButton}>
                      View Details
                    </Link>
                  </div>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  className={styles.pagination}
                />
              </div>
            )}

            <div className={styles.footerNote}>
              <span>ℹ️</span>
              Remember, your choice matters! You can always select a new therapist
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default TherapistSelection;
