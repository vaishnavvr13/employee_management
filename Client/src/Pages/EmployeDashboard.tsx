import React from 'react';
import Navbar from '../Components/NavBar';
import welcomeImage from '../assets/welcome-office.png';

const EmployeeDashboard: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
      transition: 'all 0.3s ease-in-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatImage {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <Navbar />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 20px 30px',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, maxWidth: '500px', animation: 'fadeIn 1s ease-in-out' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-color)', marginBottom: '16px' }}>
            👩‍💼 Hello, Team Member!
          </h1>
          <p style={{ fontSize: '1.1rem' }}>
            This is your central hub for all things related to your work life at BlueNova Technologies.
            Here you can easily manage your profile details, monitor attendance, track your leave history, and stay informed with company announcements.
          </p>
          <p style={{ marginTop: '12px', fontSize: '1.1rem' }}>
            We believe in empowering our employees with transparent and seamless access to their information,
            helping you focus on what truly matters — your growth and success.
          </p>
          <p style={{ marginTop: '12px', fontStyle: 'italic', color: 'var(--text-color)' }}>
            "Strive for progress, not perfection."
          </p>
        </div>

        <div style={{ flex: 1, maxWidth: '420px', animation: 'slideUp 1.2s ease-out' }}>
          <img
            src={welcomeImage}
            alt="Office team"
            style={{
              width: '100%',
              borderRadius: '16px',
              animation: 'floatImage 4s ease-in-out infinite'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
