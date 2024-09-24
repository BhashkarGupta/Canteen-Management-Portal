import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Icons for status
import { MdFastfood } from 'react-icons/md'; // Icon for food

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // For search/filter
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const [categoryFilter, setCategoryFilter] = useState(''); // Category filter state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(6); // Set items per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all menu items
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/menu`);
        setMenuItems(response.data);
        setFilteredItems(response.data); // Initialize filteredItems with all items
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch menu items.');
        setLoading(false);
      }
    };

    fetchMenuItems();
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

  // Search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterItems(term, categoryFilter);
  };

  // Filter by category
  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    filterItems(searchTerm, category);
  };

  // Filter items based on search term and category
  const filterItems = (term, category) => {
    let items = menuItems;

    if (term) {
      items = items.filter(item => item.name.toLowerCase().includes(term));
    }

    if (category) {
      items = items.filter(item => item.category === category);
    }

    setFilteredItems(items);
  };

  // Get current page items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      {/* Page Header */}
      <h3 className="mb-4">
        <MdFastfood size={30} className="mr-2" /> All Menu Items
      </h3>

      {/* Search and Filter Options */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search for menu items..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={categoryFilter}
            onChange={handleCategoryFilter}
          >
            <option value="">Filter by Category</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>
      </div>

      {/* Menu Items */}
      <div className="row">
        {currentItems.length > 0 ? (
          currentItems.map(item => (
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
          <p>No menu items available at the moment.</p>
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

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

      {/* Footer */}
      <footer className="text-center mt-5">
        <p>&copy; {new Date().getFullYear()} Canteen Management Portal</p>
      </footer>
    </div>
  );
};

export default MenuPage;
