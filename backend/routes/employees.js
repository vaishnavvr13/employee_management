const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../config.env' });

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, position, salary, place, created_at, updated_at FROM users WHERE role = 'employee' ORDER BY created_at DESC;"
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }    
    res.json(rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const generateRandomPassword = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};


const sendWelcomeEmail = async (toEmail, name, tempPassword) => {
  const mailOptions = {
    from: '"Your Company" <your.email@gmail.com>',
    to: toEmail,
    subject: 'Welcome! Your Employee Account Details',
    html: `
      <h3>Hello ${name},</h3>
      <p>Your employee account has been created.</p>
      <p><strong>Email:</strong> ${toEmail}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please log in and change your password immediately.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

router.post(
  '/',
  [
    auth,
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('position', 'Position is required').not().isEmpty(),
    body('salary', 'Salary must be a positive number').isFloat({ min: 0 }),
    body('place', 'Place is required').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, position, salary, place } = req.body;

      const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Employee with this email already exists' });
      }

      // Generate temp password and hash it
      const tempPassword = generateRandomPassword(10);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, role, position, salary, place)
         VALUES (?, ?, ?, 'employee', ?, ?, ?)`,
        [name, email, hashedPassword, position, salary, place]
      );

      // Send welcome email with password
      await sendWelcomeEmail(email, name, tempPassword);

      const [newEmployee] = await pool.execute(
        'SELECT id, name, email, role, position, salary, place, created_at, updated_at FROM users WHERE id = ?',
        [result.insertId]
      );

      res.json(newEmployee[0]);
    } catch (error) {
      console.error('Add employee error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);




router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const [existingusers] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (existingusers.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete employee
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'Employee removed' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


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

    const user = rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

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