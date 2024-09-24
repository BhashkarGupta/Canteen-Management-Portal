// routes/announcementRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';

const router = Router();

// Get all announcements - Accessible by all authenticated users
router.get('/', authMiddleware, getAllAnnouncements);

// Create announcement - Accessible by root, admin, and cook
router.post(
  '/',
  authMiddleware,
  allowRoles(['root', 'admin', 'cook']),
  createAnnouncement
);

// Update announcement - Accessible by root, admin, and cook (cooks only for their own)
router.put(
  '/:id',
  authMiddleware,
  allowRoles(['root', 'admin', 'cook']),
  updateAnnouncement
);

// Delete announcement - Accessible by root, admin, and cook (cooks only for their own)
router.delete(
  '/:id',
  authMiddleware,
  allowRoles(['root', 'admin', 'cook']),
  deleteAnnouncement
);

export default router;
