import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  styled,
} from "@mui/material";
import { Patient, PurchasedPackaged, Subscription } from "../../../../interface/IAccount";
import { getPurchasedPackageByPatientId } from "../../../../api/Subscription/Subscription";
import { formatPriceToVnd } from "../../../../services/common";

// Styled components
const SubscriptionCard = styled(Card)(({ active }: { active?: boolean }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 119, 182, 0.2)",
  backgroundColor: active ? "#0077b6" : "#F5F7FA",
  border: active ? "2px solid #1b9df0" : "1px solid #e0e0e0",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 6px 16px rgba(0, 119, 182, 0.3)",
  },
}));

const CardTitle = styled(Typography)(({ active }: { active?: boolean }) => ({
  fontWeight: "bold",
  fontSize: "24px",
  color: active ? "#FFFFFF" : "#0077b6",
  marginBottom: "8px",
}));

const CardText = styled(Typography)(({ active }: { active?: boolean }) => ({
  fontSize: "18px",
  color: active ? "rgba(255, 255, 255, 0.9)" : "#333333",
  marginBottom: "4px", // Added spacing between lines
}));

const ActiveBadge = styled(Box)(() => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor: "#4caf50",
  color: "#FFFFFF",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "18px",
  fontWeight: "bold",
}));
const NonActiveBadge = styled(Box)(() => ({
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "darkgray",
    color: "#FFFFFF",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  }));

const HistorySubscription: React.FC = () => {
  const [subscriptionList, setSubscriptionList] = useState<PurchasedPackaged[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionList();
  }, []);

  const fetchSubscriptionList = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientAccount = sessionStorage.getItem("patient");
      if (patientAccount) {
        const data: Patient = JSON.parse(patientAccount);
        const purchasedData = await getPurchasedPackageByPatientId(data.patientId);
        if (purchasedData.statusCode === 200) {
          const packages: PurchasedPackaged[] = purchasedData.result;
          setSubscriptionList(packages);
          const activeSubscription = packages.find(p => !p.isDisabled)?.subscription;
          setCurrentSubscription(activeSubscription);
          if (!activeSubscription) {
            sessionStorage.removeItem("package");
          }
        } else {
          setError("Failed to fetch subscription history");
          sessionStorage.removeItem("package");
        }
      } else {
        setError("No patient account found");
      }
    } catch (err) {
      setError("Error fetching subscription history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", px: 2 }}>
      <Typography align="center" variant="h4" color="#0077b6" sx={{ mb: 3, fontWeight: "bold" }}>
        Subscription History
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : subscriptionList.length === 0 ? (
        <Typography color="textSecondary">No subscription history found.</Typography>
      ) : (
        <Grid container spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
          {subscriptionList.map((pkg) => {
            const isActive = currentSubscription?.subscriptionId === pkg.subscriptionId && !pkg.isDisabled;
            return (
              <Grid item xs={12} sm={6} md={6} key={pkg.purchasedPackageId}>
                <SubscriptionCard active={isActive}>
                  <CardContent sx={{ position: "relative", p: 2 }}>
                    {isActive? <ActiveBadge>Active</ActiveBadge>: <NonActiveBadge>Expired</NonActiveBadge>}
                    <CardTitle active={isActive}>
                      {pkg.subscription.packageName}
                    </CardTitle>
                    <CardText active={isActive}>
                      Start: {new Date(pkg.startDate).toLocaleDateString()}
                    </CardText>
                    <CardText active={isActive}>
                      End: {new Date(pkg.endDate).toLocaleDateString()}
                    </CardText>
                    <CardText active={isActive}>
                      Price: {formatPriceToVnd(pkg.subscription.price)}
                    </CardText>
                  </CardContent>
                </SubscriptionCard>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default HistorySubscription;