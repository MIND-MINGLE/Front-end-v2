import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  styled,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: theme.spacing(4),
  backgroundColor: "#F5F7FA", // Matches RegisterDoctorPage
}));

const StatusBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Matches FormContainer shadow
  borderRadius: "8px",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "400px",
}));

const SuccessButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1E73BE", // App’s primary blue
  color: "#FFFFFF",
  padding: theme.spacing(1.5, 3),
  borderRadius: "50px", // Matches SubmitButton
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#1557A0", // Darker blue hover
  },
}));

const FailedButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#f44336", // Red for failure
  color: "#FFFFFF",
  padding: theme.spacing(1.5, 3),
  borderRadius: "50px",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#d32f2f", // Darker red hover
  },
}));

export default function PaymentStatusCheck() {
  const { paymentId } = useParams();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("paymentStatus");
  const navigate = useNavigate();

  const isSuccess = paymentStatus === "true";
  const returnUrl = "/"; // Replace with your tab URL later

  const handleReturn = () => {
    navigate(returnUrl); // Removed window.close() for reliability
  };

  return (
    <StyledContainer>
      <StatusBox>
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          color="#1E73BE" // App’s primary color
          gutterBottom
        >
          Payment Status
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          {isSuccess ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 60, color: "#4caf50" }} />
              <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                Payment Successful! Have A Nice Day!
              </Typography>
            </>
          ) : (
            <>
              <CancelIcon sx={{ fontSize: 60, color: "#f44336" }} />
              <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                Payment Failed! This is... bad...
              </Typography>
            </>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {isSuccess ? (
            <SuccessButton onClick={handleReturn}>
              Return to App
            </SuccessButton>
          ) : (
            <FailedButton onClick={handleReturn}>
              Return to App
            </FailedButton>
          )}
        </Box>
        <Typography variant="body2" color="#666">
          Or You Can Close This Tab :3
        </Typography>
      </StatusBox>
    </StyledContainer>
  );
}