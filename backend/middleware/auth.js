const jwt = require('jsonwebtoken');
const { pool } = require('../database');

const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Get user from database
    const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [decoded.userId]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 