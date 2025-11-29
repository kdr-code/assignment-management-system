const express = require('express');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/stats/teacher - Get statistics for teacher dashboard
router.get('/teacher', auth, async (req, res) => {
  try {
    // Only teachers can access this endpoint
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can access stats' });
    }

    // Count total students (users with role 'student')
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Count total assignments
    const totalAssignments = await Assignment.countDocuments();

    // Count total submissions
    const totalSubmissions = await Submission.countDocuments();

    // Count pending grading (submissions without a grade)
    const pendingGrading = await Submission.countDocuments({
      $or: [{ grade: null }, { grade: { $exists: false } }],
    });

    res.json({
      totalStudents,
      totalAssignments,
      totalSubmissions,
      pendingGrading,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
