// models/index.js
import User from './User.js';
import MenuItem from './MenuItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';


// User Associations
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Order Associations
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// MenuItem Associations
MenuItem.hasMany(OrderItem, { foreignKey: 'menu_item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

// Export all models
export {
  User,
  MenuItem,
  Order,
  OrderItem,
};
