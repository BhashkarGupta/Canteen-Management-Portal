// models/MenuItemIngredient.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const MenuItemIngredient = sequelize.define(
  'MenuItemIngredient',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity_required: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'Menu_Item_Ingredients',
  }
);

export default MenuItemIngredient;
