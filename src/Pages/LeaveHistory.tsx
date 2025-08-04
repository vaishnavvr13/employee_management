import React, { useState } from 'react';
import Navbar from '../Components/NavBar';

interface LeaveRequest {
  from: string;
  to: string;
  type: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const LeaveHistory: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveRequest[]>([
    {
      from: '2025-07-10',
      to: '2025-07-12',
      type: 'Sick Leave',
      reason: 'Fever and rest required',
      status: 'Approved',
    },
    {
      from: '2025-06-15',
      to: '2025-06-16',
      type: 'Casual Leave',
      reason: 'Family function',
      status: 'Rejected',
    },
  ]);

  const [form, setForm] = useState({
    from: '',
    to: '',
    type: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: LeaveRequest = {
      ...form,
      status: 'Pending',
    } as LeaveRequest;

    setLeaveData([newLeave, ...leaveData]);
    setForm({ from: '', to: '', type: '', reason: '' });
    alert('Leave request submitted!');
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px', backgroundColor: '#f4f7ff', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', color: '#003399', marginBottom: '32px' }}>🗓️ Leave Request & History</h2>

        {/* Leave Request Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h3 style={{ color: '#005bea', marginBottom: '16px' }}>Request Leave</h3>
          <div style={{ marginBottom: '12px' }}>
            <label>From Date:</label>
            <input type="date" name="from" value={form.from} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>To Date:</label>
            <input type="date" name="to" value={form.to} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Leave Type:</label>
            <select name="type" value={form.type} onChange={handleChange} required style={inputStyle}>
              <option value="">--Select--</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Reason:</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#005bea',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Submit Leave
          </button>
        </form>

        {/* Leave History */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{ color: '#003399', marginBottom: '16px' }}>📋 Previous Leave History</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {leaveData.map((leave, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  borderLeft: `6px solid ${
                    leave.status === 'Approved'
                      ? '#2ecc71'
                      : leave.status === 'Rejected'
                      ? '#e74c3c'
                      : '#f39c12'
                  }`,
                }}
              >
                <p style={{ marginBottom: '8px' }}>
                  <strong>{leave.type}</strong> ({leave.from} to {leave.to})
                </p>
                <p style={{ color: '#555' }}>{leave.reason}</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '8px' }}>
                  Status: <span style={{ color: statusColor(leave.status) }}>{leave.status}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginTop: '4px',
};

const statusColor = (status: LeaveRequest['status']) => {
  if (status === 'Approved') return '#2ecc71';
  if (status === 'Rejected') return '#e74c3c';
  return '#f39c12';
};

export default LeaveHistory;
