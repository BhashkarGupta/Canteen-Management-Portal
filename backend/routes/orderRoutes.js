// Order routes
import express from 'express';
import { placeOrder } from '../controllers/orderController.js';
import { getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

// Place an order
router.post('/', placeOrder);
router.get('/:userId', getUserOrders);  // Fetch user's order history


export default router;
