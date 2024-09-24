// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <h2>Welcome, {user.name}!</h2>
      <p>Your role: {user.role}</p>

      <div className="row mt-4">
        {user.role === 'admin' || user.role === 'root' ? (
          <>
            <div className="col-md-4">
              <Link to="/menu" className="btn btn-primary w-100 mb-3">Manage Menu</Link>
            </div>
            <div className="col-md-4">
              <Link to="/inventory" className="btn btn-primary w-100 mb-3">Manage Inventory</Link>
            </div>
            {/* Add more admin-specific buttons */}
          </>
        ) : null}

        {user.role === 'cook' ? (
          <div className="col-md-4">
            <Link to="/recipes" className="btn btn-warning w-100 mb-3">Manage Recipes</Link>
          </div>
        ) : null}

        {user.role === 'user' ? (
          <>
            <div className="col-md-4">
              <Link to="/orders" className="btn btn-success w-100 mb-3">View Orders</Link>
            </div>
            <div className="col-md-4">
              <Link to="/feedback" className="btn btn-info w-100 mb-3">Submit Feedback</Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
