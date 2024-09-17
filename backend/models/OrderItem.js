// OrderItem model
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import MenuItem from './MenuItem.js';
import Order from './Order.js';

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default OrderItem;
