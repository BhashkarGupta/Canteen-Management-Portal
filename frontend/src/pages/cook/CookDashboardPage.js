import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUtensils, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa'; // Icons for different sections

const CookDashboardPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [todayMenu, setTodayMenu] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [lowInventory, setLowInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookName, setCookName] = useState('');

  // Fetch data when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        // Fetch user profile (to get cook name)
        const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCookName(profileResponse.data.name);

        // Fetch announcements
        const announcementResponse = await axios.get(`${process.env.REACT_APP_API_URL}/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(announcementResponse.data);

        // Fetch today's menu
        const todayMenuResponse = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-menu/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodayMenu(todayMenuResponse.data);

        // Fetch pending orders
        const orderResponse = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pending = orderResponse.data.filter(order => order.status === 'pending').slice(0, 3); // Get the 3 oldest pending orders
        setPendingOrders(pending);

        // Fetch inventory (lowest 3 items)
        const inventoryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedInventory = inventoryResponse.data.sort((a, b) => a.quantity - b.quantity).slice(0, 3);
        setLowInventory(sortedInventory);

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch dashboard data.');
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Handle order approval/rejection
  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(`Order ${status} successfully`);
      // Refresh the pending orders
      setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to update order status', error);
      alert('Failed to update order status');
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h3>Welcome, {cookName}</h3>

      {/* Announcements Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <FaExclamationTriangle className="me-2" /> Announcements
        </div>
        <div className="card-body">
          {announcements.length > 0 ? (
            <ul className="list-group">
              {announcements.map(announcement => (
                <li key={announcement.id} className="list-group-item">
                  <h5>{announcement.title}</h5>
                  <p>{announcement.content}</p>
                  <small>By {announcement.creator.name}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No announcements at the moment.</p>
          )}
        </div>
      </div>

      {/* Today's Menu Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <FaUtensils className="me-2" /> Today's Menu
        </div>
        <div className="card-body">
          {todayMenu.length > 0 ? (
            <div className="row">
              {todayMenu.map((item) => (
                <div key={item.id} className="col-md-4 mb-3">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p>{item.description}</p>
                      <p><strong>Price:</strong> ₹{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No menu items for today.</p>
          )}
        </div>
      </div>

      {/* Pending Orders Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <FaClipboardList className="me-2" /> Pending Orders (Oldest 3)
        </div>
        <div className="card-body">
          {pendingOrders.length > 0 ? (
            <div className="row">
              {pendingOrders.map(order => (
                <div key={order.id} className="col-md-4 mb-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5>Order #{order.id}</h5>
                      <ul className="list-group mb-2">
                        {order.OrderItems.map(item => (
                          <li key={item.id} className="list-group-item">
                            {item.MenuItem.name} (x{item.quantity}) - ₹{item.price}
                          </li>
                        ))}
                      </ul>
                      <p>Total: ₹{order.total_amount}</p>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleOrderStatusChange(order.id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleOrderStatusChange(order.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No pending orders.</p>
          )}
        </div>
      </div>

      {/* Low Inventory Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <FaExclamationTriangle className="me-2" /> Low Inventory Items (Lowest 3)
        </div>
        <div className="card-body">
          {lowInventory.length > 0 ? (
            <div className="row">
              {lowInventory.map(item => (
                <div key={item.id} className="col-md-4 mb-3">
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-body">
                      <p>
                        {item.item_name} - {parseFloat(item.quantity).toFixed(2)} left
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Inventory levels are sufficient.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookDashboardPage;
