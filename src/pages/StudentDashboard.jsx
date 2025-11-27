import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { assignments, submissions, submitAssignment } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus('error');
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (!selectedAssignmentId) {
      alert('Please choose an assignment (use "Submit Work" on a card).');
      return;
    }

    setUploadStatus('uploading');
    
    setTimeout(() => {
      const submission = {
        assignmentId: selectedAssignmentId,    // 🔹 tie to specific assignment
        studentId: user?.id,
        studentName: user?.name,
        studentEmail: user?.email,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        status: 'submitted'
      };
      
      submitAssignment(submission);
      setUploadStatus('success');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadStatus('');
      }, 1500);
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Mock assignments data
  const mockAssignments = assignments.length > 0 ? assignments : [
    { id: '1', title: 'JavaScript Fundamentals', dueDate: '2025-12-15', status: 'pending' },
    { id: '2', title: 'React Components', dueDate: '2025-12-20', status: 'pending' },
    { id: '3', title: 'API Integration', dueDate: '2025-12-25', status: 'pending' }
  ];

  // 🔹 For now, assume single logged-in student → all submissions are theirs
  const mySubmissions = submissions;

  // 🔹 How many assignments actually have a submission
  const submittedAssignmentIds = new Set(
    mySubmissions.map((s) => s.assignmentId)
  );
  const pendingCount = mockAssignments.filter(
    (a) => !submittedAssignmentIds.has(a.id)
  ).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Student Dashboard</h1>
          <p style={{ color: '#333333', fontSize: '1rem' }}>Welcome back, {user?.name}!</p>
        </div>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>

      {/* Quick Stats */}
      <div className="stats-cards">
        <div className="stat-card stat-card--primary">
          <div className="stat-card__icon">📚</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{mockAssignments.length}</div>
            <div className="stat-card__label">Active Assignments</div>
          </div>
        </div>
        <div className="stat-card stat-card--success">
          <div className="stat-card__icon">✅</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{submittedAssignmentIds.size}</div>
            <div className="stat-card__label">Submitted</div>
          </div>
        </div>
        <div className="stat-card stat-card--warning">
          <div className="stat-card__icon">⏰</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{pendingCount}</div>
            <div className="stat-card__label">Pending</div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="assignments-section">
        <div className="section-header">
          <h2>My Assignments</h2>
          <button 
            className="btn-primary"
            onClick={() => {
              setShowUploadModal(true);
              // don’t set assignment here, force them to pick via card
              setSelectedAssignmentId(null);
            }}
          >
            📤 Upload Assignment
          </button>
        </div>

        <div className="assignments-list">
          {mockAssignments.map((assignment) => {
            const isSubmitted = submittedAssignmentIds.has(assignment.id);
            return (
              <div key={assignment.id} className="assignment-item">
                <div className="assignment-item__content">
                  <h3>{assignment.title}</h3>
                  <div className="assignment-item__meta">
                    <span>📅 Due: {assignment.dueDate}</span>
                    <span
                      className={`status-badge ${
                        isSubmitted ? 'status-badge--submitted' : 'status-badge--pending'
                      }`}
                    >
                      {isSubmitted ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    setShowUploadModal(true);
                    setSelectedAssignmentId(assignment.id);   // 🔹 tie upload to this assignment
                  }}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? 'Submitted ✓' : 'Submit Work'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submissions History */}
      {mySubmissions.length > 0 && (
        <div className="submissions-section">
          <h2>Recent Submissions</h2>
          <div className="submissions-list">
            {mySubmissions.map((submission) => (
              <div key={submission.id} className="submission-item">
                <div className="submission-item__icon">📄</div>
                <div className="submission-item__content">
                  <h4>{submission.fileName}</h4>
                  <p className="text-sm text-secondary">
                    {formatFileSize(submission.fileSize)} • Submitted{' '}
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    {submission.grade
                      ? `Grade: ${submission.grade}/100${
                          submission.feedback ? ` • Feedback: ${submission.feedback}` : ''
                        }`
                      : 'Status: Waiting for grading'}
                  </p>
                </div>
                <span className="status-badge status-badge--submitted">
                  {submission.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Assignment</h2>
              <button
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div
                className="file-upload-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="file-upload-icon">📁</div>
                <h3>Drag & drop your file here</h3>
                <p>or</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-input"
                  className="file-input"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.zip"
                />
                <label htmlFor="file-input" className="btn-secondary">
                  Browse Files
                </label>
                <p className="text-sm text-secondary" style={{ marginTop: '1rem' }}>
                  Accepted formats: PDF, DOC, DOCX, TXT, ZIP (Max 10MB)
                </p>
              </div>

              {selectedFile && (
                <div className="selected-file">
                  <div className="selected-file__icon">📄</div>
                  <div className="selected-file__info">
                    <h4>{selectedFile.name}</h4>
                    <p>{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    className="selected-file__remove"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {uploadStatus === 'uploading' && (
                <div className="upload-progress">
                  <div className="upload-progress__spinner"></div>
                  <p>Uploading...</p>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="upload-success">
                  <div className="upload-success__icon">✓</div>
                  <p>File uploaded successfully!</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowUploadModal(false)}
                disabled={uploadStatus === 'uploading'}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
