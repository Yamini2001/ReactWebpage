// server.js / index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // ✅ <-- FIXED

// Import routes
const authRoutes = require('./routes/authRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
}));
app.use(express.json());

// ✅ Health check log
console.log('🚀 Backend server starting...');

// ✅ Routes
app.use('/api/auth', authRoutes);               // Auth endpoints (login, register)
app.use('/api/supervisors', supervisorRoutes);  // Supervisor endpoints
app.use('/api/employees', employeeRoutes);      // Employee endpoints
app.use('/api/documents', documentRoutes);                // Document endpoints

// ✅ Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Default route
app.get('/', (req, res) => {
  res.send('API is working');
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
