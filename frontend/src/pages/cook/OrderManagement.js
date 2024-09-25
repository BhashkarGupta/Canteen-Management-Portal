import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons for approve/reject
import DatePicker from 'react-datepicker'; // For date selection
import 'react-datepicker/dist/react-datepicker.css'; // Calendar styles

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedDate, setSelectedDate] = useState(null); // Calendar state
  const [statusFilter, setStatusFilter] = useState(''); // Filter by status
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Search for orders by order ID, user name, or menu item name
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter(order =>
      order.id.toString().includes(term) ||
      order.User.name.toLowerCase().includes(term) ||
      order.OrderItems?.some(item =>
        item.MenuItem.name.toLowerCase().includes(term)
      )
    );

    setFilteredOrders(filtered);
  };

  // Filter by status (toggle filter on and off)
  const handleFilterByStatus = (status) => {
    if (statusFilter === status) {
      setStatusFilter(''); // Clear filter if clicking the same status
      setFilteredOrders(orders);
    } else {
      setStatusFilter(status);
      const filtered = orders.filter(order => order.status === status || status === '');
      setFilteredOrders(filtered);
    }
  };

  // Filter by date
  const handleFilterByDate = (date) => {
    setSelectedDate(date);
    if (date) {
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  // Handle approve/reject actions
  const handleApproveReject = async (orderId, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert(`Order ${status === 'accepted' ? 'approved' : 'rejected'} successfully`);

      // Update the order status locally after approval/rejection
      const updatedOrders = orders.map(order => order.id === orderId ? { ...order, status } : order);
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error(`Error updating order status to ${status}:`, error);
    }
  };

  // Calculate status counts
  const pendingCount = orders.filter(order => order.status === 'pending').length;
  const acceptedCount = orders.filter(order => order.status === 'accepted').length;
  const rejectedCount = orders.filter(order => order.status === 'rejected').length;

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal to view more details of the order
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Order Management</h3>

      {/* Search, Filter by Date, and Status Filter Section */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by order ID, user name, or menu item..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="d-flex">
          <DatePicker
            selected={selectedDate}
            onChange={handleFilterByDate}
            placeholderText="Select date"
            className="form-control w-50 mx-2"
          />
          {selectedDate && (
            <button className="btn btn-danger ml-2" onClick={() => handleFilterByDate(null)}>
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="mb-4 d-flex justify-content-between">
        <button className={`btn btn-outline-primary ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterByStatus('pending')}>
          Pending ({pendingCount})
        </button>
        <button className={`btn btn-outline-success ${statusFilter === 'accepted' ? 'active' : ''}`}
          onClick={() => handleFilterByStatus('accepted')}>
          Accepted ({acceptedCount})
        </button>
        <button className={`btn btn-outline-danger ${statusFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => handleFilterByStatus('rejected')}>
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Order Cards */}
      <div className="row">
        {currentOrders.length > 0 ? (
          currentOrders.map(order => (
            <div className="col-md-4 mb-4" key={order.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order.id}</h5>
                  <p><strong>User:</strong> {order.User.name}</p>
                  <p><strong>Email:</strong> {order.User.email}</p>
                  <p><strong>Contact:</strong> {order.User.contact_number}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date(order.created_at).toLocaleTimeString()}</p>
                  <ul className="list-group mb-3">
                    {order.OrderItems?.map(item => (
                      <li key={item.id} className="list-group-item">
                        {item.MenuItem.name} | Quantity: {item.quantity} | Price: ₹{item.price}
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-success"
                      onClick={() => handleApproveReject(order.id, 'accepted')}
                      disabled={order.status !== 'pending'}
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleApproveReject(order.id, 'rejected')}
                      disabled={order.status !== 'pending'}
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total Amount:</strong> ₹{selectedOrder.total_amount}</p>
              <ul className="list-group">
                {selectedOrder.OrderItems.map(item => (
                  <li key={item.id} className="list-group-item">
                    {item.MenuItem.name} | Quantity: {item.quantity} | Price: ₹{item.price}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagementPage;
