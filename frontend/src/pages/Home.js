import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Optional: For additional styling if needed.

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Check for stored token
        if (token) {
          // Fetch user profile to get role
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const role = response.data.role;

          // Redirect based on user role
          if (role === 'user') {
            navigate('/dashboard');
          } else if (role === 'cook') {
            navigate('/cook-dashboard');
          } else if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'root') {
            navigate('/root-dashboard');
          }
        } else {
          // If no token is found, ensure user remains on the home page
          console.log('No token found, user needs to log in.');
        }
      } catch (error) {
        console.error('Error verifying user:', error);
      }
    };

    checkUserRole();
  }, [navigate]);

  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4 font-weight-bold">Welcome to the Canteen Management Portal</h1>
      <p className="lead">Please log in or register to continue.</p>
      <p className="mt-4">
        <strong>Manage your orders, bookings, and more with ease!</strong>
      </p>
    </div>
  );
};

export default Home;
