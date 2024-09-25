import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MenuPage from './pages/MenuPage';
import WeeklyMenuPage from './pages/WeeklyMenuPage';
import UserProfilePage from './pages/UserProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import VenueBookingPage from './pages/VenueBookingPage';
import FeedbackPage from './pages/FeedbackPage';
import CookDashboardPage from './pages/cook/CookDashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RootDashboard from './pages/root/RootDashboard';
import MenuManagementPage from './pages/cook/MenuManagement';
import InventoryManagementPage from './pages/cook/InventoryManagement';

const App = () => {
  return (
    <div id="root">
      <ToastContainer />
      <Navbar />
      <div className="main-content">
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
          <Route path="/cook-dashboard" element={<CookDashboardPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/root-dashboard" element={<RootDashboard />} />
          <Route path="/menu-management" element={<MenuManagementPage />} />
          <Route path="/inventory-management" element={<InventoryManagementPage />} />

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
      </div>
      <Footer />
    </div>
  );
};

export default App;
