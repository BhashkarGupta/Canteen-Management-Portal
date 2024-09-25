// routes/inventoryRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';

const router = Router();

// Get all inventory items
router.get('/', authMiddleware, allowRoles(['root', 'cook']), getInventoryItems);

// Add a new inventory item
router.post('/', authMiddleware, allowRoles(['root', 'cook']), addInventoryItem);

// Update an inventory item
router.put('/:id', authMiddleware, allowRoles(['root', 'cook']), updateInventoryItem);

// Delete an inventory item
router.delete('/:id', authMiddleware, allowRoles(['root', 'cook']), deleteInventoryItem);

// router.post('/', authMiddleware, addInventoryItem);
// router.put('/:id', authMiddleware, updateInventoryItem);
// router.delete('/:id', authMiddleware, deleteInventoryItem);

export default router;
