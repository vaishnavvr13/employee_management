const express = require('express');
const { pool } = require('../database');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// GET /api/employees/profile
router.get('/profile', auth, async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const [rows] = await pool.execute(
        'SELECT id, name, email, position, salary, place FROM users WHERE id = ?',
        [userId]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // PUT Password
  router.post('/change-password', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
  
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Both current and new passwords are required.' });
      }
  
      const [rows] = await pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      console.log('Fetched user:', rows[0]);
      const user = rows[0];
  
      // Comare current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
  
      // Hash password
      const saltRounds = 10;
      const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      await pool.execute('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, userId]);
  
      res.json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  });

module.exports = router; 
