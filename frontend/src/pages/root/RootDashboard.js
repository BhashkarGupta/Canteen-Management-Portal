import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaBell, FaClipboardList, FaShoppingCart, FaUtensils, FaBoxOpen } from 'react-icons/fa'; // Icons for actions
import { format } from 'date-fns'; // Date formatting

const RootDashboard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [ordersCount, setOrdersCount] = useState(0);
    const [pendingVenues, setPendingVenues] = useState([]);
    const [unapprovedCount, setUnapprovedCount] = useState(0);
    const [lowInventory, setLowInventory] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [todayMenu, setTodayMenu] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = new Date();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        // Fetch Announcements
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/announcements`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAnnouncements(response.data);
            } catch (error) {
                setError('Failed to fetch announcements.');
            }
        };

        // Fetch Today's Orders
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const todayOrders = response.data.filter(order =>
                    format(new Date(order.created_at), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                );
                setOrdersCount(todayOrders.length);
                setPendingOrders(response.data.filter(order => order.status === 'pending').slice(0, 3)); // Only show top 3 pending orders
            } catch (error) {
                setError('Failed to fetch orders.');
                console.log(error);
            }
        };

        // Fetch Venue Bookings
        const fetchVenueBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/venue-bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const pending = response.data.filter(booking => booking.status === 'pending');
                setPendingVenues(pending.slice(0, 3)); // Show top 3 pending bookings
                setUnapprovedCount(pending.length); // Total unapproved bookings
            } catch (error) {
                setError('Failed to fetch venue bookings.');
            }
        };

        // Fetch Low Inventory
        const fetchLowInventory = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/inventory`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const sortedInventory = response.data.sort((a, b) => a.quantity - b.quantity).slice(0, 3); // Lowest 3 items
                setLowInventory(sortedInventory);
            } catch (error) {
                setError('Failed to fetch inventory.');
            }
        };

        // Fetch Today's Menu
        const fetchTodayMenu = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-menu/today`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTodayMenu(response.data);
            } catch (error) {
                setError('Failed to fetch today\'s menu.');
            }
        };

        // Fetch user profile for welcome message
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserName(response.data.name);
            } catch (error) {
                setError('Failed to fetch user profile.');
            }
        };

        // Fetch all data for root dashboard
        fetchAnnouncements();
        fetchOrders();
        fetchVenueBookings();
        fetchLowInventory();
        fetchTodayMenu();
        fetchUserProfile();
        setLoading(false);
    }, []);

    // Approve/Reject Venue Booking
    const handleVenueStatus = async (id, status, admin_comment) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/venue-bookings/${id}/status`, {
                status,
                admin_comment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(`Booking ${status} successfully`);
            window.location.reload(); // Reload to reflect changes
        } catch (error) {
            alert('Failed to update booking status.');
        }
    };

    // Approve/Reject Order
    const handleOrderStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/orders/${id}/status`, {
                status,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(`Order ${status} successfully`);
            window.location.reload(); // Reload to reflect changes
        } catch (error) {
            alert('Failed to update order status.');
        }
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Welcome {userName}</h2>

            {/* Announcements Section */}
            <div className="row">
                <div className="col-md-12">
                    <h3>
                        <FaBell className="me-2" /> Announcements
                    </h3>
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
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title">Today's Orders</h4>
                            <p className="card-text">Number of orders today: {ordersCount}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title">Pending Venue Bookings</h4>
                            <p className="card-text">Number of pending bookings: {unapprovedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Venue Requests */}
            <div className="row mt-4">
                <h3>
                    <FaClipboardList className="me-2" /> Pending Venue Requests
                </h3>

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

            {/* Pending Orders Section */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <h3>
                        <FaShoppingCart className="me-2" /> Pending Orders
                    </h3>
                </div>
                {pendingOrders.length > 0 ? (
                    pendingOrders.map(order => (
                        <div className="col-md-4 mb-3" key={order.id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h6>Order #{order.id}</h6>
                                    <p>
                                        <strong>Total Amount:</strong> ₹{order.total_amount} <br />
                                        <strong>Status:</strong> {order.status}
                                    </p>
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={() => handleOrderStatus(order.id, 'accepted')}
                                    >
                                        <FaCheck className="me-1" /> Accept
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleOrderStatus(order.id, 'rejected')}
                                    >
                                        <FaTimes className="me-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No pending orders at the moment.</p>
                )}
            </div>

            {/* Low Inventory Section */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <h3>
                        <FaBoxOpen className="me-2" /> Low Inventory Items
                    </h3>
                </div>
                {lowInventory.length > 0 ? (
                    lowInventory.map(item => (
                        <div className="col-md-4 mb-3" key={item.id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h6>{item.item_name}</h6>
                                    <p>Quantity: {item.quantity.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No low inventory items at the moment.</p>
                )}
            </div>

            {/* Today's Menu Section */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <h3>
                        <FaUtensils className="me-2" /> Today's Menu
                    </h3>
                </div>
                {todayMenu.length > 0 ? (
                    todayMenu.map(item => (
                        <div className="col-md-4 mb-3" key={item.id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h6>{item.name}</h6>
                                    <p>{item.description}</p>
                                    <p>Price: ₹{item.price}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No menu items for today.</p>
                )}
            </div>
        </div>
    );
};

export default RootDashboard;
