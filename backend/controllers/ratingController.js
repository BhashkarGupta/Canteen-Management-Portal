// controllers/ratingController.js
import Rating from '../models/Rating.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';

// Submit Rating
export const submitRating = async (req, res) => {
  try {
    const { menu_item_id, rating } = req.body;
    const user_id = req.user.userId;

    if (!menu_item_id || !rating) {
      return res.status(400).json({ message: 'Menu item ID and rating are required' });
    }

    // Check if menu item exists
    const menuItem = await MenuItem.findByPk(menu_item_id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if user has already rated this menu item
    const existingRating = await Rating.findOne({
      where: { menu_item_id, user_id },
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this menu item' });
    }

    // Create rating
    const newRating = await Rating.create({ menu_item_id, user_id, rating });
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Submit Rating Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Ratings for a Menu Item (Accessible by all authenticated users)
export const getRatingsForMenuItem = async (req, res) => {
  try {
    const { menu_item_id } = req.params;

    // Check if menu item exists
    const menuItem = await MenuItem.findByPk(menu_item_id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const ratings = await Rating.findAll({
      where: { menu_item_id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(ratings);
  } catch (error) {
    console.error('Get Ratings Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Ratings (Accessible by root and admin)
export const getAllRatings = async (req, res) => {
  try {
    if (!['root', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const ratings = await Rating.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: MenuItem, as: 'menuItem', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(ratings);
  } catch (error) {
    console.error('Get All Ratings Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
