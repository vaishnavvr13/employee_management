import React from 'react';
import Navbar from '../Components/NavBar';

interface Announcement {
  title: string;
  message: string;
  date: string;
}

const announcements: Announcement[] = [
  {
    title: 'Quarterly Meeting',
    message: 'Our quarterly all-hands meeting will be held on August 5th. Attendance is mandatory.',
    date: '2025-07-25',
  },
  {
    title: 'Team Building Event',
    message: 'A fun team building activity is planned for Friday. Lunch will be provided!',
    date: '2025-07-22',
  },
  {
    title: 'New HR Policies',
    message: 'Updated HR policies have been released. Please check your email for details.',
    date: '2025-07-20',
  },
  {
    title: 'Security Awareness Week',
    message: 'Participate in security workshops this week and win goodies!',
    date: '2025-07-18',
  },
  {
    title: 'Employee of the Month',
    message: 'Congratulations to Manjusha for being the Employee of the Month!',
    date: '2025-07-15',
  },
  {
    title: 'New Project Kickoff',
    message: 'Kickoff for the "NextGen App" project begins Monday. Assigned members please check your dashboard.',
    date: '2025-07-12',
  },
];

const Announcements: React.FC = () => {
  return (
    <>
      <Navbar />
      <div
        style={{
          padding: '40px',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <h2 style={{ textAlign: 'center', color: 'var(--text-color)', marginBottom: '32px' }}>
          📣 Company Announcements
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {announcements.map((a, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-color)',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                padding: '24px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 6px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <h3 style={{ marginBottom: '12px', color: '#2a7de1' }}>{a.title}</h3>
              <p style={{ fontSize: '15px', marginBottom: '8px' }}>{a.message}</p>
              <p style={{ fontSize: '13px', color: 'gray' }}>📅 {a.date}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Announcements;
