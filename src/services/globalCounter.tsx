import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Appointment, Patient, PurchasedPackaged } from "../interface/IAccount";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { patchAppointmentStatus } from "../api/Appointment/appointment";
import { getPatientByAccountId } from "../api/Account/Seeker";
import { getPurchasedPackageByPatientId, PatchDisablePurchasedPackage } from "../api/Subscription/Subscription";

interface GlobalCounterProps {
  onAppointmentChange: (hasAppointment: boolean) => void;
  onSubscriptionChange: (hasSubscription: boolean) => void;
}

export default function GlobalCounter({ onAppointmentChange, onSubscriptionChange }: GlobalCounterProps) {
  const [currentApp, setCurrentApp] = useState<Appointment | null>(null);
  const [currentSub, setCurrentSub] = useState<PurchasedPackaged | null>(null);
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [isDisablingApp, setIsDisablingApp] = useState(false);
  const [isDisablingSub, setIsDisablingSub] = useState(false);

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
        onAppointmentChange(!!currentApp); // Notify SeekerPage
      } else {
        setCurrentApp(null);
        onAppointmentChange(false);
      }
    };

    getCurrentAppointment();
    const pollingInterval = setInterval(getCurrentAppointment, 10000); // Poll every 10s
    return () => clearInterval(pollingInterval);
  }, [onAppointmentChange]);

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
              onSubscriptionChange(false);
            }
          } else {
            setCurrentSub(parsedPackage);
            onSubscriptionChange(true);
          }
        }
      } else {
        setCurrentSub(null);
        onSubscriptionChange(false);
      }
    };

    getCurrentSubscription();
    const pollingInterval = setInterval(getCurrentSubscription, 10000); // Poll every 10s
    return () => clearInterval(pollingInterval);
  }, [onSubscriptionChange]);

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
    if (!currentApp) return;
    setIsDisablingApp(true);
    try {
      const response = await patchAppointmentStatus("Ended", currentApp.appointmentId);
      if (response.statusCode === 200) {
        alert("Appointment ENDED! Returning to homepage...");
        sessionStorage.removeItem("appointment");
        setCurrentApp(null);
        onAppointmentChange(false);
        navigate(-1);
      } else {
        alert("Appointment ended unsuccessfully! We will try again after redirection");
        sessionStorage.removeItem("appointment");
        setCurrentApp(null);
        onAppointmentChange(false);
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
        onSubscriptionChange(false);
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
        <DialogTitle>Appointment Ended</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your appointment has ended. It will now be disabled, and you’ll be redirected.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleDisableAppointment}
            disabled={isDisablingApp}
          >
            {isDisablingApp ? "Disabling..." : "OK"}
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