// server/routes/supervisorRoutes.js
const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../jwtMiddleware');

const router = express.Router();

// ✅ Get all supervisors (admin only)
// server/routes/supervisorRoutes.js
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM supervisors');
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch supervisors:', error);
    res.status(500).json({ message: 'Error fetching supervisors' });
  }
});


// ✅ Get employees under a specific supervisor
router.get('/supervisors/:id/employees', verifyToken, async (req, res) => {
  const supervisorId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT * FROM employees WHERE supervisor_id = $1',
      [supervisorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Get documents by supervisor name
router.get('/supervisors/:name/documents', verifyToken, async (req, res) => {
  const supervisorName = req.params.name;

  try {
    const result = await pool.query(
      'SELECT * FROM documents WHERE supervisor_name = $1',
      [supervisorName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching documents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
