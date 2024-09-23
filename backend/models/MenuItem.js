// models/MenuItem.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const MenuItem = sequelize.define(
  'MenuItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    availability: {
      type: DataTypes.ENUM('available', 'out of stock'),
      defaultValue: 'available',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
    },
    total_ratings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    tableName: 'Menu_Items',
  }
);

export default MenuItem;
