import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MenuItemIngredient = sequelize.define('MenuItemIngredient', {
  quantityUsed: {
    type: DataTypes.FLOAT,
    allowNull: false, // Quantity of ingredient used per menu item
  },
});

export default MenuItemIngredient;