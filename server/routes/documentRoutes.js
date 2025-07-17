const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Get all documents of an employee
router.get('/employees/:employeeId/documents', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM documents WHERE employee_id = ?',
      [employeeId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching documents' });
  }
});

// ✅ Delete a document
router.delete('/documents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM documents WHERE id = ?', [id]);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

module.exports = router;
