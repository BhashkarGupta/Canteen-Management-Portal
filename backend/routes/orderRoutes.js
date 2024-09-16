// Order routes
import express from 'express';
import { placeOrder } from '../controllers/orderController.js';

const router = express.Router();

// Place an order
router.post('/', placeOrder);

export default router;
