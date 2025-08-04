const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database');

const router = express.Router();



router.post('/signup', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('role', 'Role must be either admin or employee').isIn(['admin', 'employee']) 
], async (req, res) => {
  try {
    console.log('Signup request received:', req.body); 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

console.log('error'); 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('error',hashedPassword,salt); 

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const [newUser] = await pool.execute('SELECT id, name, email, role FROM users WHERE id = ?', [result.insertId]);

    console.log('New user created:', { id: newUser[0].id, name: newUser[0].name, role: newUser[0].role }); 

    // Create JWT token
    const payload = {
      userId: newUser[0].id,
      role: newUser[0].role 
    };
    // Fallback for missing env variables
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
      role: newUser[0].role
    });
  } catch (error) {
    console.error('Signup error:', error); 
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signin', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    console.log('Signin request received:', req.body); 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User signed in:', { id: user.id, name: user.name, role: user.role }); 

    const payload = {
      userId: user.id,
      role: user.role 
    };

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role 
    });
  } catch (error) {
    console.error('Signin error:', error); 
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/currentuser', async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.json({ currentUser: null });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, jwtSecret);
    const [users] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.json({ currentUser: null });
    }

    res.json({ currentUser: users[0] });
  } catch (error) {
    console.error('Current user error:', error);
    res.json({ currentUser: null });
  }
});


router.post('/signout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signed out successfully' });
});

module.exports = router;