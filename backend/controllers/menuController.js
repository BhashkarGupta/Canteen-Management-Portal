// Controller logic for menu operations
import MenuItem from '../models/MenuItem.js';
import Ingredient from '../models/Ingredient.js';
import MenuItemIngredient from '../models/MenuItemIngredient.js';

// Create a new menu item
export const createMenuItem = async (req, res) => {
  const { name, description, price, ingredients } = req.body;

  try {
    const menuItem = await MenuItem.create({ name, description, price });

    if (ingredients && ingredients.length) {
      for (const ingredient of ingredients) {
        const existingIngredient = await Ingredient.findByPk(ingredient.id);
        if (existingIngredient) {
          await MenuItemIngredient.create({
            MenuItemId: menuItem.id,
            IngredientId: existingIngredient.id,
            quantityUsed: ingredient.quantityUsed,
          });
        }
      }
    }

    res.status(201).json({ message: 'Menu item created successfully', menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch all menu items
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({ include: Ingredient });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
