const express = require('express');
const { pool } = require('../database');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/employees/leave-history
router.get('/leave-history', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `SELECT id, from_date AS \`from\`, to_date AS \`to\`, type, reason, status, created_at, updated_at 
       FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ leaves: [], message: 'No previous leaves found' });
    }

    res.json({ leaves: rows });
  } catch (err) {
    console.error('Leave history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/employees/request-leave
router.post('/request-leave', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to, type, reason } = req.body;

    if (!from || !to || !type || !reason) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    await pool.execute(
      'INSERT INTO leave_requests (user_id, from_date, to_date, type, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, from, to, type, reason, 'Pending']
    );

    res.status(201).json({ message: 'Leave request submitted successfully' });
  } catch (err) {
    console.error('Request leave error:', err);
    res.status(500).json({ error: 'Failed to submit leave request' });
  }
});

module.exports = router;
