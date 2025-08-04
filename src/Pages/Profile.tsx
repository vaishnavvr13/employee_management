import React, { useState, useEffect } from 'react';
import Navbar from '../Components/NavBar';

interface EmployeeData {
  name: string;
  email: string;
  position: string;
  salary: number;
  place: string;
}

const Profile: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showChangePassword, setShowChangePassword] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const res = await fetch('http://localhost:3000/api/employees/profile', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setEmployeeData(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchEmployeeData();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirm password don't match");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/employees/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowChangePassword(false);
    } catch (err: any) {
      setPasswordError(err.message || 'Error changing password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Navbar />
      <div
        style={{
          background: 'var(--card-bg, white)',
          maxWidth: 700,
          margin: '40px auto',
          padding: 30,
          borderRadius: 12,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <h2 style={{ marginBottom: 20, color: '#005bea' }}>🧾 My Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : employeeData ? (
          <>
            <div style={{ lineHeight: '1.8', fontSize: '1rem', marginBottom: 20 }}>
              <p>
                <strong>Name:</strong> {employeeData.name}
              </p>
              <p>
                <strong>Email:</strong> {employeeData.email}
              </p>
              <p>
                <strong>Position:</strong> {employeeData.position}
              </p>
              <p>
                <strong>Salary:</strong> ₹{employeeData.salary}
              </p>
              <p>
                <strong>Place:</strong> {employeeData.place}
              </p>
            </div>

            <button
              onClick={() => {
                setShowChangePassword(!showChangePassword);
                setPasswordError('');
                setPasswordSuccess('');
              }}
              style={buttonStyle}
              aria-expanded={showChangePassword}
              aria-controls="change-password-form"
            >
              {showChangePassword ? 'Cancel' : 'Change Password'}
            </button>

            {showChangePassword && (
              <form
                id="change-password-form"
                onSubmit={handlePasswordSubmit}
                style={{ marginTop: 20 }}
                noValidate
              >
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                {passwordSuccess && <p style={{ color: 'green' }}>{passwordSuccess}</p>}

                <label style={labelStyle}>
                  Current Password:
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={inputStyle}
                    minLength={6}
                  />
                </label>

                <label style={labelStyle}>
                  New Password:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={inputStyle}
                    minLength={6}
                  />
                </label>

                <label style={labelStyle}>
                  Confirm New Password:
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    style={inputStyle}
                    minLength={6}
                  />
                </label>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{ ...buttonStyle, marginTop: 10 }}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 16,
  fontWeight: '600',
  fontSize: '1rem',
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: 8,
  marginTop: 6,
  fontSize: '1rem',
  borderRadius: 6,
  border: '1px solid #ccc',
  transition: 'border-color 0.2s ease',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 18px',
  backgroundColor: '#005bea',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

export default Profile;
