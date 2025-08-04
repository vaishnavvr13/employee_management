import React, { useEffect, useState } from 'react';
import Table from '../Components/Table';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/Auth';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  salary: number;
  place: string;
}

const AdminDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    position: '',
    salary: '',
    place: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/employees', { credentials: 'include' });
      const data = await res.json();
      setEmployees(data);
    } catch {
      setError('Failed to fetch employees');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          position: form.position,
          salary: Number(form.salary),
          place: form.place,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.errors?.[0]?.msg || 'Failed to add employee');
        return;
      }
      setForm({ name: '', email: '', position: '', salary: '', place: '' });
      fetchEmployees();
    } catch {
      setError('Failed to add employee');
    }
  };

  const handleDelete = async (id: string | number) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        setError('Failed to delete employee');
        return;
      }
      fetchEmployees();
    } catch {
      setError('Failed to delete employee');
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Styles
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#b5b8f7',
    padding: '40px 0',
  };
  const cardStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: '40px auto',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    padding: 0,
    overflow: 'hidden',
  };
  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #005bea 0%, #3ec6e0 100%)',
    color: '#fff',
    padding: '18px 32px',
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  const logoutButtonStyle: React.CSSProperties = {
    background: '#fff',
    color: '#005bea',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginLeft: 16,
    transition: 'background 0.2s, color 0.2s',
  };
  const formStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    padding: '24px 32px 0 32px',
    alignItems: 'center',
  };
  const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    fontSize: 15,
    outline: 'none',
    background: '#fafbfc',
    marginBottom: 0,
  };
  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(90deg, #005bea 0%, #3ec6e0 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginLeft: 8,
  };
  const errorStyle: React.CSSProperties = {
    color: 'red',
    margin: '16px 32px 0 32px',
    fontWeight: 500,
  };
  const tableContainerStyle: React.CSSProperties = {
    padding: '24px 32px',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          Employees Table
          <button style={logoutButtonStyle} onClick={handleLogout}>Logout</button>
        </div>
        <form onSubmit={handleAdd} style={formStyle}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={inputStyle} />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" style={inputStyle} />
          <input name="position" value={form.position} onChange={handleChange} placeholder="Position" required style={inputStyle} />
          <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" required type="number" style={inputStyle} />
          <input name="place" value={form.place} onChange={handleChange} placeholder="Place" required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Add Employee</button>
        </form>
        {error && <div style={errorStyle}>{error}</div>}
        <div style={tableContainerStyle}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table data={employees as unknown as Record<string, unknown>[]} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
