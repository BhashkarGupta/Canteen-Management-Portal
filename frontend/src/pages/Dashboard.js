import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Icons for status
import { BsFillCreditCardFill } from 'react-icons/bs'; // Icon for credit
import { MdFastfood } from 'react-icons/md'; // Icon for food
import { BiInfoCircle } from 'react-icons/bi'; // Icon for announcements

const UserDashboard = () => {
  const [userName, setUserName] = useState('');
  const [creditBalance, setCreditBalance] = useState(0);
  const [todayMenu, setTodayMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile for welcome message and credit balance
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`);
        setUserName(response.data.name);
        const userCredit = parseFloat(response.data.credit_balance) || 0;
        setCreditBalance(userCredit);
      } catch (error) {
        setError('Failed to fetch user profile.');
      }
    };

    // Fetch today's menu
    const fetchTodayMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-menu/today`);
        setTodayMenu(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch today\'s menu.');
        setLoading(false);
      }
    };

    // Fetch announcements
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/announcements`);
        setAnnouncements(response.data);
      } catch (error) {
        setError('Failed to fetch announcements.');
      }
    };

    fetchUserProfile();
    fetchTodayMenu();
    fetchAnnouncements();
  }, []);

  // Handle checkbox selection for menu items
  const handleCheckboxChange = (menuItem, isChecked) => {
    let updatedItems = [...selectedItems];
    let updatedPrice = totalPrice;

    if (isChecked) {
      updatedItems.push(menuItem);
      updatedPrice += parseFloat(menuItem.price);
    } else {
      updatedItems = updatedItems.filter(item => item.id !== menuItem.id);
      updatedPrice -= parseFloat(menuItem.price);
    }

    setSelectedItems(updatedItems);
    setTotalPrice(Math.max(0, updatedPrice));
  };

  // Place order function
  const handlePlaceOrder = async () => {
    const orderItems = selectedItems.map(item => ({
      menu_item_id: item.id,
      quantity: 1,
    }));

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/orders`, { items: orderItems });
      alert('Order placed successfully');
      setSelectedItems([]);
      setTotalPrice(0);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <p>Loading today's menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      {/* Welcome Message */}
      <h2 className="text-center mb-4">Welcome, <strong>{userName}</strong>!</h2>

      {/* Credit Balance Card */}
      <div className="card shadow-sm text-center mb-4">
        <div className="card-body">
          <BsFillCreditCardFill className="mb-3" size={40} color="green" />
          <h4>Your Credit Balance</h4>
          <h5 className="text-success">₹{creditBalance.toFixed(2)}</h5>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <BiInfoCircle size={25} className="mr-2" /> Announcements
        </div>
        <div className="card-body">
          {announcements.length > 0 ? (
            <ul className="list-group">
              {announcements.map(announcement => (
                <li key={announcement.id} className="list-group-item">
                  <strong>{announcement.title}</strong>: {announcement.content}
                </li>
              ))}
            </ul>
          ) : (
            <p>No announcements at the moment.</p>
          )}
        </div>
      </div>

      {/* Today's Menu */}
      <h3 className="mb-4">
        <MdFastfood size={30} className="mr-2" /> Today's Menu
      </h3>
      <div className="row">
        {todayMenu.length > 0 ? (
          todayMenu.map(item => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card shadow-sm h-100 hover-card">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                  {item.availability === 'available' ? (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`menuItem-${item.id}`}
                        onChange={e => handleCheckboxChange(item, e.target.checked)}
                        checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                      />
                      <label className="form-check-label" htmlFor={`menuItem-${item.id}`}>
                        Select
                      </label>
                    </div>
                  ) : (
                    <p className="text-danger">
                      <FaExclamationCircle className="mr-1" /> Unavailable
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No menu items available today.</p>
        )}
      </div>

      {/* Order Summary and Place Order Button */}
      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h4>Order Summary</h4>
          <ul className="list-group mb-3">
            {selectedItems.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                {item.name} <span>₹{item.price}</span>
              </li>
            ))}
          </ul>
          <h5 className="mb-3">Total Price: ₹{totalPrice.toFixed(2)}</h5>
          <button className="btn btn-primary" onClick={handlePlaceOrder}>
            Confirm and Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
