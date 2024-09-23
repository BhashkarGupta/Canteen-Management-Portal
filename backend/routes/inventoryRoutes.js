// routes/inventoryRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';

const router = Router();

router.get('/', authMiddleware, getInventoryItems);
router.post('/', authMiddleware, addInventoryItem);
router.put('/:id', authMiddleware, updateInventoryItem);
router.delete('/:id', authMiddleware, deleteInventoryItem);

export default router;
