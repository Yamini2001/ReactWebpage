const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ✅ Get all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get employee by ID
router.get('/:id', async (req, res) => {
  const employeeId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [employeeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get documents for a specific employee
router.get('/:id/documents', async (req, res) => {
  const employeeId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM documents WHERE employee_id = $1', [employeeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
