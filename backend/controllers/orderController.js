// controllers/orderController.js
import { sequelize } from '../config/db.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import MenuItemIngredient from '../models/MenuItemIngredient.js';
import InventoryItem from '../models/InventoryItem.js';
import { sendLowInventoryAlert } from '../utils/emailService.js';

// Place an order with credit deduction and allow negative balance
export const placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items } = req.body; // items: [{ menu_item_id, quantity }]

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'No items to order' });
    }

    let totalAmount = 0;
    const orderItems = [];
    const inventoryUsage = {};

    // Fetch user
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate the total cost of the order and track inventory usage
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menu_item_id);
      if (!menuItem || menuItem.availability !== 'available') {
        await transaction.rollback();
        return res.status(400).json({ message: 'Invalid menu item selected' });
      }

      const price = parseFloat(menuItem.price) * item.quantity;
      totalAmount += price;

      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price,
      });

      // Get ingredients for the menu item
      const ingredients = await MenuItemIngredient.findAll({
        where: { menu_item_id: item.menu_item_id },
      });

      for (const ingredient of ingredients) {
        const inventoryItemId = ingredient.inventory_item_id;
        const requiredQuantity = ingredient.quantity_required * item.quantity;

        if (!inventoryUsage[inventoryItemId]) {
          inventoryUsage[inventoryItemId] = requiredQuantity;
        } else {
          inventoryUsage[inventoryItemId] += requiredQuantity;
        }
      }
    }

    // Check inventory levels
    for (const inventoryItemId in inventoryUsage) {
      const requiredQuantity = inventoryUsage[inventoryItemId];
      const inventoryItem = await InventoryItem.findByPk(inventoryItemId);

      if (!inventoryItem || inventoryItem.quantity < requiredQuantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Insufficient inventory for item: ${inventoryItem?.item_name || 'Unknown'}`,
        });
      }
    }

    // Deduct inventory and check thresholds
    for (const inventoryItemId in inventoryUsage) {
      const requiredQuantity = inventoryUsage[inventoryItemId];
      const inventoryItem = await InventoryItem.findByPk(inventoryItemId);

      await inventoryItem.update(
        { quantity: inventoryItem.quantity - requiredQuantity },
        { transaction }
      );

      // Check if inventory is below threshold
      if (inventoryItem.quantity - requiredQuantity < inventoryItem.threshold) {
        // Trigger alert
        await sendLowInventoryAlert(inventoryItem.item_name, inventoryItem.quantity - requiredQuantity);
      }
    }

    // Deduct the total cost from the user's credit balance (allowing negative balance)
    const newBalance = user.credit_balance - totalAmount;
    await user.update({ credit_balance: newBalance }, { transaction });

    // Check if balance is negative and send alert
    // if (newBalance < 0) {
    //   console.log('Alert: User has a negative credit balance.');
    // }

    // Create the order
    const order = await Order.create(
      {
        user_id: req.user.userId,
        total_amount: totalAmount.toFixed(2),
      },
      { transaction }
    );

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create(
        {
          order_id: order.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
    await transaction.rollback();
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order history for a user
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.userId },
      include: [
        {
          model: OrderItem,
          include: [MenuItem],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(orders);
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (For Root and Cook)
export const getAllOrders = async (req, res) => {
  try {
    if (!['root', 'cook', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [MenuItem],
        },
        {
          model: User,
          attributes: ['name', 'email', 'contact_number'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (For Root and Cook)
export const updateOrderStatus = async (req, res) => {
  try {
    if (!['root', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
    console.error(error)
  }
};
