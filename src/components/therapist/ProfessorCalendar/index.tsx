import {
    Box,
    Button as MuiButton,
    Grid,
    Snackbar,
    Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router";
import { useState } from "react";
import styles from './styles.module.css';

const GradientButton = styled(MuiButton)({});

export const Frame = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleFeatureClick = (e: React.MouseEvent, feature: string) => {
        e.preventDefault();
        setSnackbarMessage(`${feature} feature is currently under development`);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.contentWrapper}>
                <Box className={styles.buttonColumn}>
                    <Link
                        to="create-workspace"
                        onClick={(e) => handleFeatureClick(e, 'Book a workspace')}
                        style={{ textDecoration: 'none' }}
                    >
                        <GradientButton className={styles.gradientButton}>
                            Book a workspace
                        </GradientButton>
                    </Link>

                    <Link
                        to="create-session"
                        style={{ textDecoration: 'none' }}
                    >
                        <GradientButton className={styles.gradientButton}>
                            Create a session
                        </GradientButton>
                    </Link>

                    <Link
                        to="create-workshop"
                        onClick={(e) => handleFeatureClick(e, 'Create a workshop')}
                        style={{ textDecoration: 'none' }}
                    >
                        <GradientButton className={styles.gradientButton}>
                            Create a workshop
                        </GradientButton>
                    </Link>
                </Box>

                <Box className={styles.imageContainer}>
                    <Link to="/ProfessorPage/ThankYouPage"
                        onClick={(e) => handleFeatureClick(e, 'Calendar')}>
                        <Box
                            component="img"
                            className={styles.calendarImage}
                            alt="Calendar"
                            src="/calendar.png"
                        />
                    </Link>
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                className={styles.snackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="info"
                    className={styles.alert}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Frame;
