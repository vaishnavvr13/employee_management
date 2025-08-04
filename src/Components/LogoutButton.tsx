import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => (
  <button onClick={onLogout} style={{ padding: 10, background: '#f44', color: '#fff', border: 'none', borderRadius: 4 }}>
    Logout
  </button>
);

export default LogoutButton; 