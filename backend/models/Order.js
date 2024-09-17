// Order model
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';


const Order = sequelize.define('Order', {
  totalCost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Order;
