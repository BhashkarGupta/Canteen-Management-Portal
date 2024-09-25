import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';

// Inventory Management Component
const InventoryManagementPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newInventoryItem, setNewInventoryItem] = useState({
    item_name: '',
    quantity: '',
    item_type: '',
    comments: '',
  });

  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [menuPage, setMenuPage] = useState(1);
  const menuItemsPerPage = 3;
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState([{ inventory_item_id: '', quantity_required: '' }]);
  const [searchInventory, setSearchInventory] = useState('');
  const [filteredInventoryForRecipe, setFilteredInventoryForRecipe] = useState([]);

  // Fetch all inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/inventory`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setInventoryItems(response.data);
        setFilteredInventory(response.data);
        setFilteredInventoryForRecipe(response.data); // For recipe use as well
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  // Fetch all menu items for recipe
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

  // Handle search/filter for inventory
  const handleInventorySearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = inventoryItems.filter((item) =>
      item.item_name.toLowerCase().includes(term)
    );
    setFilteredInventory(filtered);
  };

  // Handle search/filter for menu items
  const handleMenuSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setMenuSearchTerm(term);
    const filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(term)
    );
    setFilteredMenuItems(filtered);
  };

  // Search for inventory items in the add recipe modal
  const handleInventorySearchForRecipe = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchInventory(term);
    const filtered = inventoryItems.filter((item) =>
      item.item_name.toLowerCase().includes(term)
    );
    setFilteredInventoryForRecipe(filtered);
  };

  // Handle adding new inventory item
  const handleAddInventory = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/inventory`, newInventoryItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Inventory item added successfully');
      setNewInventoryItem({ item_name: '', quantity: '', item_type: '', comments: '' });
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/inventory`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInventoryItems(response.data);
      setFilteredInventory(response.data);
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  // Handle editing inventory item
  const handleEditInventory = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/inventory/${editItem.id}`, editItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Inventory item updated');
      setShowEditModal(false);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/inventory`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInventoryItems(response.data);
      setFilteredInventory(response.data);
    } catch (error) {
      console.error('Error editing inventory item:', error);
    }
  };

  // Handle deleting inventory item
  const handleDeleteInventory = async (itemId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/inventory/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Inventory item deleted');
      setInventoryItems(inventoryItems.filter(item => item.id !== itemId));
      setFilteredInventory(filteredInventory.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  // Handle adding a recipe to a menu item
  const handleAddRecipe = async () => {
    try {
      const ingredients = recipeIngredients.map((ingredient) => ({
        inventory_item_id: parseInt(ingredient.inventory_item_id),
        quantity_required: parseFloat(ingredient.quantity_required),
      }));

      await axios.post(`${process.env.REACT_APP_API_URL}/recipes`, {
        menu_item_id: selectedMenuItem.id,
        ingredients,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Recipe added successfully');
      setRecipeIngredients([{ inventory_item_id: '', quantity_required: '' }]);
      setShowRecipeModal(false);
    } catch (error) {
      alert('Error adding recipe: Ensure no duplicate ingredients are added.');
      console.error('Error adding recipe:', error);
    }
  };

  // Reset recipe ingredients input
  const handleResetRecipeForm = () => {
    setRecipeIngredients([{ inventory_item_id: '', quantity_required: '' }]);
    setSearchInventory(''); // Reset search inventory input
  };

  // Pagination logic for inventory
  const indexOfLastInventoryItem = currentPage * itemsPerPage;
  const indexOfFirstInventoryItem = indexOfLastInventoryItem - itemsPerPage;
  const currentInventoryItems = filteredInventory.slice(indexOfFirstInventoryItem, indexOfLastInventoryItem);

  // Pagination logic for menu
  const indexOfLastMenuItem = menuPage * menuItemsPerPage;
  const indexOfFirstMenuItem = indexOfLastMenuItem - menuItemsPerPage;
  const currentMenuItems = filteredMenuItems.slice(indexOfFirstMenuItem, indexOfLastMenuItem);

  return (
    <div className="container mt-5">
      {/* Inventory Management Header */}
      <h3 className="mb-4">Inventory Management</h3>

      {/* Search and Inventory List */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search for inventory items..."
          value={searchTerm}
          onChange={handleInventorySearch}
        />
        <div className="row">
          {currentInventoryItems.map(item => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.item_name}</h5>
                  <p className="card-text"><strong>Quantity:</strong> {parseFloat(item.quantity).toFixed(2)}</p>
                  <p className="card-text"><strong>Type:</strong> {item.item_type}</p>
                  <p className="card-text">
                    <strong>Comments:</strong> {item.comments.length > 20 ? (
                      <>
                        {item.comments.substring(0, 20)}...
                        <button className="btn btn-link" onClick={() => alert(item.comments)}>Show More</button>
                      </>
                    ) : (
                      item.comments
                    )}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-warning" onClick={() => handleEditInventory(item)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteInventory(item.id)}>
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination for Inventory Items */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(filteredInventory.length / itemsPerPage) }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Add Inventory Item Card */}
      <div className="card mb-5 p-4">
        <h5 className="card-title">Add New Inventory Item</h5>
        <div className="form-group mb-3">
          <label>Item Name</label>
          <input
            type="text"
            className="form-control"
            value={newInventoryItem.item_name}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, item_name: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            value={newInventoryItem.quantity}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, quantity: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label>Item Type</label>
          <input
            type="text"
            className="form-control"
            value={newInventoryItem.item_type}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, item_type: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label>Comments</label>
          <textarea
            className="form-control"
            value={newInventoryItem.comments}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, comments: e.target.value })}
          />
        </div>
        <button className="btn btn-success" onClick={handleAddInventory}>
          <FaPlusCircle /> Add Inventory Item
        </button>
      </div>

      {/* Recipe Management Header */}
      <h3 className="mb-4">Add Recipe to Menu Items</h3>

      {/* Search and Menu List */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search for menu items..."
          value={menuSearchTerm}
          onChange={handleMenuSearch}
        />
        <div className="row">
          {currentMenuItems.map(menuItem => (
            <div className="col-md-4 mb-3" key={menuItem.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{menuItem.name}</h5>
                  <p className="card-text">{menuItem.description}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedMenuItem(menuItem);
                      setShowRecipeModal(true);
                    }}
                  >
                    Add Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination for Menu Items */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(filteredMenuItems.length / menuItemsPerPage) }, (_, i) => (
              <li key={i + 1} className={`page-item ${menuPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setMenuPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Edit Inventory Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <>
              <div className="form-group mb-3">
                <label>Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editItem.item_name}
                  onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={editItem.quantity}
                  onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Item Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={editItem.item_type}
                  onChange={(e) => setEditItem({ ...editItem, item_type: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Comments</label>
                <textarea
                  className="form-control"
                  value={editItem.comments}
                  onChange={(e) => setEditItem({ ...editItem, comments: e.target.value })}
                />
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

      {/* Recipe Modal */}
      <Modal show={showRecipeModal} onHide={() => setShowRecipeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Recipe to {selectedMenuItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search inventory..."
            value={searchInventory}
            onChange={handleInventorySearchForRecipe}
          />
          {filteredInventoryForRecipe.map((inventory, index) => (
            <div key={index} className="form-group mb-3">
              <label>{inventory.item_name} - Available: {parseFloat(inventory.quantity).toFixed(2)}</label>
              <input
                type="number"
                className="form-control"
                placeholder="Quantity Required"
                value={recipeIngredients[index]?.quantity_required || ''}
                onChange={(e) =>
                  setRecipeIngredients(
                    recipeIngredients.map((ing, i) =>
                      i === index ? { ...ing, inventory_item_id: inventory.id, quantity_required: e.target.value } : ing
                    )
                  )
                }
              />
            </div>
          ))}
          <Button
            variant="link"
            onClick={() => setRecipeIngredients([...recipeIngredients, { inventory_item_id: '', quantity_required: '' }])}
          >
            Add Another Ingredient
          </Button>
          <Button
            variant="secondary"
            onClick={handleResetRecipeForm}
            className="mt-2"
          >
            Reset
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRecipeModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddRecipe}>
            Add Recipe
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
