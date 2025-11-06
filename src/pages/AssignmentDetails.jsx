import React from 'react';
import { useParams } from 'react-router-dom';

const AssignmentDetails = () => {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>Assignment Details</h1>
      <p>Assignment ID: {id}</p>
      <div className="card">
        <h3>Assignment Title</h3>
        <p>Assignment description will go here...</p>
        <div className="assignment-actions">
          <button className="btn-primary">Submit Work</button>
          <button className="btn-secondary">Save Draft</button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;