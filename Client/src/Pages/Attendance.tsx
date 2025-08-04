import React, { useState } from 'react';
import Navbar from '../Components/NavBar';

interface AttendanceEntry {
  date: string;
  checkIn: string;
  checkOut: string;
}

const Attendance: React.FC = () => {
  const [history, setHistory] = useState<AttendanceEntry[]>([
    {
      date: '2025-07-30',
      checkIn: '09:05 AM',
      checkOut: '05:15 PM',
    },
    {
      date: '2025-07-29',
      checkIn: '09:12 AM',
      checkOut: '05:00 PM',
    },
  ]);

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [todayEntry, setTodayEntry] = useState<AttendanceEntry | null>(null);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleCheckIn = () => {
    const entry: AttendanceEntry = {
      date: getTodayDate(),
      checkIn: getCurrentTime(),
      checkOut: '',
    };
    setTodayEntry(entry);
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    if (!todayEntry) return;
    const updatedEntry = { ...todayEntry, checkOut: getCurrentTime() };
    setTodayEntry(updatedEntry);
    setHistory([updatedEntry, ...history]);
    setCheckedOut(true);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px', backgroundColor: '#f4f7ff', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', color: '#003399', marginBottom: '32px' }}>⏱️ Attendance</h2>

        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            marginBottom: '48px',
          }}
        >
          <h3 style={{ color: '#005bea', marginBottom: '16px' }}>Today: {getTodayDate()}</h3>
          {!checkedIn && (
            <button style={buttonStyle('#2ecc71')} onClick={handleCheckIn}>
              ✅ Check In
            </button>
          )}
          {checkedIn && !checkedOut && (
            <button style={buttonStyle('#e67e22')} onClick={handleCheckOut}>
              🕔 Check Out
            </button>
          )}
          {checkedOut && todayEntry && (
            <div style={{ marginTop: '20px', color: '#2c3e50' }}>
              <p>Check-In: <strong>{todayEntry.checkIn}</strong></p>
              <p>Check-Out: <strong>{todayEntry.checkOut}</strong></p>
              <p>Status: <span style={{ color: '#2ecc71' }}>✔ Completed</span></p>
            </div>
          )}
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ color: '#003399', marginBottom: '16px' }}>📋 Attendance History</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {history.map((entry, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#fff',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <p><strong>Date:</strong> {entry.date}</p>
                <p>🟢 <strong>Check-In:</strong> {entry.checkIn}</p>
                <p>🔴 <strong>Check-Out:</strong> {entry.checkOut}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const buttonStyle = (bg: string): React.CSSProperties => ({
  backgroundColor: bg,
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
});

export default Attendance;
