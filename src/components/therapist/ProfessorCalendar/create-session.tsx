import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './calendar.module.css';
import LoadingScreen from '../../common/LoadingScreen';
import { getTherapist } from '../../../api/Account/Therapist';
import { createSession, deleteSessionById, GetAllSessionByTherapistId, updateSessionById } from '../../../api/Session/Session';
import HeaderProf from '../ProfessorWorkshop/Header';

interface Session {
  sessionId: string;
  therapistId: string;
  startTime: string; // ISO string (UTC)
  endTime: string; // ISO string (UTC)
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

interface FormData {
  startHour: string; // e.g., "09:00"
}

const SessionCreator: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [formData, setFormData] = useState<FormData>({ startHour: '' });
  const [error, setError] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [therapist, setTherapist] = useState<{ therapistId: string } | null>(null);

  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch data from BE
  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      const localAccount = sessionStorage.getItem('account');
      if (localAccount) {
        const account = JSON.parse(localAccount);
        const therapist = await getTherapist(account.UserId);
        if (therapist) {
          setTherapist(therapist);
          const sessionData = await GetAllSessionByTherapistId(therapist.therapistId);
          if (sessionData) {
            setSessions(sessionData.map((s: Session) => ({
              ...s,
              startTime: ensureUtc(s.startTime),
              endTime: ensureUtc(s.endTime),
            })));
          }
        } else {
          setError('Failed to fetch therapist data');
          setErrorDialogOpen(true);
        }
      } else {
        setError('No account found in session storage');
        setErrorDialogOpen(true);
      }
      setIsLoading(false);
    };
    fetchSessions();
  }, []);

  const ensureUtc = (isoString: string): string => {
    if (!isoString.endsWith('Z')) {
      return isoString + 'Z';
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

  const calendarDays = getCalendarDays(currentMonth);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1)));
    setSelectedDate(null);
  };

  // Handle date selection for new session
  const handleDateClick = (day: Date | null) => {
    if (day) {
      setSelectedDate(new Date(day));
      setFormData({ startHour: '' });
      setEditingSession(null);
      setError(null);
    }
  };

  // Handle session edit click
  const handleSessionClick = (session: Session) => {
    const start = new Date(session.startTime);
    setSelectedDate(new Date(start));
    setFormData({
      startHour: `${start.getUTCHours().toString().padStart(2, '0')}:${start.getUTCMinutes().toString().padStart(2, '0')}`,
    });
    setEditingSession(session);
    setError(null);
  };

  // Validate no overlapping sessions
  const checkOverlap = (newSession: Session, excludeSessionId?: string): boolean => {
    const newStart = new Date(newSession.startTime).getTime();
    const newEnd = new Date(newSession.endTime).getTime();
    const newDate = new Date(newSession.startTime);

    return sessions.some((s) => {
      if (excludeSessionId && s.sessionId === excludeSessionId) return false;
      const sessionDate = new Date(s.startTime);
      if (
        sessionDate.getUTCFullYear() === newDate.getUTCFullYear() &&
        sessionDate.getUTCMonth() === newDate.getUTCMonth() &&
        sessionDate.getUTCDate() === newDate.getUTCDate()
      ) {
        const start = new Date(s.startTime).getTime();
        const end = new Date(s.endTime).getTime();
        return newStart < end && newEnd > start;
      }
      return false;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !formData.startHour) {
      setError('Please select a date and start time');
      setErrorDialogOpen(true);
      return;
    }

    const [startHour, startMinute] = formData.startHour.split(':').map(Number);
    if (isNaN(startHour) || isNaN(startMinute)) {
      setError('Invalid start time format');
      setErrorDialogOpen(true);
      return;
    }

    // Create UTC dates (1-hour session)
    const startTime = new Date(Date.UTC(
      selectedDate.getUTCFullYear(),
      selectedDate.getUTCMonth(),
      selectedDate.getUTCDate(),
      startHour,
      startMinute || 0,
      0
    ));
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

    const newSession: Session = {
      sessionId: editingSession ? editingSession.sessionId : '',
      therapistId: therapist ? therapist.therapistId : '123test',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      dayOfWeek: daysOfWeek[startTime.getUTCDay()] as Session['dayOfWeek'],
    };

    // Check for overlap
    if (checkOverlap(newSession, editingSession?.sessionId)) {
      setError('This session overlaps with another session on the same day');
      setErrorDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      if (editingSession) {
        const response = await updateSessionById(newSession);
        if (response.statusCode === 200) {
          setSessions(sessions.map((s) =>
            s.sessionId === editingSession.sessionId ? newSession : s
          ));
          alert('Session updated successfully!');
        } else {
          setError('Failed to update session. Please try again.');
          setErrorDialogOpen(true);
        }
      } else {
        const response = await createSession(newSession);
        if (response.statusCode === 200) {
          const createdSession = { ...newSession, sessionId: response.data?.sessionId || '' };
          setSessions([...sessions, createdSession]);
          alert('Session created successfully!');
        } else {
          setError('Failed to create session. Please try again.');
          setErrorDialogOpen(true);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setErrorDialogOpen(true);
      console.error(err);
    } finally {
      setIsLoading(false);
      setFormData({ startHour: '' });
      setSelectedDate(null);
      setEditingSession(null);
    }
  };

  // Handle session deletion
  const handleDelete = async () => {
    if (editingSession) {
      setIsLoading(true);
      try {
        const response = await deleteSessionById(editingSession.sessionId);
        if (response.statusCode === 200) {
          setSessions(sessions.filter((s) => s.sessionId !== editingSession.sessionId));
          alert('Session deleted successfully!');
          setFormData({ startHour: '' });
          setSelectedDate(null);
          setEditingSession(null);
        } else {
          setError('Failed to delete session. Please try again.');
          setErrorDialogOpen(true);
        }
      } catch (err) {
        setError('An error occurred during deletion.');
        setErrorDialogOpen(true);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Calculate end time for display
  const getEndTimeDisplay = (startHour: string): string => {
    if (!startHour) return '';
    const [hour, minute] = startHour.split(':').map(Number);
    const endTime = new Date(Date.UTC(2000, 0, 1, hour, minute || 0));
    endTime.setUTCHours(endTime.getUTCHours() + 1);
    return `${endTime.getUTCHours().toString().padStart(2, '0')}:${endTime.getUTCMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <HeaderProf />
      <div className={styles.calendarContainer}>
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
              className={`${styles.dayCell} ${
                day && selectedDate?.toUTCString() === day.toUTCString() ? styles.selected : ''
              } ${!day ? styles.emptyCell : ''}`}
              onClick={() => handleDateClick(day)}
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

        {selectedDate && (
          <div className={styles.formOverlay}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>{editingSession ? 'Edit Session' : 'Create Session'} for {selectedDate.toUTCString().split(' ').slice(0, 4).join(' ')}</h2>
              <div className={styles.formGroup}>
                <label>Start Time (UTC):</label>
                <input
                  type="time"
                  value={formData.startHour}
                  onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>End Time (UTC):</label>
                <span>{getEndTimeDisplay(formData.startHour) || 'Select start time'}</span>
              </div>

              <div className={styles.formButtons}>
                <button type="submit">{editingSession ? 'Update' : 'Create'} Session</button>
                {editingSession && (
                  <button type="button" onClick={handleDelete} className={styles.deleteButton}>
                    Delete
                  </button>
                )}
                <button type="button" onClick={() => {
                  setSelectedDate(null);
                  setEditingSession(null);
                  setFormData({ startHour: '' });
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <Dialog
          open={errorDialogOpen}
          onClose={() => setErrorDialogOpen(false)}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: 'white',
              border: '2px solid #0077b6',
              borderRadius: '8px',
              padding: '16px',
            },
          }}
        >
          <DialogTitle sx={{ color: '#0077b6', fontWeight: 'bold' }}>Error</DialogTitle>
          <DialogContent>
            <p style={{ color: '#333' }}>{error}</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setErrorDialogOpen(false)}
              sx={{
                backgroundColor: '#0077b6',
                color: '#fff',
                '&:hover': { backgroundColor: '#1b9df0' },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SessionCreator;