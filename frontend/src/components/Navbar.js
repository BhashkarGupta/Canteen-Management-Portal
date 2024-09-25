import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { FaHome, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaListAlt, FaUtensils, FaCalendarAlt, FaBuilding, FaCommentDots } from 'react-icons/fa'; // Icons
import { GiMeal } from "react-icons/gi";


const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Access the user and logout function from the context
  const navigate = useNavigate();

  // Log out the user
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/logout`);
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><GiMeal className="me-2" />Canteen Portal</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Home (Dashboard) - Only for logged in users */}
            {/* {user && (
              
            )} */}

            {/* If user is logged in, show profile and logout */}
            {user ? (
              <>
                {/* Links for Regular User */}
                {user.role === 'user' && (
                  <><li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      <FaHome className="me-1" /> Home
                    </Link>
                  </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/menu">
                        <FaUtensils className="me-1" /> Menu
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">
                        <FaListAlt className="me-1" /> My Orders
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/venue-bookings">
                        <FaBuilding className="me-1" />Venue Bookings
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/feedback">
                        <FaCommentDots className="me-1" />Feedback
                      </Link>
                    </li>
                  </>
                )}

                {/* Links for Cook */}
                {user.role === 'cook' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cook-dashboard">
                        <FaHome className="me-1" /> Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory">
                        Manage Inventory
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">
                        Manage Orders
                      </Link>
                    </li>
                  </>
                )}

                {/* Links for Admin */}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-dashboard">
                      <FaHome className="me-1" /> Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/announcements">
                        Manage Announcements
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/venue-requests">
                        Manage Venue Requests
                      </Link>
                    </li>
                  </>
                )}

                {/* Links for Root */}
                {user.role === 'root' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/root/dashboard">
                        Root Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/manage-users">
                        Manage Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/venue-requests">
                        Manage Venue Requests
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/announcements">
                        Manage Announcements
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory">
                        Manage Inventory
                      </Link>
                    </li>
                  </>
                )}
                {/* Weekly Menu - Shown to all users */}
                <li className="nav-item">
                  <Link className="nav-link" to="/weekly-menu">
                    <FaCalendarAlt className="me-1" /> Weekly Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <FaUser className="me-1" /> Profile
                  </Link>
                </li>
                {/* Logout Button */}
                <li className="nav-item">
                  <button className="nav-link btn btn-link text-white" onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              // If not logged in, show Login and Register
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <FaUserPlus className="me-1" /> Register
                  </Link>
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
