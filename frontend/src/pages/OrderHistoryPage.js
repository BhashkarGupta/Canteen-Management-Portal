import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa'; // Icons for search and filter
import { format } from 'date-fns'; // Date formatting
import Pagination from '../components/Pagination'; // Pagination component

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6); // Display 6 orders per page
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // For searching orders
  const [ratings, setRatings] = useState({}); // Store ratings for each menu item

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/my-orders`);
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter by date range
  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders); // Reset if date filters are empty
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  // Search function for order status or item name
  const handleSearch = () => {
    if (searchTerm === '') {
      setFilteredOrders(orders); // Reset if search term is empty
      return;
    }

    const searched = orders.filter((order) =>
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.OrderItems.some((item) =>
        item.MenuItem.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredOrders(searched);
  };

  // Reset filters
  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setFilteredOrders(orders);
  };

  // Handle rating submission for each menu item
  const handleRatingChange = (menuItemId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [menuItemId]: rating,
    }));
  };

  const handleSubmitRating = async (menuItemId) => {
    if (ratings[menuItemId]) {
      try {
        // Ensure rating is a number
        const ratingValue = parseInt(ratings[menuItemId], 10);
        if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
          alert('Please select a valid rating between 1 and 5.');
          return;
        }

        // Log the data to check what's being sent
        console.log(`Submitting rating for menu_item_id: ${menuItemId} with rating: ${ratingValue}`);

        await axios.post(`${process.env.REACT_APP_API_URL}/ratings`, {
          menu_item_id: menuItemId,
          rating: ratingValue,
        });

        alert('Rating submitted successfully');
      } catch (error) {
        console.error('Error submitting rating:', error.response ? error.response.data : error.message);
        alert('Failed to submit rating. Please try again.');
      }
    } else {
      alert('Please select a rating before submitting.');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Order History</h3>

      {/* Search Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>
          <FaSearch className="me-2" /> Search Orders
        </h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              placeholder="Search by status or item name"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <button className="btn btn-primary me-2" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-secondary" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h5>
          <FaFilter className="me-2" /> Filter by Date
        </h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button className="btn btn-primary me-2" onClick={handleFilter}>
              Filter
            </button>
            <button className="btn btn-secondary" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{format(new Date(order.created_at), 'yyyy-MM-dd')}</td>
                <td>₹{order.total_amount}</td>
                <td>{order.status}</td>
                <td>
                  {order.OrderItems.map((item) => (
                    <div key={item.menu_item_id}>
                      {item.MenuItem.name} (x{item.quantity})
                      {order.status === 'accepted' && (
                        <div className="mt-2">
                          <label htmlFor={`rating-${item.menu_item_id}`}>Rate:</label>
                          <select
                            id={`rating-${item.menu_item_id}`}
                            className="form-control"
                            value={ratings[item.menu_item_id] || ''}
                            onChange={(e) => handleRatingChange(item.menu_item_id, e.target.value)}
                          >
                            <option value="">Select Rating</option>
                            {[...Array(5)].map((_, index) => (
                              <option key={index + 1} value={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-primary mt-2"
                            onClick={() => handleSubmitRating(item.menu_item_id)}
                          >
                            Submit Rating
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        itemsPerPage={ordersPerPage}
        totalItems={filteredOrders.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-dark text-white text-center">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} Canteen Management Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default OrderHistoryPage;
