import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { askGemini } from './api';
import Chatbot from './Components/Chatbot';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/EmployeDashboard';
import AdminDashboard from './Pages/Dashboard';
import Announcements from './Pages/Announcements';
import LeaveHistory from './Pages/LeaveHistory'; //
import Attendance from './Pages/Attendance'; //
import Profile from './Pages/Profile';

import './App.css';

const App: React.FC = () => {
  // const role = localStorage.getItem('role');

  const [showChatbot, setShowChatbot] = useState(false);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={() => {}} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employedashboard" element={<Dashboard />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/leave" element={<LeaveHistory />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/dashboard" element={ <AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      {/* Fixed right-bottom button */}
      <button
        style={{
          position: 'fixed',
          right: '32px',
          bottom: '32px',
          zIndex: 1000,
          background: '#003399',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '32px',
          cursor: 'pointer',
        }}
        title="Chatbot"
        onClick={() => setShowChatbot((v) => !v)}
      >
        💬
      </button>
      {showChatbot && <Chatbot />}
    </>
  );
};

export default App;
