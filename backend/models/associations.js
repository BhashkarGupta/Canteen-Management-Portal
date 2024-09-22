// backend/models/associations.js
import MenuItem from './MenuItem.js';
import Ingredient from './Ingredient.js';
import MenuItemIngredient from './MenuItemIngredient.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import User from './User.js';

// Order relationships
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
OrderItem.belongsTo(MenuItem);
Order.belongsTo(User);

// MenuItem-Ingredient relationships with alias (error part of getIngredientUsageReport)
// MenuItem.belongsToMany(Ingredient, { through: MenuItemIngredient, as: 'Ingredients' });
// Ingredient.belongsToMany(MenuItem, { through: MenuItemIngredient, as: 'MenuItems' });

// MenuItem-Ingredient relationships with explicit alias
// MenuItem.belongsToMany(Ingredient, { through: MenuItemIngredient, as: 'menuIngredients' });
// Ingredient.belongsToMany(MenuItem, { through: MenuItemIngredient, as: 'ingredientMenus' });

MenuItem.belongsToMany(Ingredient, { through: MenuItemIngredient, as: 'Ingredients' });
Ingredient.belongsToMany(MenuItem, { through: MenuItemIngredient, as: 'MenuItems' });
