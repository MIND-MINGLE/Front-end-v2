import { Box, Divider, Typography } from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import Footer from '../coworking/Components/Footer/Footer';
import CopyrightFooter from '../coworking/Components/CopyrightFooter/CopyrightFooter';
import TherapyMatchingForm from './TherapyMatchingForm/TherapyMatchingForm';
import {Link} from 'react-router';
import { AnimatePresence, motion } from "framer-motion";
import { AccountProps, Appointment, Patient, PurchasedPackaged } from '../../interface/IAccount';
import { getPatientByAccountId } from '../../api/Account/Seeker';
import { getAppointmentByPatientId } from '../../api/Appointment/appointment';
import AppointmentTimer from '../common/appointmentTimer';
import { getPurchasedPackageByPatientId } from '../../api/Subscription/Subscription';
import SubscriptionTimer from '../common/subscriptionHeader';


const SeekerPage = (): JSX.Element => {
    const [isAppointment, setIsAppointment] = useState(false);
    const [isSubscription, setIsSubscription] = useState(false)
    useEffect(() => {
        const getPatient = async() => {
            const localData = sessionStorage.getItem('patient');
            if(!localData){
                const sessionAccount = sessionStorage.getItem('account');
                if(sessionAccount){
                    const data:AccountProps = JSON.parse(sessionAccount)
                    const patientData = await getPatientByAccountId(data.UserId)
                    if(patientData.statusCode === 200){
                        sessionStorage.setItem('patient', JSON.stringify(patientData.result))
                    }
                }
            }
            getSubscription()
            getAppointment()
        }
        getPatient()
    },[])
    const getAppointment = async () => {
      const localData = sessionStorage.getItem('appointment');
      if (!localData) {
        const sessionAccount = sessionStorage.getItem('patient');
        if (sessionAccount) {
          try {
            const data: Patient = JSON.parse(sessionAccount);
            const appointmentData = await getAppointmentByPatientId(data.patientId);
    
            if (appointmentData.statusCode === 200) {
              const appointments: Appointment[] = appointmentData.result;
    
              // Check if appointments is an array and has any active appointments
              if (Array.isArray(appointments) && appointments.length > 0) {
                // Look for any appointment that is only APPROVED
                const hasActiveAppointment = appointments.some(
                  (appointment) =>
                    appointment.status === 'APPROVED' || appointment.status === 'PENDING'
                );
    
                if (hasActiveAppointment) {
                  const activeAppointments: Appointment[] = appointments.filter(appointment => appointment.status !== 'DECLINED' && appointment.status !== 'CANCELED')
                  sessionStorage.setItem('appointment', JSON.stringify(activeAppointments));
                  setIsAppointment(true);
                } else {
                  sessionStorage.removeItem('appointment');
                  setIsAppointment(false);
                }
              } else {
                // No appointments exist
                sessionStorage.removeItem('appointment');
                setIsAppointment(false);
              }
            } else {
              console.error('Failed to fetch appointments:', appointmentData);
              sessionStorage.removeItem('appointment');
              setIsAppointment(false);
            }
          } catch (error) {
            console.error('Error fetching appointments:', error);
            sessionStorage.removeItem('appointment');
            setIsAppointment(false);
          }
        } else {
          console.log('No patient found');
          sessionStorage.removeItem('appointment');
          setIsAppointment(false);
        }
      } else {
        // If localData exists, parse it and check for active appointments
        try {
          const appointments: Appointment[] = JSON.parse(localData);
          if (Array.isArray(appointments) && appointments.length > 0) {
            const hasActiveAppointment = appointments.some(
              (appointment) =>
                appointment.status !== 'DECLINED' && appointment.status !== 'CANCELED'
            );
            setIsAppointment(hasActiveAppointment);
          } else {
            setIsAppointment(false);
          }
        } catch (error) {
          console.error('Error parsing local appointment data:', error);
          setIsAppointment(false);
        }
      }
    };
    const getSubscription = async() => {
      const localData = sessionStorage.getItem('package');
      if(!localData){
          const patientAccount = sessionStorage.getItem('patient');
          if(patientAccount){
              const data:Patient = JSON.parse(patientAccount)
              const purchasedData = await getPurchasedPackageByPatientId(data.patientId)
              if(purchasedData.statusCode === 200){
                const subscription:PurchasedPackaged[] = purchasedData.result
                //console.log(subscription)
                const currentSubscription = subscription.find(p=>p.isDisabled===false)
                // Checking if this is expired
                if (currentSubscription) {
                  localStorage.setItem('purchasedPackage', JSON.stringify(currentSubscription))
                  sessionStorage.setItem('package', JSON.stringify(currentSubscription?.subscription))
                  setIsSubscription(true)
              }
              else{
                sessionStorage.removeItem('package') // just making sure
              }
            }}
        }
    }
    return (
        <>
            <SubscriptionTimer checkSub={isSubscription}/>
            <AppointmentTimer popUp={isAppointment} getApp={isAppointment} />
            <Box
                sx={{
                    background: "linear-gradient(180deg, #0077B6 0%, #1B9DF0 50%, #DFF6FF 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    alignContent: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "auto",
                    }}
                >
                {/* Image at the top */}
                <Link to="/">
                    <Box
                        component="img"
                        src="/LogoWhite.png"
                        alt="Mind_Mingle_Logo"
                        sx={{
                            width: "20vw",
                            height: "8vh",
                            objectFit: "cover",
                            marginBottom: "20px",
                        }}
                    />
                </Link>
                {/* Title Typography */}
                <Box width="auto" justifyItems="center" alignItems="center" >
                    <Typography 
                        variant="h5" 
                        align="center" 
                        sx={{ 
                            fontFamily: "Roboto-Medium, Helvetica", 
                            fontWeight: "medium", 
                            color: "white",
                            lineHeight: "normal",
                        }} 
                    > 
                        Convenient and affordable therapy with <br /> 
                        <Box component="span" color="#dff6ff">MindMingle</Box>
                    </Typography>
                </Box>
                </Box>
                {/* Horizontal Divider */}
                <Divider sx={{ width: "80vw", mb: 2 }} />

                {/* Conditional rendering of TherapyMatchingForm or TherapistConnector */}
                <Box alignItems="center" justifyItems="center" width="auto">
                    <AnimatePresence mode="wait">
    
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                          <TherapyMatchingForm  isAppointment={isAppointment}/> 
                        </motion.div>
     
                    </AnimatePresence>
                </Box>
            </Box>
         <Footer />
         <CopyrightFooter />
         </>
    );
};

export default SeekerPage;
