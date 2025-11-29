const express = require('express');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

const router = express.Router();

// Teacher creates assignment
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create assignments' });
    }

    const { title, description, dueDate, maxPoints } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      maxPoints,
      createdBy: req.user.id
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Get all assignments (students & teachers)
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get assignments' });
  }
});

module.exports = router;
