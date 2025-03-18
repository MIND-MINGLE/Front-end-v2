"use client";
import { Google, Phone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For getting therapistId from URL
import { getTherapistById } from "../../../api/Therapist/Therapist";
import LoadingScreen from "../../common/LoadingScreen";
import NavigationRail from "../NavBar";
import { formatVnd } from "../../../services/common";

// Define the Therapist type based on your schema
interface Therapist {
  therapistId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string; // Formatted as "dd/MM/yyyy"
  gender: string;
  certificates?: string[]; // Optional, array of image URLs
  pricePerHour: number;
  account:{
    email: string; 
    avatar:string
  }
}

export const TherapistProfile = () => {
  const { accountId } = useParams<{ accountId: string }>(); // Get accountId from URL
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const nav = useNavigate()
  const bookAppointment= (therapistId:string) =>{
    nav(`../therapist/${therapistId}/appointment`)
  }

  // Fetch therapist data
  const fetchTherapist = async () => {
    try {
      const response = await getTherapistById(accountId?accountId:"123")
      if (response.statusCode === 200) {
        setTherapist(response.result);
      } else {
        setError(response.error || "Failed to fetch therapist data");
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

  if (loading) {
    return <LoadingScreen/>
  }

  if (error || !therapist) {
    return <Typography color="error">{error || "Therapist not found"}</Typography>;
  }

  return (
    <>
    <NavigationRail/>
    <Box display="flex" justifyContent="center" py={5} px={2}
        sx={{background: "linear-gradient(135deg, #0077B6 0%, #1B9DF0 50%, #E3F2FD 100%)",
            height:"100vh"

        }}
    >
      <Box width="100%" maxWidth="1200px">
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Box
              border={1}
              borderColor="black"
              borderRadius={1}
              bgcolor="white"
              p={3}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src="/Ellipse 27.svg" // Replace with therapist.profileImage if available
                  sx={{
                    width: 110,
                    height: 110,
                    background:
                      "linear-gradient(180deg, rgba(2, 127, 193, 0.84) 0%, rgba(0, 180, 216, 0.66) 46.35%, rgba(0, 180, 216, 0.61) 74.48%, rgba(27, 157, 240, 0.66) 94.27%)",
                  }}
                />
                <Typography variant="h6" color="primary" mt={2}>
                  {`${therapist.firstName} ${therapist.lastName}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Gender: {therapist.gender}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                {therapist.account.email && (
                  <Box display="flex" alignItems="center" mb={2}>
                    <Google />
                    <Typography variant="body2" color="textSecondary" ml={2}>
                      {therapist.account.email}
                    </Typography>
                  </Box>
                )}
                {/* Add Facebook if you extend the schema */}
                <Box display="flex" alignItems="center" mt={2}>
                  <Phone />
                  <Typography variant="body2" color="textSecondary" ml={2}>
                    {therapist.phoneNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={8}>
            <Box
              border={1}
              borderColor="black"
              borderRadius={1}
              bgcolor="white"
              p={3}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {`${therapist.firstName} ${therapist.lastName}`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {therapist.dob}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    Gender
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {therapist.gender}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" color="textSecondary">
                    Hourly Rate
                  </Typography>
                  <Typography variant="h5" mt={1} color="warning">
                    {formatVnd(therapist.pricePerHour)}
                  </Typography>
                </Grid>
                {therapist.certificates && therapist.certificates.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary">
                      Certificates
                    </Typography>
                    <Box display="flex" mt={1}>
                      {therapist.certificates.map((cert, index) => (
                        <Card key={index} sx={{ width: 152, height: 100, mr: 2 }}>
                          <CardMedia component="img" height="100" image={cert} alt={`Certificate ${index + 1}`} />
                        </Card>
                      ))}
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    onClick={()=>{bookAppointment(therapist.therapistId)}}
                  variant="contained" color="primary" sx={{ mt: 2 }}>
                    Book Appointment
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
  );
};

export default TherapistProfile;