// routes/menuRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';

const router = Router();

// Get all menu items
router.get('/', authMiddleware, getMenuItems);

// Add a new menu item
router.post('/', authMiddleware, allowRoles(['root', 'cook']), addMenuItem);

// Update a menu item
router.put('/:id', authMiddleware, allowRoles(['root', 'cook']), updateMenuItem);

// Delete a menu item
router.delete('/:id', authMiddleware, allowRoles(['root', 'cook']), deleteMenuItem);



// router.post('/', authMiddleware, addMenuItem);
// router.put('/:id', authMiddleware, updateMenuItem);
// router.delete('/:id', authMiddleware, deleteMenuItem);

export default router;
