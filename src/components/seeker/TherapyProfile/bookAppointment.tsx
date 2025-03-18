import React, { useEffect, useState } from 'react';
import styles from './calendar.module.css';
import LoadingScreen from '../../common/LoadingScreen';
import { GetAllSessionByTherapistId } from '../../../api/Session/Session';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import NavigationRail from '../NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientByAccountId } from '../../../api/Account/Seeker';
import { getTherapistByTherapistId } from '../../../api/Therapist/Therapist';
import { Appointment, AppointmentRequest, Patient, Therapist, userInGroup } from '../../../interface/IAccount';
import { formatVnd } from '../../../services/common';
import { RegisterAppointment } from '../../../api/Appointment/appointment';
import { addUserInGroup, createGroupChat } from '../../../api/ChatGroup/ChatGroupAPI';

// Interface for the session schema
interface Session {
  sessionId: string;
  therapistId: string;
  startTime: string; // ISO string from C# DateTime (assumed UTC)
  endTime: string; // ISO string from C# DateTime (assumed UTC)
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}


const BookingAppointment: React.FC = () => {
  const { therapistId } = useParams<{ therapistId: string }>(); // Get therapistId from URL
  const [patient, setPatient] = useState<Patient>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
  const nav = useNavigate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch data from BE
  useEffect(() => {
    const fetchAccount = async () => {
      const account = sessionStorage.getItem('account');
      if (account) {
        const accountData = JSON.parse(account);
        const patientData = await getPatientByAccountId(accountData.UserId);
        if (patientData) {
          setPatient(patientData.result);
        } else {
          setError('No patient found for this account.');
        }
      }
      if (therapistId) {
        const therapist = await getTherapistByTherapistId(therapistId);
        if (therapist) {
          setTherapist(therapist.result);
          console.log('Therapist data:', therapist.result);
        }
      }
    };

    const fetchSessions = async () => {
      setIsLoading(true);
      if (therapistId) {
        const sessionData = await GetAllSessionByTherapistId(therapistId);
        if (sessionData) {
          // Normalize C# DateTime (assumed UTC) to UTC ISO strings
          setSessions(sessionData.map((s: Session) => ({
            ...s,
            startTime: ensureUtc(s.startTime),
            endTime: ensureUtc(s.endTime),
          })));
        } else {
          setError('No sessions available for this therapist.');
        }
      } else {
        setError('No therapist ID provided.');
      }
      setIsLoading(false);
    };

    fetchAccount();
    fetchSessions();
  }, [therapistId]);

  const ensureUtc = (isoString: string): string => {
    if (!isoString.endsWith('Z')) {
      return isoString + 'Z'; // Assume UTC and append Z
    }
    return isoString;
  };

  // Generate calendar days in UTC
  const getCalendarDays = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
    const daysInMonth = lastDayOfMonth.getUTCDate();
    const startDay = firstDayOfMonth.getUTCDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(Date.UTC(year, month, i)));
    }
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = days.length; i < totalCells; i++) {
      days.push(null);
    }
    return days;
  };

  // Calculate fees based on session duration and pricePerHour
  const calculateFees = (session: Session, pricePerHour: number) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60); // Convert milliseconds to hours

    const baseFee = durationHours * pricePerHour;
    const platformFee = baseFee * 0.2; // 20% additional charge
    const totalFee = baseFee + platformFee;

    return { totalFee: Math.round(totalFee), platformFee: Math.round(platformFee) };
  };

  const calendarDays = getCalendarDays(currentMonth);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1)));
  };

  // Handle session selection
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };

  // Handle dialog confirmation
  const handleConfirmAppointment = async () => {
    setIsLoading(true)
    if (selectedSession && patient && therapist) {
      const { totalFee, platformFee } = calculateFees(selectedSession, therapist.pricePerHour || 0);
      const appointment: AppointmentRequest = {
        patientId: patient.patientId,
        therapistId: therapist.therapistId,
        coWorkingSpaceId: null, // Nullable, set to null for now
        sessionId: selectedSession.sessionId,
        emergencyEndId: null, // Nullable, set to null
        appointmentType: appointmentType,
        totalFee: totalFee,
        platformFee: platformFee,
      };

      try {
        const response = await RegisterAppointment(appointment);

        if (response.statusCode===200) {
          alert('Appointment booked successfully!');
          const groupchat = {
            adminId: therapist.accountId
          }
          const responseGroupchat = await createGroupChat(groupchat);
          if (responseGroupchat.statusCode === 200) {
            console.log('Groupchat created successfully!',);
            const userInGroupData:userInGroup = {
              clientId: patient.accountId,
              chatGroupId: responseGroupchat.result.chatGroupId
            }
            console.log('UserInGroupData:', userInGroupData);
            const response = await addUserInGroup(userInGroupData)
            if (response.statusCode === 200) {
              console.log('User added to group successfully!');
              nav("/seeker/therapy-chat",{replace: true})
            }
          } else {
            setError('Failed to create groupchat. Please try again.');
          }
        } else {
          setError('Failed to book appointment. Please try again.');
        }
      } catch (err) {
        setError('An error occurred while booking the appointment.');
        console.error(err);
      }

      setOpenDialog(false);
      setSelectedSession(null);
      setAppointmentType('OFFLINE'); // Reset to default
    }
    setIsLoading(false)
  };

  // Handle dialog cancellation
  const handleCancelAppointment = () => {
    setOpenDialog(false);
    setSelectedSession(null);
    setAppointmentType('OFFLINE'); // Reset to default
  };

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <div className={styles.calendarContainer}>
        {therapist && (
          <Typography
            variant="h6"
            sx={{ textAlign: 'center', marginBottom: '10px', color: 'warning.main' }}
          >
            Hourly Rate: {formatVnd(therapist.pricePerHour || 0)}
          </Typography>
        )}
        <div className={styles.header}>
          <button onClick={handlePrevMonth} className={styles.navButton}>←</button>
          <h1 className={styles.title}>
            {monthNames[currentMonth.getUTCMonth()]} {currentMonth.getUTCFullYear()}
          </h1>
          <button onClick={handleNextMonth} className={styles.navButton}>→</button>
        </div>

        <div className={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className={styles.weekDay}>{day}</div>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`${styles.dayCell} ${!day ? styles.emptyCell : ''}`}
            >
              {day && <span>{day.getUTCDate()}</span>}
              {day &&
                sessions
                  .filter((s) => {
                    const sessionDate = new Date(s.startTime);
                    return sessionDate.toDateString() === day.toDateString();
                  })
                  .map((s, idx) => (
                    <div
                      key={idx}
                      className={styles.sessionBlock}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSessionClick(s);
                      }}
                    >
                      {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} -{' '}
                      {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    </div>
                  ))}
            </div>
          ))}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Dialog
          open={openDialog}
          onClose={handleCancelAppointment}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm Appointment
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to book an appointment with{' '}
              {therapist ? `Therapist: ${therapist.firstName}` : 'this therapist'} for{' '}
              {selectedSession && new Date(selectedSession.startTime).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
                timeZone: 'UTC',
              })}{' '}
              to{' '}
              {selectedSession && new Date(selectedSession.endTime).toLocaleString('en-US', {
                timeStyle: 'short',
                timeZone: 'UTC',
              })}?
            </DialogContentText>
            {therapist && selectedSession && (
              <>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Hourly Rate: {formatVnd(therapist.pricePerHour || 0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Fee (including 20% platform fee):{' '}
                  {formatVnd(calculateFees(selectedSession, therapist.pricePerHour || 0).totalFee)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Platform Fee: {formatVnd(calculateFees(selectedSession, therapist.pricePerHour || 0).platformFee)}
                </Typography>
              </>
            )}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
              <Select
                labelId="appointment-type-label"
                id="appointment-type"
                value={appointmentType}
                label="Appointment Type"
                onChange={(e) => setAppointmentType(e.target.value as 'OFFLINE' | 'ONLINE')}
              >
                <MenuItem value="OFFLINE">Offline</MenuItem>
                <MenuItem value="ONLINE">Online</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCancelAppointment} color="primary">
              Cancel
            </MuiButton>
            <MuiButton onClick={handleConfirmAppointment} color="primary" autoFocus>
              Confirm
            </MuiButton>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default BookingAppointment;

