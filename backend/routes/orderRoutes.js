// routes/orderRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  placeOrder,
  getOrderHistory,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

// Place an order
// router.post('/', authMiddleware, placeOrder);
router.post('/', authMiddleware, allowRoles(['user']), placeOrder);

// Get order history for the logged-in user
// router.get('/my-orders', authMiddleware, getOrderHistory);
router.get('/my-orders', authMiddleware, allowRoles(['user']), getOrderHistory);

// Get all orders (Root,admin and Cook)
// router.get('/', authMiddleware, getAllOrders);
router.get('/', authMiddleware, allowRoles(['root', 'cook', 'admin']), getAllOrders);

// Update order status (Root and Cook)
// router.put('/:id/status', authMiddleware, updateOrderStatus);
router.put('/:id/status', allowRoles(['root', 'cook']), updateOrderStatus);

export default router;


