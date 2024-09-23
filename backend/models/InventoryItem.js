// models/InventoryItem.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const InventoryItem = sequelize.define(
  'InventoryItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    item_type: {
      type: DataTypes.STRING, // e.g., 'ingredient', 'utensil'
    },
    comments: {
      type: DataTypes.TEXT,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'Inventory',
  }
);

export default InventoryItem;
