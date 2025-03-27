import { Google, Phone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
  Container,
  Chip,
  Dialog,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTherapistById } from "../../../api/Therapist/Therapist";
import LoadingScreen from "../../common/LoadingScreen";
import NavigationRail from "../NavBar";
import styles from "./viewthera.module.css"
import { formatVnd } from "../../../services/common";
import { getCredentialByTherapistId } from '../../../api/Credential/Credential';
import { getSpecializationByTherapistId } from "../../../api/Specialization/Specialization";

interface Specialization {
  specializationId: string;
  name: string;
  description: string;
}

interface Therapist {
  therapistId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: string;
  description: string;
  certificates?: string[];
  pricePerHour: number;
  account: {
    email: string;
    avatar: string;
  };
  specializations?: Specialization[];
}

interface Credential {
  credentialId: string;
  imageUrl: string;
  therapistId: string;
  isDisabled: number;
  createdAt: string;
  updatedAt: string;
}

export const TherapistProfile = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const bookAppointment = (therapistId: string) => {
    nav(`../therapist/${therapistId}/appointment`);
  };

  const fetchTherapist = async () => {
    try {
      if(accountId){
        const therapistResponse = await getTherapistById(accountId);
        if (therapistResponse.statusCode === 200) {
          const therapist = therapistResponse.result
          setTherapist(therapistResponse.result);
          // Gọi API lấy credentials
          const credentialsResponse = await getCredentialByTherapistId(therapist.therapistId);
          console.log("Your Credit: ",credentialsResponse)
          if (credentialsResponse!=null&&credentialsResponse.statusCode === 200) {
            const activeCredentials = credentialsResponse.result.filter(
              (cred: Credential) => cred.isDisabled === 0
            );
            setCredentials(activeCredentials);
          }
  
          // Gọi API lấy specializations
          const specializationsResponse = await getSpecializationByTherapistId(therapist.therapistId);
          if (specializationsResponse!=null&&specializationsResponse.statusCode === 200) {
            // Cập nhật therapist state với specializations
            setTherapist(prev => ({
              ...prev!,
              specializations: specializationsResponse.result.specializations
            }));
          }
        } else {
          setError(therapistResponse.error || "Failed to fetch therapist data");
        }
      }else{
        alert("Try Again")
        nav(-1);
      }
      
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapist();
  }, [accountId]);

  const handleCloseImage = () => {
    setOpenImageModal(false);
  };

  if (loading) return <LoadingScreen />;
  if (error || !therapist) return <Typography color="error">{error || "Therapist not found"}</Typography>;

  return (
    <Box sx={{ display: 'flex' }}>
      <NavigationRail />
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: '80px', md: '110px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: "linear-gradient(135deg, #0077B6 0%, #1B9DF0 50%, #E3F2FD 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              width: '100%'
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={4}>
                {/* Profile Section */}
                <Grid item xs={12} md={5}>
                  <Card className={styles.profileCard}>
                    <CardContent>
                      <Box textAlign="center" padding="1rem">
                        <Avatar
                          src={therapist.account.avatar || "/Ellipse 27.svg"}
                          className={styles.avatar}
                        />
                        <Typography className={styles.name}>
                          {`${therapist.firstName} ${therapist.lastName}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className={styles.subtitle}>
                          {therapist.gender}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box padding="0.5rem">
                        <div className={styles.contactItem}>
                          <Google className={styles.contactIcon} />
                          <Typography variant="body2">{therapist.account.email}</Typography>
                        </div>
                        <div className={styles.contactItem}>
                          <Phone className={styles.contactIcon} />
                          <Typography variant="body2">+84 {therapist.phoneNumber}</Typography>
                        </div>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Info Section */}
                <Grid item xs={12} md={7}>
                  <Card className={styles.infoCard}>
                    <CardContent>
                      <Typography variant="h5" className={styles.sectionTitle}>
                        Therapist Details
                      </Typography>
                      <Grid container spacing={2} marginTop={1}>
                        <Grid item xs={12} sm={6}>
                          <Typography className={styles.infoLabel}>Date of Birth</Typography>
                          <Typography className={styles.infoValue}>{therapist.dob}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography className={styles.infoLabel}>Gender</Typography>
                          <Typography className={styles.infoValue}>{therapist.gender}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Box className={styles.priceSection}>
                            <Typography className={styles.priceLabel}>Hourly Rate</Typography>
                            <Typography className={styles.priceValue}>
                              {formatVnd(therapist.pricePerHour)} / hour
                            </Typography>
                          </Box>
                        </Grid>
                        {therapist.certificates && therapist.certificates.length > 0 && (
                          <Grid item xs={12}>
                            <Typography className={styles.infoLabel}>Certificates</Typography>
                            <Box className={styles.certificatesContainer}>
                              {therapist.certificates.map((cert, index) => (
                                <CardMedia
                                  key={index}
                                  component="img"
                                  className={styles.certificateCard}
                                  image={cert}
                                  alt={`Certificate ${index + 1}`}
                                />
                              ))}
                            </Box>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            className={styles.bookButton}
                            onClick={() => bookAppointment(therapist.therapistId)}
                          >
                            Book Appointment Now
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Thêm phần Certificates và Description */}
                <Grid item xs={12}>
                  <Card sx={{ mt: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Professional Certificates
                      </Typography>
                      {credentials.length > 0 ? (
                        <Box sx={{
                          display: 'flex',
                          gap: 2,
                          overflowX: 'auto',
                          pb: 2
                        }}>
                          {credentials.map((cert) => (
                            <Card
                              key={cert.credentialId}
                              sx={{
                                minWidth: 200,
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                                }
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="150"
                                image={cert.imageUrl}
                                alt={`Certificate ${cert.credentialId}`}
                                sx={{
                                  cursor: 'pointer',
                                  objectFit: 'cover'
                                }}
                                onClick={() => {
                                  setSelectedImage(cert.imageUrl);
                                  setOpenImageModal(true);
                                }}
                              />
                            </Card>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                          No certificates available
                        </Typography>
                      )}

                      <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                        About Me
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {therapist.description}
                      </Typography>

                      <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        mt: 2
                      }}>
                        {therapist.specializations?.map((spec) => (
                          <Tooltip
                            key={spec.specializationId}
                            title={spec.description}
                            arrow
                            placement="top"
                            enterDelay={200}
                            leaveDelay={0}
                          >
                            <Chip
                              label={spec.name}
                              color="primary"
                              variant="outlined"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                }
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Dialog
        open={openImageModal}
        onClose={handleCloseImage}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <img
          src={selectedImage}
          alt="Certificate"
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
          onClick={handleCloseImage}
        />
      </Dialog>
    </Box>
  );
};

export default TherapistProfile;