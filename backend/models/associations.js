// backend/models/associations.js
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import MenuItem from './MenuItem.js';
import User from './User.js';

// Define relationships
Order.hasMany(OrderItem); // An order has many order items
OrderItem.belongsTo(Order); // Each order item belongs to an order
OrderItem.belongsTo(MenuItem); // Each order item refers to a menu item
Order.belongsTo(User); // Each order belongs to a user
