// controllers/inventoryController.js
import InventoryItem from '../models/InventoryItem.js';

export const getInventoryItems = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    const items = await InventoryItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addInventoryItem = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { item_name, quantity, item_type, comments } = req.body;
    const item = await InventoryItem.create({
      item_name,
      quantity,
      item_type,
      comments,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    const { quantity, comments } = req.body;
    const item = await InventoryItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.update({ quantity, comments });
    res.json({ message: 'Inventory item updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    await InventoryItem.destroy({ where: { id } });
    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
