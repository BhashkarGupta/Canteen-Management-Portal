import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Ingredient = sequelize.define('Ingredient', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantityAvailable: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., kg, liters, etc.
  },
});

export default Ingredient;
