// models/index.js
import User from './User.js';
import MenuItem from './MenuItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Venue from './Venue.js';
import VenueBooking from './VenueBooking.js';
import InventoryItem from './InventoryItem.js';


// User Associations
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Order Associations
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// MenuItem Associations
MenuItem.hasMany(OrderItem, { foreignKey: 'menu_item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

User.hasMany(VenueBooking, { foreignKey: 'user_id' });
VenueBooking.belongsTo(User, { foreignKey: 'user_id' });

Venue.hasMany(VenueBooking, { foreignKey: 'venue_id' });
VenueBooking.belongsTo(Venue, { foreignKey: 'venue_id' });

// Export all models
export {
  User,
  MenuItem,
  Order,
  OrderItem,
  Venue,
  VenueBooking,
  InventoryItem,
};
