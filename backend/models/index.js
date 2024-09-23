// models/index.js
import User from './User.js';
import MenuItem from './MenuItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Venue from './Venue.js';
import VenueBooking from './VenueBooking.js';
import InventoryItem from './InventoryItem.js';
import MenuItemIngredient from './MenuItemIngredient.js';


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


// MenuItemIngredient Associations
MenuItem.belongsToMany(InventoryItem, {
  through: MenuItemIngredient,
  foreignKey: 'menu_item_id',
});

InventoryItem.belongsToMany(MenuItem, {
  through: MenuItemIngredient,
  foreignKey: 'inventory_item_id',
});

MenuItemIngredient.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });
MenuItemIngredient.belongsTo(InventoryItem, { foreignKey: 'inventory_item_id' });

// Export all models
export {
  User,
  MenuItem,
  Order,
  OrderItem,
  Venue,
  VenueBooking,
  InventoryItem,
  MenuItemIngredient,
};
