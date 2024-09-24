// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Canteen Portal</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/menu">Menu</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/weekly-menu">Weekly Menu</Link>
                </li>
                {/* Admin and Root Links */}
                {(user.role === 'admin' || user.role === 'root') && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/menu">Menu Management</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory">Inventory Management</Link>
                    </li>
                    {/* Add more admin-specific links */}
                  </>
                )}
                {/* Cook Links */}
                {user.role === 'cook' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/recipes">Recipe Management</Link>
                    </li>
                    {/* Add more cook-specific links */}
                  </>
                )}
                {/* Common Links for All Authenticated Users */}
                <li className="nav-item">
                  <Link className="nav-link" to="/announcements">Announcements</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
