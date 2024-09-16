import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import MenuItem from './MenuItem.js';
import Ingredient from './Ingredient.js';

const MenuItemIngredient = sequelize.define('MenuItemIngredient', {
  quantityUsed: {
    type: DataTypes.FLOAT,
    allowNull: false, // Quantity of ingredient used per menu item
  },
});

// Relationships
MenuItem.belongsToMany(Ingredient, { through: MenuItemIngredient });
Ingredient.belongsToMany(MenuItem, { through: MenuItemIngredient });

export default MenuItemIngredient;
