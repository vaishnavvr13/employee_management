import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    document.body.classList.contains('dark-mode')
  );

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const buttons = [
    { label: 'Profile', path: '/profile' },
    { label: 'Announcements', path: '/announcements' },
    { label: 'Leave History', path: '/leave' },
    { label: 'Attendance', path: '/attendance' },
    {
      label: darkMode ? '🌞 Light Mode' : '🌙 Dark Mode',
      onClick: toggleDarkMode,
      key: 'darkmode',
    },
    {
      label: 'Logout',
      path: '/logout',
      onClick: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <nav style={navStyle}>
      <h2 style={logoStyle} onClick={() => navigate('/employedashboard')}>
        🚀 Employee Portal
      </h2>

      <div style={buttonGroupStyle}>
        {buttons.map((btn) => (
          <button
            key={btn.key || btn.label}
            onClick={() => {
              if (btn.onClick) btn.onClick();
              else if (btn.path) navigate(btn.path);
            }}
            style={{
              ...btnStyle,
              ...(hoveredBtn === btn.label ? btnHoverStyle : {}),
              ...(btn.isLogout ? logoutBtnStyle : {}),
            }}
            onMouseEnter={() => setHoveredBtn(btn.label)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// Style
const navStyle: React.CSSProperties = {
  backgroundColor: 'var(--card-bg)',
  color: 'var(--text-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

const logoStyle: React.CSSProperties = {
  margin: 0,
  fontWeight: 700,
  fontSize: '1.5rem',
  cursor: 'pointer',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
};

const btnStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: 'var(--text-color)',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const btnHoverStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
};

const logoutBtnStyle: React.CSSProperties = {
  backgroundColor: '#d9534f',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
};

export default Navbar;
