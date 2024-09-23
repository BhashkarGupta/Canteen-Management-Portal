// controllers/menuController.js
import MenuItem from '../models/MenuItem.js';

// Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new menu item (Admin or Cook)
export const addMenuItem = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, price, availability, category } = req.body;
    const newItem = await MenuItem.create({
      name,
      description,
      price,
      availability,
      category,
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a menu item (Admin or Cook)
export const updateMenuItem = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    const updated = await MenuItem.update(req.body, { where: { id } });
    res.json({ message: 'Menu item updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a menu item (Admin or Cook)
export const deleteMenuItem = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    await MenuItem.destroy({ where: { id } });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
