import  { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Appointment, PurchasedPackaged } from "../interface/IAccount";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Link,
} from "@mui/material";
import { patchAppointmentStatus } from "../api/Appointment/appointment";
import { getPatientByAccountId } from "../api/Account/Seeker";
import {  PatchDisablePurchasedPackage } from "../api/Subscription/Subscription";


export default function GlobalCounter() {
  const [currentApp, setCurrentApp] = useState<Appointment | null>(null);
  const [currentSub, setCurrentSub] = useState<PurchasedPackaged | null>(null);
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [isDisablingApp, setIsDisablingApp] = useState(false);
  const [isDisablingSub, setIsDisablingSub] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  const navigate = useNavigate();

  // Fetch patient data (runs once to set patient)
  useEffect(() => {
    const getPatient = async () => {
      const localPatient = sessionStorage.getItem("patient");
      if (!localPatient) {
        const sessionAccount = sessionStorage.getItem("account");
        if (sessionAccount) {
          const data = JSON.parse(sessionAccount);
          const patientData = await getPatientByAccountId(data.UserId);
          if (patientData.statusCode === 200) {
            sessionStorage.setItem("patient", JSON.stringify(patientData.result));
          }
        }
      }
    };
    getPatient();
  }, []);

  // Poll for appointments
  useEffect(() => {
    const getCurrentAppointment = () => {
      const currentList = sessionStorage.getItem("appointment");
      if (currentList) {
        const appointments: Appointment[] = JSON.parse(currentList);
        const currentApp = appointments.find((appointment) => appointment.status === "APPROVED");
        setCurrentApp(currentApp || null);
      
      } else {
        setCurrentApp(null);
       
      }
    };

    getCurrentAppointment();
    const pollingInterval = setInterval(getCurrentAppointment, 10000); // Poll every 10s
    return () => clearInterval(pollingInterval);
  }, []);

  // Poll for subscriptions
  useEffect(() => {
    const getCurrentSubscription = async () => {
      const localData = sessionStorage.getItem("package");
     if (localData) {
        const storedPackage = localStorage.getItem("purchasedPackage");
        if (storedPackage) {
          const parsedPackage: PurchasedPackaged = JSON.parse(storedPackage);
          const endDate = new Date(parsedPackage.endDate + "Z");
          const nowUtc = new Date(new Date().toUTCString());
          if (endDate < nowUtc) {
            const cancel = await PatchDisablePurchasedPackage(parsedPackage.purchasedPackageId);
            if (cancel.statusCode === 200) {
              sessionStorage.removeItem("package");
              localStorage.removeItem("purchasedPackage");
              setCurrentSub(null);
            }
          } else {
            setCurrentSub(parsedPackage);
           
          }
        }
      } else {
        setCurrentSub(null);
     
      }
    };

    getCurrentSubscription();
    const pollingInterval = setInterval(getCurrentSubscription, 10000); // Poll every 10s
    return () => clearInterval(pollingInterval);
  }, []);

  // Appointment countdown
  useEffect(() => {
    if (!currentApp?.session?.endTime) return;

    const updateCountdown = () => {
      const endTime = new Date(currentApp.session.endTime).getTime();
      const now = new Date().getTime();

      const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

      if (timeRemaining <= 0 && currentApp) {
        setAppDialogOpen(true);
      }
    };

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 30000); // Recheck every 30s
    return () => clearInterval(timerInterval);
  }, [currentApp]);


  // Subscription countdown
  useEffect(() => {
    if (!currentSub?.endDate) return;
    const updateCountdown = () => {
      const endTime = new Date(currentSub.endDate + "Z").getTime();
      const now = new Date().getTime();
      const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
      if (timeRemaining <= 0 && currentSub) {
        setSubDialogOpen(true);
      }
    };

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 30000); // Recheck every 30s
    return () => clearInterval(timerInterval);
  }, [currentSub]);
  // Handle disabling the appointment
  const handleDisableAppointment = async () => {
    console.log("get app", currentApp)
    if (!currentApp) return;
    setIsDisablingApp(true);
    try {
      const paymentWindow = window.open("", "_blank");
      const response = await patchAppointmentStatus("Ended", currentApp.appointmentId);
      if (response.statusCode === 200) {
        sessionStorage.removeItem("appointment");
        setCurrentApp(null);
        const payOSURL = response.result
        setPaymentUrl(payOSURL)
        if (paymentWindow) {
          paymentWindow.location.href = payOSURL;
        }
      } else {
        alert("Appointment ended unsuccessfully! We will try again after redirection");
        sessionStorage.removeItem("appointment");
        setCurrentApp(null);
        navigate(-1);
      }
    } catch (error) {
      console.error("Failed to disable appointment:", error);
    } finally {
      setIsDisablingApp(false);
      setAppDialogOpen(false);
    }
  };

  // Handle disabling the subscription
  const handleDisableSubscription = async () => {
    if (!currentSub) return;
    setIsDisablingSub(true);
    try {
      const response = await PatchDisablePurchasedPackage(currentSub.purchasedPackageId);
      if (response.statusCode === 200) {
        alert("Subscription expired and disabled successfully!");
        sessionStorage.removeItem("package");
        localStorage.removeItem("purchasedPackage");
        setCurrentSub(null);
      } else {
        alert("Failed to disable subscription! Please try again later.");
      }
    } catch (error) {
      console.error("Failed to disable subscription:", error);
    } finally {
      setIsDisablingSub(false);
      setSubDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={appDialogOpen} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>Your Appointment Has Ended</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You’ll now be redirect to the Payment Section.
          </DialogContentText>
          <DialogContentText>
            ---
          </DialogContentText>
          <Typography color="warning.main">
            *You can cancel the payment if you wish. There will be a 7-day period for you to complete your payment before we soft-locking your account. Thank you!
          </Typography>
          {paymentUrl!=="" && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography color="warning.main">
                      Popup blocked. Please use this link:
                    </Typography>
                    <Link href={paymentUrl} target="_blank">
                      Proceed to Payment
                    </Link>
                  </Box>
                )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleDisableAppointment}
            disabled={isDisablingApp}
          >
            {isDisablingApp ? "Disabling..." : "Proceed to Payment"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={subDialogOpen} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>Subscription Expired</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your subscription has expired. It will now be disabled.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleDisableSubscription}
            disabled={isDisablingSub}
          >
            {isDisablingSub ? "Disabling..." : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}