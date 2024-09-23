import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Bookings from './pages/Bookings';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

function App() {
  return (
    <Router>
      <Navbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protect the following routes */}
          <Route path="/" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
          <Route path="/menu" element={isAuthenticated() ? <Menu /> : <Navigate to="/login" />} />
          <Route path="/bookings" element={isAuthenticated() ? <Bookings /> : <Navigate to="/login" />} />
          <Route path="/order-history" element={isAuthenticated() ? <OrderHistory /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
