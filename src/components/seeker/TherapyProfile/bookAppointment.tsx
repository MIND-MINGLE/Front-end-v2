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
  Tooltip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientByAccountId } from '../../../api/Account/Seeker';
import { getTherapistByTherapistId } from '../../../api/Therapist/Therapist';
import { Appointment, AppointmentRequest, Patient, Therapist, userInGroup } from '../../../interface/IAccount';
import { formatVnd } from '../../../services/common';
import { getAppointmentByTherapistId, RegisterAppointment } from '../../../api/Appointment/appointment';
import { addUserInGroup, createGroupChat } from '../../../api/ChatGroup/ChatGroupAPI';

// Interface for the session schema
interface Session {
  sessionId: string;
  therapistId: string;
  startTime: string; // ISO string (UTC)
  endTime: string; // ISO string (UTC)
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

const BookingAppointment: React.FC = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]); // Initialized as empty array
  const [appointmentType, setAppointmentType] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
  const nav = useNavigate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const checkAppointment = () => {
    const appointment = sessionStorage.getItem("appointment");
    if (appointment) {
      const appointments: Appointment[] = JSON.parse(appointment);
      if (appointments.length > 0) {
        nav('/');
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    checkAppointment();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch patient
        const account = sessionStorage.getItem('account');
        if (account) {
          const accountData = JSON.parse(account);
          const patientData = await getPatientByAccountId(accountData.UserId);
          if (patientData?.statusCode === 200) {
            setPatient(patientData.result);
          } else {
            setError('No patient found for this account.');
          }
        }

        // Fetch therapist and related data
        if (therapistId) {
          const therapistData = await getTherapistByTherapistId(therapistId);
          if (therapistData?.statusCode === 200) {
            setTherapist(therapistData.result);
            // Fetch appointments
            const appointmentRes = await getAppointmentByTherapistId(therapistId);
            if (appointmentRes.statusCode === 200) {
              setAppointmentList(appointmentRes.result);
            }
            // Fetch sessions
            const sessionData = await GetAllSessionByTherapistId(therapistId);
            if (sessionData) {
              setSessions(sessionData.map((s: Session) => ({
                ...s,
                startTime: ensureUtc(s.startTime),
                endTime: ensureUtc(s.endTime),
              })));
            } else {
              setError('No sessions available for this therapist.');
            }
          } else {
            setError('Therapist not found.');
          }
        } else {
          setError('No therapist ID provided.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [therapistId]);

  const ensureUtc = (isoString: string): string => {
    if (!isoString.endsWith('Z')) {
      return isoString + 'Z'; // Assume UTC and append Z
    }
    return isoString;
  };

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

  const calculateFees = (session: Session, pricePerHour: number) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    const baseFee = durationHours * pricePerHour;
    const platformFee = baseFee * 0.2;
    const totalFee = baseFee + platformFee;

    return { totalFee: Math.round(totalFee), platformFee: Math.round(platformFee) };
  };

  const isSessionBooked = (sessionId: string) => {
    return appointmentList.some(app => 
      app.sessionId === sessionId && 
      app.status !== 'DECLINED' && 
      app.status !== 'CANCELED'
    );
  };

  const isSessionInPast = (session: Session) => {
    const now = new Date();
    return new Date(session.endTime) < now;
  };

  const calendarDays = getCalendarDays(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1)));
  };

  const handleSessionClick = (session: Session) => {
    if (!isSessionBooked(session.sessionId) && !isSessionInPast(session)) {
      setSelectedSession(session);
      setOpenDialog(true);
    }
  };

  const handleConfirmAppointment = async () => {
    setIsLoading(true);
    if (selectedSession && patient && therapist) {
      const { totalFee, platformFee } = calculateFees(selectedSession, therapist.pricePerHour || 0);
      try {
          const groupchat = { adminId: therapist.accountId };
          const responseGroupchat = await createGroupChat(groupchat);
          if (responseGroupchat.statusCode === 200) {
            const userInGroupData: userInGroup = {
              clientId: patient.accountId,
              chatGroupId: responseGroupchat.result.chatGroupId,
            };
            const responseUser = await addUserInGroup(userInGroupData);
            if (responseUser.statusCode === 200) {
              //After we got a group, set an appoitnment for that chatgroup
              const appointment: AppointmentRequest = {
                patientId: patient.patientId,
                therapistId: therapist.therapistId,
                coWorkingSpaceId: null,
                sessionId: selectedSession.sessionId,
                emergencyEndId: null,
                appointmentType: appointmentType,
                chatgroupId:responseGroupchat.result.chatGroupId,
                totalFee: totalFee,
                platformFee: platformFee,
              };
              const response = await RegisterAppointment(appointment);
              if (response.statusCode === 200) {
              alert('Appointment booked successfully!');
              nav("/seeker/therapy-chat", { replace: true });
            } else {
              setError('Failed to add user to group.');
            }
          } else {
            setError('Failed to create group chat.');
          }
        } else {
          setError('Failed to book appointment.');
        }
      } catch (err) {
        setError('An error occurred while booking the appointment.');
        console.error(err);
      }
    }
    setOpenDialog(false);
    setSelectedSession(null);
    setAppointmentType('OFFLINE');
    setIsLoading(false);
  };

  const handleCancelAppointment = () => {
    setOpenDialog(false);
    setSelectedSession(null);
    setAppointmentType('OFFLINE');
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
            return (
              sessionDate.getUTCDate() === day.getUTCDate() &&
              sessionDate.getUTCMonth() === day.getUTCMonth() &&
              sessionDate.getUTCFullYear() === day.getUTCFullYear()
            );
          })
          .map((s, idx) => {
            const booked = isSessionBooked(s.sessionId);
            const past = isSessionInPast(s);
            return (
              <Tooltip
                key={idx}
                title={booked ? "This session is booked" : past ? "This session is in the past" : "Click to book"}
                arrow
              >
                <div
                  className={`${styles.sessionBlock} ${booked ? styles.bookedSession : ''} ${past ? styles.pastSession : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSessionClick(s);
                  }}
                  style={{ cursor: booked || past ? 'not-allowed' : 'pointer' }}
                >
                  {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} -{' '}
                  {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                </div>
                </Tooltip>
                  );
                })}
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
          <DialogTitle id="alert-dialog-title">Confirm Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to book an appointment with{' '}
              {therapist ? `Therapist: ${therapist.firstName}` : 'this therapist'}
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
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
            <DialogContentText id="alert-dialog-description">
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
            </DialogContentText>
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