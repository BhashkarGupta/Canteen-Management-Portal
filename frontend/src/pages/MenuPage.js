import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Icons for status
import { MdFastfood } from 'react-icons/md'; // Icon for food

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // For search/filter
  const [selectedItems, setSelectedItems] = useState({});
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

  // Handle checkbox selection and quantity input for menu items
  const handleItemSelection = (menuItemId, price, quantity) => {
    const selected = { ...selectedItems };
    
    if (quantity === 0) {
      delete selected[menuItemId]; // Remove item if quantity is 0
    } else {
      selected[menuItemId] = { price, quantity };
    }

    setSelectedItems(selected);
    updateTotalPrice(selected);
  };

  // Update total price based on selected items
  const updateTotalPrice = (selected) => {
    const newTotalPrice = Object.values(selected).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  // Place order function
  const handlePlaceOrder = async () => {
    const orderItems = Object.entries(selectedItems).map(([menuItemId, { quantity }]) => ({
      menu_item_id: parseInt(menuItemId),
      quantity,
    }));

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/orders`, { items: orderItems });
      alert('Order placed successfully');
      setSelectedItems({});
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
                    <div>
                      <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control mb-3"
                        id={`quantity-${item.id}`}
                        value={selectedItems[item.id]?.quantity || 0}
                        onChange={(e) => handleItemSelection(item.id, item.price, parseInt(e.target.value, 10))}
                      />
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
      {Object.keys(selectedItems).length > 0 && (
        <div className="mt-4">
          <h4>Order Summary</h4>
          <ul className="list-group mb-3">
            {Object.entries(selectedItems).map(([menuItemId, { quantity, price }]) => (
              <li key={menuItemId} className="list-group-item d-flex justify-content-between">
                {menuItems.find(item => item.id === parseInt(menuItemId))?.name} (x{quantity}) 
                <span>₹{price * quantity}</span>
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
      <footer className="footer mt-auto py-3 bg-dark text-white text-center">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} Canteen Management Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;
