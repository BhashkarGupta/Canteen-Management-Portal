// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import MenuPage from './pages/MenuPage';
import WeeklyMenuPage from './pages/WeeklyMenuPage';
import UserProfilePage from './pages/UserProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import VenueBookingPage from './pages/VenueBookingPage';
import FeedbackPage from './pages/FeedbackPage';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weekly-menu" element={<WeeklyMenuPage />} />
        <Route path="/profile" element={<UserProfilePage />} /> 
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/venue-bookings" element={<VenueBookingPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Add more routes as needed */}
      </Routes>
    </>
  );
};

export default App;