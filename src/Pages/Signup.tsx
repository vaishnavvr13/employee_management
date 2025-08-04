import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
  onSignup?: (token: string) => void;
  userRole?: string;
}

const Signup: React.FC<SignupProps> = ({ onSignup, userRole }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/dashboard');
    }
  }, [userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{}[\]|;:'",.<>\\/])[A-Za-z\d@$!%*?&#^()\-_=+{}[\]|;:'",.<>\\/]{8,}$/;
  
    if (!strongPasswordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const role = 'admin';
  
    try {
      const res = await fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
        credentials: 'include',
      });
  
      const data = await res.json();
  
      if (res.ok && data.email) {
        navigate('/dashboard');
        if (onSignup) onSignup(data.token);
      } else if (data.errors) {
        setError(data.errors.map((err: any) => err.msg).join(', '));
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Network error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  

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
    maxWidth: 480,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: '48px 40px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
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
    width: '100%',
    padding: '16px 18px',
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
      'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    display: 'none',
  };

  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Create Your Account</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />

            {error && <div style={errorStyle}>{error}</div>}
            <button
              type="submit"
              style={btnHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              Signup
            </button>
          </form>
          <div style={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <span style={linkStyle} onClick={() => navigate('/login')}>
              Login now
            </span>
          </div>
        </div>
      </div>
      <div style={imageContainerStyle} className="signup-image" />
      <style>
        {`
          @media (min-width: 768px) {
            .signup-image {
              display: block !important;
            }
          }
          @media (max-width: 767px) {
            .signup-image {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
