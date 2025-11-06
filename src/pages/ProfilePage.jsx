import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>Profile</h1>
      <div className="card">
        <h3>User Information</h3>
        <p><strong>Name:</strong> {user?.name || 'Not provided'}</p>
        <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
        <p><strong>Role:</strong> {user?.role || 'Not provided'}</p>
        <button className="btn-primary">Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfilePage;