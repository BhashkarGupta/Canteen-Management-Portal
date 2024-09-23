// controllers/recipeController.js

import MenuItemIngredient from '../models/MenuItemIngredient.js';
// import MenuItem from '../models/MenuItem.js';
// import InventoryItem from '../models/InventoryItem.js';

// Add ingredients to a menu item
export const addRecipe = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { menu_item_id, ingredients } = req.body;
    // ingredients: [{ inventory_item_id, quantity_required }]

    for (const ingredient of ingredients) {
      await MenuItemIngredient.create({
        menu_item_id,
        inventory_item_id: ingredient.inventory_item_id,
        quantity_required: ingredient.quantity_required,
      });
    }

    res.status(201).json({ message: 'Recipe added successfully' });
  } catch (error) {
    console.error('Add recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
