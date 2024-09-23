// routes/orderRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  placeOrder,
  getOrderHistory,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

// Place an order
router.post('/', authMiddleware, placeOrder);

// Get order history for the logged-in user
router.get('/my-orders', authMiddleware, getOrderHistory);

// Get all orders (Root and Cook)
router.get('/', authMiddleware, getAllOrders);

// Update order status (Root and Cook)
router.put('/:id/status', authMiddleware, updateOrderStatus);

export default router;
