// routes/menuRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';

const router = Router();

router.get('/', authMiddleware, getMenuItems);
router.post('/', authMiddleware, addMenuItem);
router.put('/:id', authMiddleware, updateMenuItem);
router.delete('/:id', authMiddleware, deleteMenuItem);

export default router;
