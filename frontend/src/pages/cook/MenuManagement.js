import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaPlusCircle, FaEdit } from 'react-icons/fa'; // Icons for actions
import { MdFastfood } from 'react-icons/md'; // Food icon
import { Modal, Button } from 'react-bootstrap'; // For modal popup

const MenuManagementPage = () => {
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [selectedDay, setSelectedDay] = useState('Monday'); // Default to Monday
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]); // Tracks selected items for that day
  const [currentDayMenuItems, setCurrentDayMenuItems] = useState([]); // Tracks current items for the selected day
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    availability: 'available',
    category: 'vegetarian',
  });
  const [editItem, setEditItem] = useState(null); // Item to be edited
  const [showEditModal, setShowEditModal] = useState(false); // Controls the display of the edit modal
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of items per page for pagination
  const [menuPage, setMenuPage] = useState(1); // Pagination for the existing menu

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch all weekly menu items
  useEffect(() => {
    const fetchWeeklyMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/weekly-menu/week`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setWeeklyMenu(response.data);
        setCurrentDayMenuItems(response.data[selectedDay] || []); // Set current day's menu items
      } catch (error) {
        console.error('Error fetching weekly menu:', error);
      }
    };

    fetchWeeklyMenu();
  }, []);

  // Fetch all menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/menu`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMenuItems(response.data);
        setFilteredMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // Handle day selection change
  const handleDayChange = (day) => {
    setSelectedDay(day);
    setCurrentDayMenuItems(weeklyMenu[day] || []);
  };

  // Handle menu item search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = menuItems.filter(item => item.name.toLowerCase().includes(term));
    setFilteredMenuItems(filtered);
  };

  // Handle adding menu item to a specific day
  const handleAddMenuItemsToDay = async (menuItem) => {
    const updatedDayMenuItems = [...currentDayMenuItems, menuItem]; // Add new item to the current day's menu
    setCurrentDayMenuItems(updatedDayMenuItems);

    try {
      const menuItemIds = updatedDayMenuItems.map(item => item.id);
      await axios.post(`${process.env.REACT_APP_API_URL}/weekly-menu/manage`, {
        day: selectedDay,
        menuItems: menuItemIds,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Menu item added successfully');
    } catch (error) {
      console.error('Error adding menu items to the day:', error);
    }
  };

  // Handle deleting menu item from a specific day
  const handleDeleteMenuItemFromDay = async (menuItemId) => {
    const updatedDayMenuItems = currentDayMenuItems.filter(item => item.id !== menuItemId); // Remove the item from the current day's menu
    setCurrentDayMenuItems(updatedDayMenuItems);

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/weekly-menu/${selectedDay}/${menuItemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Menu item removed successfully');
    } catch (error) {
      console.error('Error deleting menu item from the day:', error);
    }
  };

  // Handle creating new menu item
  const handleCreateNewMenuItem = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/menu`, newMenuItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('New menu item created');
      setNewMenuItem({ name: '', description: '', price: '', availability: 'available', category: 'vegetarian' });
      // Refresh the menu items
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/menu`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMenuItems(response.data);
      setFilteredMenuItems(response.data);
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  // Handle menu item edit
  const handleEditMenuItem = (menuItem) => {
    setEditItem(menuItem); // Set the item to be edited
    setShowEditModal(true); // Show the modal
  };

  // Handle saving edited menu item
  const handleSaveEdit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/menu/${editItem.id}`, editItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Menu item updated successfully');
      setEditItem(null); // Reset the edit form
      setShowEditModal(false); // Hide the modal
      // Refresh the menu items
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/menu`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMenuItems(response.data);
      setFilteredMenuItems(response.data);
    } catch (error) {
      console.error('Error editing menu item:', error);
    }
  };

  // Handle deleting menu item permanently
  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/menu/${menuItemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Menu item deleted successfully');
      setMenuItems(menuItems.filter(item => item.id !== menuItemId)); // Remove from local state
      setFilteredMenuItems(filteredMenuItems.filter(item => item.id !== menuItemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItems = filteredMenuItems.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle menu pagination
  const indexOfLastMenuItem = menuPage * 6;
  const indexOfFirstMenuItem = indexOfLastMenuItem - 6;
  const currentMenuItems = filteredMenuItems.slice(indexOfFirstMenuItem, indexOfLastMenuItem);

  return (
    <div className="container mt-5">
      {/* Weekly Menu Management Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <MdFastfood size={30} className="me-2" /> Weekly Menu Management
        </h3>
        <a href="/weekly-menu" className="btn btn-outline-primary">View Weekly Menu</a>
      </div>

      {/* Day selection and Weekly Menu Display */}
      <div className="mb-4">
        <label>Select Day:</label>
        <select className="form-control" value={selectedDay} onChange={(e) => handleDayChange(e.target.value)}>
          {daysOfWeek.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Show menu items for the selected day */}
      <div className="mb-4">
        <h4>Menu Items for {selectedDay}</h4>
        <div className="row">
          {currentDayMenuItems.length > 0 ? (
            currentDayMenuItems.map(item => (
              <div className="col-md-3 mb-3" key={item.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">₹{item.price}</p>
                    <button className="btn btn-danger" onClick={() => handleDeleteMenuItemFromDay(item.id)}>
                      <FaTrashAlt /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No menu items for {selectedDay}</p>
          )}
        </div>
      </div>

      {/* Search and Add Menu Items */}
      <div className="mb-5">
        <h4>Add Menu Items to {selectedDay}</h4>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search for a menu item..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="row">
          {currentFilteredItems.map(item => (
            <div className="col-md-3 mb-3" key={item.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">₹{item.price}</p>
                  <button className="btn btn-primary" onClick={() => handleAddMenuItemsToDay(item)}>
                    <FaPlusCircle /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination for the search results */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(filteredMenuItems.length / itemsPerPage) }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Create New Menu Item */}
      <div className="card shadow-sm p-4 mb-5">
        <h4>Create New Menu Item</h4>
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={newMenuItem.name}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={newMenuItem.description}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={newMenuItem.price}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label>Availability</label>
          <select
            className="form-control"
            value={newMenuItem.availability}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, availability: e.target.value })}
          >
            <option value="available">Available</option>
            <option value="out of stock">Out of Stock</option>
          </select>
        </div>
        <div className="form-group mb-3">
          <label>Category</label>
          <select
            className="form-control"
            value={newMenuItem.category}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
          >
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>
        <button className="btn btn-success" onClick={handleCreateNewMenuItem}>
          Create Menu Item
        </button>
      </div>

      {/* Editable/Deletable Menu Items */}
      <div className="card shadow-sm p-4 mb-5">
        <h4>Edit/Delete Menu Items</h4>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search for a menu item..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="row">
          {currentMenuItems.map(item => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text"><strong>Description:</strong> {item.description}</p>
                  <p className="card-text"><strong>Price:</strong> ₹{item.price}</p>
                  <p className="card-text"><strong>Category:</strong> {item.category}</p>
                  <p className="card-text">
                    <strong>Availability:</strong> {item.availability === 'available' ? 'Available' : 'Out of Stock'}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-warning" onClick={() => handleEditMenuItem(item)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteMenuItem(item.id)}>
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(filteredMenuItems.length / 6) }, (_, i) => (
              <li key={i + 1} className={`page-item ${menuPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setMenuPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Edit Item Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Menu Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <>
              <div className="form-group mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={editItem.price}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Availability</label>
                <select
                  className="form-control"
                  value={editItem.availability}
                  onChange={(e) => setEditItem({ ...editItem, availability: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="out of stock">Out of Stock</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Category</label>
                <select
                  className="form-control"
                  value={editItem.category}
                  onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MenuManagementPage;
