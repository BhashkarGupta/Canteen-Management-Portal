// Menu routes
import express from 'express';
import { createMenuItem, getMenuItems } from '../controllers/menuController.js';

const router = express.Router();

// Menu item routes
router.post('/', createMenuItem); // Create a menu item
router.get('/', getMenuItems);    // Fetch all menu items

export default router;
