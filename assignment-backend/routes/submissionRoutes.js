const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept common file types
    const allowedTypes = /pdf|doc|docx|txt|zip|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, ZIP, and images are allowed.'));
    }
  },
});

// helper: get user id regardless of how JWT is shaped
const getUserId = (user) =>
  user?.id || user?._id || user?.userId || user?.uid;

// ------------------- POST /api/submissions -------------------
// Now handles real file uploads via multer
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('POST /api/submissions body:', req.body);
    console.log('POST /api/submissions file:', req.file);
    console.log('POST /api/submissions user:', req.user);

    // Only students can submit
    if (req.user && req.user.role && req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can submit' });
    }

    const { assignmentId } = req.body;
    const studentId = getUserId(req.user);

    if (!assignmentId || !studentId) {
      return res.status(400).json({ error: 'Missing assignmentId or studentId' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create submission document with file info
    const submission = await Submission.create({
      assignmentId,
      studentId,
      studentName: req.user.name || 'Student',
      studentEmail: req.user.email || '',
      fileName: req.file.originalname,
      filePath: req.file.path,           // Server path to file
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      status: 'submitted',
    });

    return res.status(201).json(submission);
  } catch (err) {
    console.error('Submit route error:', err);
    return res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// ------------------- GET /api/submissions -------------------
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/submissions user:', req.user);

    const userId = getUserId(req.user);
    let filter = {};

    if (req.user?.role === 'teacher') {
      // teacher sees all
      filter = {};
    } else {
      // student sees only their own
      filter = { studentId: userId };
    }

    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    return res.json(submissions);
  } catch (err) {
    console.error('Get submissions error:', err);
    return res.status(500).json({ error: 'Failed to load submissions' });
  }
});

// ------------------- GET /api/submissions/mine -------------------
router.get('/mine', auth, async (req, res) => {
  try {
    console.log('GET /api/submissions/mine user:', req.user);

    const studentId = getUserId(req.user);
    if (!studentId) {
      return res.status(400).json({ error: 'No student id found' });
    }

    const submissions = await Submission.find({ studentId }).sort({
      createdAt: -1,
    });
    return res.json(submissions);
  } catch (err) {
    console.error('Get my submissions error:', err);
    return res.status(500).json({ error: 'Failed to load my submissions' });
  }
});

// ------------------- GET /api/submissions/:id/file -------------------
// Download/view submitted file
router.get('/:id/file', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Check authorization: teacher can view all, student can view only their own
    const userId = getUserId(req.user);
    if (req.user?.role !== 'teacher' && submission.studentId !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this file' });
    }
    
    if (!submission.filePath || !fs.existsSync(submission.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }
    
    // Send file for download
    res.download(submission.filePath, submission.fileName);
  } catch (err) {
    console.error('Download file error:', err);
    return res.status(500).json({ error: 'Failed to download file' });
  }
});

// ------------------- POST /api/submissions/:id/grade -------------------
router.post('/:id/grade', auth, async (req, res) => {
  try {
    console.log('POST /api/submissions/:id/grade user:', req.user);

    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can grade' });
    }

    const { grade, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        grade,
        feedback,
        status: 'graded',
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    return res.json(submission);
  } catch (err) {
    console.error('Grade submission error:', err);
    return res.status(500).json({ error: 'Failed to grade submission' });
  }
});

module.exports = router;
