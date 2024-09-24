// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  // Logged in, allow access
  return children;
};

export default PrivateRoute;
