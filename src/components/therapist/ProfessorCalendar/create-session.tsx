// src/pages/SessionCreator.tsx
import React, { useState } from 'react';
import styles from './calendar.module.css'; // CSS module import

// Interface for the session schema
interface Session {
  therapistId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

// Interface for form data
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
  const [editingSession, setEditingSession] = useState<Session | null>(null); // Track session being edited

  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate calendar days
  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
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
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Handle date selection for new session
  const handleDateClick = (day: Date | null) => {
    if (day) {
      setSelectedDate(day);
      setFormData({ startHour: '', endHour: '' });
      setEditingSession(null); // Reset editing mode
      setError(null);
    }
  };

  // Handle session edit click
  const handleSessionClick = (session: Session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    setSelectedDate(start);
    setFormData({
      startHour: `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`,
      endHour: `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`,
    });
    setEditingSession(session);
    setError(null);
  };

  // Handle form submission (create or update)
  const handleSubmit = (e: React.FormEvent) => {
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

    const startTime = new Date(selectedDate);
    startTime.setHours(startHour, startMinute || 0, 0, 0);

    const endTime = new Date(selectedDate);
    endTime.setHours(endHour, endMinute || 0, 0, 0);

    const newSession: Session = {
      therapistId: 'therapist123', // Replace with actual ID or add input
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      dayOfWeek: daysOfWeek[startTime.getDay()] as Session['dayOfWeek'],
    };

    if (editingSession) {
      // Update existing session
      setSessions(sessions.map((s) =>
        s.startTime === editingSession.startTime && s.endTime === editingSession.endTime ? newSession : s
      ));
      console.log('Session updated:', newSession); // Send update to BE here
    } else {
      // Create new session
      setSessions([...sessions, newSession]);
      console.log('Session created:', newSession); // Send to BE here
    }

    setFormData({ startHour: '', endHour: '' });
    setSelectedDate(null);
    setEditingSession(null);
  };

  // Handle session deletion
  const handleDelete = () => {
    if (editingSession) {
      setSessions(sessions.filter((s) =>
        s.startTime !== editingSession.startTime || s.endTime !== editingSession.endTime
      ));
      console.log('Session deleted:', editingSession); // Send delete to BE here
      setFormData({ startHour: '', endHour: '' });
      setSelectedDate(null);
      setEditingSession(null);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth} className={styles.navButton}>←</button>
        <h1 className={styles.title}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
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
              day && selectedDate?.toDateString() === day.toDateString() ? styles.selected : ''
            } ${!day ? styles.emptyCell : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {day && <span>{day.getDate()}</span>}
            {day &&
              sessions
                .filter((s) => new Date(s.startTime).toDateString() === day.toDateString())
                .map((s, idx) => (
                  <div
                    key={idx}
                    className={styles.sessionBlock}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering date click
                      handleSessionClick(s);
                    }}
                  >
                    {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                ))}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className={styles.formOverlay}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>{editingSession ? 'Edit Session' : 'Create Session'} for {selectedDate.toDateString()}</h2>

            <div className={styles.formGroup}>
              <label>Start Time:</label>
              <input
                type="time"
                value={formData.startHour}
                onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Time:</label>
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
  );
};

export default SessionCreator;