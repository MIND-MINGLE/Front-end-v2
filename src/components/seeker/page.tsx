/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Box, Divider, Typography } from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import Footer from '../coworking/Components/Footer/Footer';
import CopyrightFooter from '../coworking/Components/CopyrightFooter/CopyrightFooter';
import TherapyMatchingForm from './TherapyMatchingForm/TherapyMatchingForm';
import {Link} from 'react-router';
import { AnimatePresence, motion } from "framer-motion";
import { AccountProps, Appointment, Patient } from '../../interface/IAccount';
import { getPatientByAccountId } from '../../api/Account/Seeker';
import { getAppointmentByPatientId } from '../../api/Appointment/appointment';
import AppointmentTimer from '../common/appointmentTimer';


const SeekerPage = (): JSX.Element => {
    const [isAppointment, setIsAppointment] = useState(false);

    useEffect(() => {
        const getAppointment = async () => {
            const localData = sessionStorage.getItem('appointment');
            if (!localData) {
              const sessionAccount = localStorage.getItem('patient');
              if (sessionAccount) {
                try {
                  const data: Patient = JSON.parse(sessionAccount);
                  const appointmentData = await getAppointmentByPatientId(data.patientId);
          
                  if (appointmentData.statusCode === 200) {
                    const appointments: Appointment[] = appointmentData.result;
          
                    // Check if appointments is an array and has any active appointments
                    if (Array.isArray(appointments) && appointments.length > 0) {
                      // Look for any appointment that is NOT DECLINED or CANCELED
                      const hasActiveAppointment = appointments.some(
                        (appointment) =>
                          appointment.status !== 'DECLINED' && appointment.status !== 'CANCELED'
                      );
          
                      if (hasActiveAppointment) {
                        sessionStorage.setItem('appointment', JSON.stringify(appointments));
                        setIsAppointment(true);
                      } else {
                        setIsAppointment(false);
                      }
                    } else {
                      // No appointments exist
                      setIsAppointment(false);
                    }
                  } else {
                    console.error('Failed to fetch appointments:', appointmentData);
                    setIsAppointment(false);
                  }
                } catch (error) {
                  console.error('Error fetching appointments:', error);
                  setIsAppointment(false);
                }
              } else {
                console.log('No patient found');
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
        const getPatient = async() => {
            const localData = localStorage.getItem('patient');
            if(!localData){
                const sessionAccount = sessionStorage.getItem('account');
                if(sessionAccount){
                    const data:AccountProps = JSON.parse(sessionAccount)
                    const patientData = await getPatientByAccountId(data.UserId)
                    if(patientData.statusCode === 200){
                        localStorage.setItem('patient', JSON.stringify(patientData.result))
                    }
                }
               
            }
        }
        getPatient()
        getAppointment()
    },[])
    return (
        <>
            <AppointmentTimer getApp={isAppointment} />
            <Box
                sx={{
                    background: "linear-gradient(180deg, #0077B6 0%, #1B9DF0 50%, #DFF6FF 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    alignContent: "center",
                    padding: "20px",
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
