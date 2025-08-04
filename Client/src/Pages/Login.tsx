import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/Auth';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.email) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', data.role);
        if (data.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/employedashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const formContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: '40px',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 480,            // increased max width for bigger form
    backgroundColor: 'white',
    borderRadius: 16,
    padding: '48px 40px',    // more padding for breathing space
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',  // stronger shadow
    boxSizing: 'border-box',
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: 32,
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',            // full width inside form
    padding: '16px 18px',    // bigger input padding
    marginBottom: 22,
    borderRadius: 10,
    border: '1.5px solid #ccc',
    fontSize: 16,
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(79, 70, 229, 0.5)',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#4338ca',
  };

  const errorStyle: React.CSSProperties = {
    color: '#ef4444',
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  };

  const linkStyle: React.CSSProperties = {
    color: '#4f46e5',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline',
    display: 'inline-block',
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  };

  const imageContainerStyle: React.CSSProperties = {
    flex: 1,
    backgroundImage:
      'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    display: 'none', // hide on small screens
  };

  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Login to Your Account</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#4f46e5')}
              onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#4f46e5')}
              onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
            />
            {error && <div style={errorStyle}>{error}</div>}
            <button
              type="submit"
              style={btnHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              Login
            </button>
          </form>
          <div style={{ textAlign: 'center' }}>
            Not a member?{' '}
            <span style={linkStyle} onClick={() => navigate('/signup')}>
              Signup now
            </span>
          </div>
        </div>
      </div>
      <div style={imageContainerStyle} className="login-image" />
      <style>
        {`
          @media (min-width: 768px) {
            .login-image {
              display: block !important;
            }
          }
          @media (max-width: 767px) {
            .login-image {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
