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

router.get('/', authMiddleware, (req, res, next) => {
  if (!['root', 'cook'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}, getInventoryItems);

router.post('/', authMiddleware, (req, res, next) => {
  if (!['root', 'cook'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}, addInventoryItem);

router.put('/:id', authMiddleware, (req, res, next) => {
  if (!['root', 'cook'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}, updateInventoryItem);

router.delete('/:id', authMiddleware, (req, res, next) => {
  if (!['root', 'cook'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}, deleteInventoryItem);

// router.post('/', authMiddleware, addInventoryItem);
// router.put('/:id', authMiddleware, updateInventoryItem);
// router.delete('/:id', authMiddleware, deleteInventoryItem);

export default router;
