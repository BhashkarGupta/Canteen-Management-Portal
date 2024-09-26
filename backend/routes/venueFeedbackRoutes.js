// routes/venueFeedbackRoutes.js

import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  submitVenueFeedback,
  getAllVenueFeedbacks,
  deleteVenueFeedback,
} from '../controllers/venueFeedbackController.js';

const router = Router();

// Submit Venue Feedback - User Only
router.post(
  '/',
  authMiddleware,
  allowRoles(['user']),
  submitVenueFeedback
);

// Get All Venue Feedbacks - Admin, Root
router.get(
  '/',
  authMiddleware,
  allowRoles(['admin', 'root', 'cook']),
  getAllVenueFeedbacks
);

// Delete Venue Feedback - Admin, Root
router.delete(
  '/:id',
  authMiddleware,
  allowRoles(['admin', 'root']),
  deleteVenueFeedback
);

export default router;
