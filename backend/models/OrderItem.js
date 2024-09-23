// models/OrderItem.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'Order_Items',
  }
);


export default OrderItem;
