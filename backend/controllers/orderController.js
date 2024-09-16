// Controller logic for order operations
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import MenuItem from '../models/MenuItem.js';
import Ingredient from '../models/Ingredient.js';
import MenuItemIngredient from '../models/MenuItemIngredient.js';

// Place an order
export const placeOrder = async (req, res) => {
  const { items, userId } = req.body;

  try {
    let totalCost = 0;

    // Create order
    const order = await Order.create({ totalCost, UserId: userId });

    // Process each item in the order
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      const subTotal = menuItem.price * item.quantity;
      totalCost += subTotal;

      // Create order item
      await OrderItem.create({
        quantity: item.quantity,
        subTotal,
        MenuItemId: menuItem.id,
        OrderId: order.id,
      });

      // Deduct ingredient quantities from inventory
      const ingredients = await MenuItemIngredient.findAll({ where: { MenuItemId: menuItem.id } });

      for (const ingredient of ingredients) {
        const usedQuantity = ingredient.quantityUsed * item.quantity;
        const ingredientData = await Ingredient.findByPk(ingredient.IngredientId);
        
        if (ingredientData.quantityAvailable < usedQuantity) {
          return res.status(400).json({ message: `Insufficient inventory for ${ingredientData.name}` });
        }

        ingredientData.quantityAvailable -= usedQuantity;
        await ingredientData.save();
      }
    }

    // Update total cost and save order
    order.totalCost = totalCost;
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
