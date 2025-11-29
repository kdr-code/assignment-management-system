const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String },
    studentEmail: { type: String },
    fileName: String,
    fileSize: Number,
    fileType: String,
    status: { type: String, default: 'submitted' },
    grade: Number,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
