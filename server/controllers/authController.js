const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Adjust path to your MySQL connection

// Signup controller
exports.signUp = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    console.log("Message");
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [
      email,
      hashedPassword,
      role,
    ]);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Message2");
    // Fetch user
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Select the JWT secret based on role
    const roleSecretMap = {
      admin: process.env.JWT_SECRET_ADMIN,
      supervisor: process.env.JWT_SECRET_SUPERVISOR_MAHENDERGARH,
      supervisor_narnaul: process.env.JWT_SECRET_SUPERVISOR_NARNAUL,
      supervisor_rewari: process.env.JWT_SECRET_SUPERVISOR_REWARI,
    };

    const jwtSecret = roleSecretMap[user.role];

    if (!jwtSecret) {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
