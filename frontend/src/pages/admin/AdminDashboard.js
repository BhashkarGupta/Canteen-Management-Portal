import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaBell, FaClipboardList } from 'react-icons/fa'; // Icons for actions
import { format } from 'date-fns'; // Date formatting

const AdminDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();

  // Fetch announcements, orders, and venue bookings
  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/announcements`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sending Bearer token for authorization
          },
        });
        setAnnouncements(response.data);
      } catch (error) {
        setError('Failed to fetch announcements.');
      }
    };

    // const fetchOrders = async () => {
    //   try {
    //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Sending Bearer token for authorization
    //       },
    //     });
    //     const todayOrders = response.data.filter(order => format(new Date(order.createdAt), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'));
    //     setOrdersCount(todayOrders.length);
    //   } catch (error) {
    //     setError('Failed to fetch orders.');
    //   }
    // };

    const fetchVenueBookings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/venue-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sending Bearer token for authorization
          },
        });
        const pending = response.data.filter(booking => booking.status === 'pending');
        setPendingVenues(pending.slice(0, 3)); // Get last 3 pending bookings
        setUnapprovedCount(pending.length); // Count all unapproved bookings
      } catch (error) {
        setError('Failed to fetch venue bookings.');
      }
    };

    // Fetch user profile to get the user name
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sending Bearer token for authorization
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        setError('Failed to fetch user profile.');
      }
    };

    fetchAnnouncements();
    // fetchOrders();
    fetchVenueBookings();
    fetchUserProfile();
    setLoading(false);
  }, []);

  // Approve/Reject Venue Booking
  const handleVenueStatus = async (id, status, admin_comment) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/venue-bookings/${id}/status`, {
        status,
        admin_comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Sending Bearer token for authorization
        },
      });
      alert(`Booking ${status} successfully`);
      window.location.reload(); // Reload to reflect changes
    } catch (error) {
      alert(`Failed to update booking status.`);
    }
  };

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Welcome, {userName}</h3>

      {/* Announcements Section */}
      <div className="row">
        <div className="col-md-12">
          <h5>
            <FaBell className="me-2" /> Announcements
          </h5>
        </div>
        {announcements.length > 0 ? (
          announcements.map(announcement => (
            <div className="col-md-12 mb-3" key={announcement.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>{announcement.title}</h6>
                  <p>{announcement.content}</p>
                  <p className="text-muted">Created by: {announcement.creator.name}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No announcements available.</p>
        )}
      </div>

      {/* Orders Section */}
      {/* <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Today's Orders</h5>
              <p className="fs-2">{ordersCount}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Pending Venue Requests */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h5>
            <FaClipboardList className="me-2" /> Pending Venue Requests
          </h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="fs-4">{unapprovedCount} Unapproved Bookings</p>
            </div>
          </div>
        </div>

        {pendingVenues.length > 0 ? (
          pendingVenues.map(venue => (
            <div className="col-md-4 mb-3" key={venue.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>{venue.Venue.venue_name}</h6>
                  <p>
                    <strong>Date:</strong> {venue.booking_date} <br />
                    <strong>Time:</strong> {venue.start_time} - {venue.end_time}
                  </p>
                  <p>
                    <strong>User:</strong> {venue.User.name} <br />
                    <strong>Purpose:</strong> {venue.purpose}
                  </p>
                  <textarea
                    placeholder="Add comment (optional)"
                    className="form-control mb-2"
                    onChange={(e) => venue.admin_comment = e.target.value}
                  />
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleVenueStatus(venue.id, 'approved', venue.admin_comment)}
                  >
                    <FaCheck className="me-1" /> Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleVenueStatus(venue.id, 'rejected', venue.admin_comment)}
                  >
                    <FaTimes className="me-1" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No pending venue bookings at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
