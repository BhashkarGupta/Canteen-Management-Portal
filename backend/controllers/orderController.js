// controllers/orderController.js
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';

// Place an order
export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ menu_item_id, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items to order' });
    }

    // Calculate total amount and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menu_item_id);
      if (!menuItem || menuItem.availability !== 'available') {
        return res.status(400).json({ message: 'Invalid menu item selected' });
      }

      const price = parseFloat(menuItem.price) * item.quantity;
      totalAmount += price;

      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // Create order
    const order = await Order.create({
      user_id: req.user.userId,
      total_amount: totalAmount.toFixed(2),
    });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
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
    if (!['root', 'cook'].includes(req.user.role)) {
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
          attributes: ['name', 'email'],
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
  }
};
