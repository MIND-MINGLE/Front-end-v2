// src/pages/SessionCreator.tsx
import React, { useEffect, useState } from 'react';
import styles from './calendar.module.css';
import LoadingScreen from '../../common/LoadingScreen';
import { getTherapist } from '../../../api/Account/Therapist';
import { createSession, deleteSessionById, GetAllSessionByTherapistId, updateSessionById } from '../../../api/Session/Session';
import HeaderProf from '../ProfessorWorkshop/Header';

interface Session {
  sessionId: string;
  therapistId: string;
  startTime: string; // ISO string from C# DateTime (assumed UTC)
  endTime: string; // ISO string from C# DateTime (assumed UTC)
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

interface FormData {
  startHour: string; // e.g., "09:00"
  endHour: string; // e.g., "10:00"
}

const SessionCreator: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [formData, setFormData] = useState<FormData>({ startHour: '', endHour: '' });
  const [error, setError] = useState<string | null>(null);
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
        console.log("Therapist:", therapist);
        if (therapist) {
          setTherapist(therapist);
          const sessionData = await GetAllSessionByTherapistId(therapist.therapistId);
          if (sessionData) {
            //why the hell you get the local time zone? Just UTC, man...
            // Normalize C# DateTime (assumed UTC) to UTC ISO strings
            setSessions(sessionData.map((s: Session) => ({
              ...s,
              startTime: ensureUtc(s.startTime),
              endTime: ensureUtc(s.endTime),
            })));
          }
        } else {
          setError('Failed to fetch therapist data');
        }
      } else {
        setError('No account found in session storage');
      }
      setIsLoading(false);
    };
    fetchSessions();
  }, []);

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
      setSelectedDate(new Date(day)); // Clone to avoid mutation
      setFormData({ startHour: '', endHour: '' });
      setEditingSession(null);
      setError(null);
    }
  };

  // Handle session edit click
  const handleSessionClick = (session: Session) => {
    const start = new Date(session.startTime); // UTC assumed
    const end = new Date(session.endTime);
    setSelectedDate(new Date(start));
    setFormData({
      startHour: `${start.getUTCHours().toString().padStart(2, '0')}:${start.getUTCMinutes().toString().padStart(2, '0')}`,
      endHour: `${end.getUTCHours().toString().padStart(2, '0')}:${end.getUTCMinutes().toString().padStart(2, '0')}`,
    });
    setEditingSession(session);
    setError(null);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) return;

    const [startHour, startMinute] = formData.startHour.split(':').map(Number);
    const [endHour, endMinute] = formData.endHour.split(':').map(Number);

    // Validation
    if (!formData.startHour || !formData.endHour) {
      setError('Please fill in both start and end times');
      return;
    }
    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
      setError('End time must be after start time');
      return;
    }

    // Create UTC dates
    const startTime = new Date(Date.UTC(
      selectedDate.getUTCFullYear(),
      selectedDate.getUTCMonth(),
      selectedDate.getUTCDate(),
      startHour,
      startMinute || 0,
      0
    ));
    const endTime = new Date(Date.UTC(
      selectedDate.getUTCFullYear(),
      selectedDate.getUTCMonth(),
      selectedDate.getUTCDate(),
      endHour,
      endMinute || 0,
      0
    ));

    const newSession: Session = {
      sessionId: editingSession ? editingSession.sessionId : '',
      therapistId: therapist ? therapist.therapistId : "123test",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      dayOfWeek: daysOfWeek[startTime.getUTCDay()] as Session['dayOfWeek'],
    };

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
        }
      } else {
        const response = await createSession(newSession);
        if (response.statusCode === 200) {
          // Assuming BE returns the created session with sessionId
          const createdSession = { ...newSession, sessionId: response.data?.sessionId || '' };
          setSessions([...sessions, createdSession]);
          alert('Session created successfully!');
        } else {
          setError('Failed to create session. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setFormData({ startHour: '', endHour: '' });
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
          setFormData({ startHour: '', endHour: '' });
          setSelectedDate(null);
          setEditingSession(null);
        } else {
          setError('Failed to delete session. Please try again.');
        }
      } catch (err) {
        setError('An error occurred during deletion.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <HeaderProf/>
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
                  .filter((s) => new Date(s.startTime).toDateString() === day.toDateString())
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
                <input
                  type="time"
                  value={formData.endHour}
                  onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

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
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default SessionCreator;