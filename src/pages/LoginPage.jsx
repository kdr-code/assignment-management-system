import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // login() should do the real auth (now or after backend)
    const user = await login(formData);

    if (user) {
      // Prefer role coming from backend / AuthContext
      const role =
        user.role ||
        (user.email === 'teacher@test.com' ? 'teacher' : 'student');

      navigate(role === 'teacher' ? '/teacher' : '/student');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Sign in to your account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="demo-accounts">
          <p><strong>Demo Accounts:</strong></p>
          <p>Teacher: teacher@test.com</p>
          <p>Student: Any other registered email</p>
        </div>
        
        <p>
          Don't have an account? <Link to="/register">Create one here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
