import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">Assignment Management System</h1>
        <p className="hero-subtitle">
          Streamline your academic workflow with modern web technology. 
          Manage assignments, grade efficiently, and enhance learning experiences.
        </p>
        
        {!user ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn-secondary">
              Create Account
            </Link>
          </div>
        ) : (
          <div className="user-welcome">
            <p>Welcome back, {user.name}!</p>
            <Link 
              to={user.role === 'teacher' ? '/teacher' : '/student'} 
              className="btn-secondary"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </header>
      
      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📝 Assignment Management</h3>
            <p>
              Create, edit, and organize assignments with an intuitive interface. 
              Set deadlines, add descriptions, and manage submissions efficiently.
            </p>
          </div>
          <div className="feature-card">
            <h3>⭐ Smart Grading</h3>
            <p>
              Streamlined grading system with detailed feedback capabilities. 
              Grade submissions quickly and provide meaningful insights to students.
            </p>
          </div>
          <div className="feature-card">
            <h3>📱 Responsive Design</h3>
            <p>
              Access your assignments from any device, anywhere. 
              Fully responsive design ensures optimal experience on mobile and desktop.
            </p>
          </div>
        </div>
      </section>
      
      
      
      
      {/* Additional Features for Logged-in Users */}
      {user && (
        <section className="features-section">
          <h2>What You Can Do</h2>
          <div className="features-grid">
            {user.role === 'teacher' ? (
              <>
                <div className="feature-card">
                  <h3>📚 Create Assignments</h3>
                  <p>
                    Design comprehensive assignments with detailed instructions, 
                    deadlines, and grading criteria.
                  </p>
                </div>
                <div className="feature-card">
                  <h3>📊 Track Progress</h3>
                  <p>
                    Monitor student submissions, track completion rates, 
                    and analyze performance trends.
                  </p>
                </div>
                <div className="feature-card">
                  <h3>✅ Grade Efficiently</h3>
                  <p>
                    Use our streamlined grading interface to provide 
                    quick feedback and maintain grade records.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="feature-card">
                  <h3>📋 View Assignments</h3>
                  <p>
                    Access all your assignments in one place with 
                    clear deadlines and requirements.
                  </p>
                </div>
                <div className="feature-card">
                  <h3>📤 Submit Work</h3>
                  <p>
                    Upload your completed assignments easily and 
                    track submission status in real-time.
                  </p>
                </div>
                <div className="feature-card">
                  <h3>📈 Track Grades</h3>
                  <p>
                    Monitor your academic progress and view 
                    detailed feedback from your instructors.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
