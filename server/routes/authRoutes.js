const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../config/db'); // ✅ Fixed import

dotenv.config();

const router = express.Router();

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  console.log("📩 Received signup request");
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    console.log("❌ Signup failed: Missing fields");
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log("🔍 Checking if user already exists...");
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      console.log("⚠️ Signup failed: User already exists");
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Received login request");

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    const normalizedRole = user.role.trim().toLowerCase().replace(/[\s.-]/g, '_');

    // Role-based JWT secret selection
    let secret;
    if (normalizedRole === 'admin') {
      secret = process.env.JWT_SECRET_ADMIN;
    } else if (normalizedRole === 'supervisor_mahendergarh') {
      secret = process.env.JWT_SECRET_SUPERVISOR_MAHENDERGARH;
    } else if (normalizedRole === 'supervisor_narnaul') {
      secret = process.env.JWT_SECRET_SUPERVISOR_NARNAUL;
    } else if (normalizedRole === 'supervisor_rewari') {
      secret = process.env.JWT_SECRET_SUPERVISOR_REWARI;
    } else {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    if (!secret) {
      return res.status(500).json({ message: 'JWT secret is missing for this role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
