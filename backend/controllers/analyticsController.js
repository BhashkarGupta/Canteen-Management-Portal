// Controller for menu items analytics
import { sequelize } from '../config/database.js';
import OrderItem from '../models/OrderItem.js';
import MenuItem from '../models/MenuItem.js';
import MenuItemIngredient from '../models/MenuItemIngredient.js';
import Ingredient from '../models/Ingredient.js';

// Get popular menu items based on order count
export const getPopularMenuItems = async (req, res) => {
  try {
    const popularItems = await OrderItem.findAll({
      attributes: [
        'MenuItemId',
        [sequelize.fn('COUNT', sequelize.col('MenuItemId')), 'orderCount']
      ],
      group: ['MenuItemId'],
      include: [{ model: MenuItem, attributes: ['name', 'price'] }],
      order: [[sequelize.fn('COUNT', sequelize.col('MenuItemId')), 'DESC']],
      limit: 10 // Limit to top 10 popular items
    });

    res.status(200).json(popularItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// // Get total ingredient usage based on orders
// export const getIngredientUsageReport = async (req, res) => {
//   try {
//     const ingredientUsage = await MenuItemIngredient.findAll({
//       attributes: [
//         'IngredientId',
//         [sequelize.fn('SUM', sequelize.col('quantityUsed')), 'totalUsed']
//       ],
//       group: ['IngredientId'],
//       include: [{
//         model: Ingredient,
//         as: 'ingredientMenus',  // Use the same alias as defined in associations
//         attributes: ['name', 'unit']
//       }]
//     });

//     res.status(200).json(ingredientUsage);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

//Getting error with the above function (I'll tackle that later), so using raw SQL query method

// Get total ingredient usage based on orders using raw SQL
export const getIngredientUsageReport = async (req, res) => {
  try {
    const ingredientUsage = await sequelize.query(
      `SELECT 
        i.name, 
        i.unit, 
        SUM(mii.quantityUsed) AS totalUsed 
      FROM MenuItemIngredients mii
      JOIN Ingredients i ON i.id = mii.IngredientId
      GROUP BY i.id, i.name, i.unit`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json(ingredientUsage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};