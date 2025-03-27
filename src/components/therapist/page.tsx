import React, { useEffect, useState } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Footer from '../coworking/Components/Footer/Footer';
import CopyrightFooter from '../coworking/Components/CopyrightFooter/CopyrightFooter';
import styles from './FacebookBusinessPage.module.css';
import { AccountProps, Appointment, Therapist } from '../../interface/IAccount';
import { getTherapistById } from '../../api/Therapist/Therapist';
import { getAppointmentByTherapistId } from '../../api/Appointment/appointment';
import AppointmentTimer from '../common/appointmentTimer';

const TherapistPage: React.FC = () => {
   const [isAppointment, setIsAppointment] = useState(false);
  useEffect(() => {
    const getThera = async() => {
        const localData = sessionStorage.getItem('therapist');
        if(!localData){
            const sessionAccount = sessionStorage.getItem('account');
            if(sessionAccount){
                const data:AccountProps = JSON.parse(sessionAccount)
                const therapistData = await getTherapistById(data.UserId)
                if(therapistData.statusCode === 200){
                    sessionStorage.setItem('therapist', JSON.stringify(therapistData.result))
                }
            }
        }
        getAppointment()
    }
    getThera()
},[])
const getAppointment = async () => {
  const localData = sessionStorage.getItem('appointment');
  if (!localData) {
    const sessionAccount = sessionStorage.getItem('therapist');
    if (sessionAccount) {
      try {
        const data: Therapist = JSON.parse(sessionAccount);
        const appointmentData = await getAppointmentByTherapistId(data.therapistId);

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
  return (
    <div className={styles.facebookBusinessPage}>
      <Header />
      <AppointmentTimer getApp={isAppointment} popUp={false}/>
      <MainContent />
      <Footer />
      <CopyrightFooter />
    </div>
  );
};

export default TherapistPage;