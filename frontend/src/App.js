// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AppNavbar from './components/Navbar'; // Use the correct import for Navbar
import Home from './pages/Home';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Bookings from './pages/Bookings';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <Router>
      <AppNavbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
