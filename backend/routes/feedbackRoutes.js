// routes/feedbackRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { submitFeedback, getAllFeedbacks } from '../controllers/feedbackController.js';

const router = Router();

// Submit Feedback
router.post('/', authMiddleware, allowRoles(['user']), submitFeedback);

// Get All Feedbacks
router.get('/', authMiddleware, allowRoles(['root', 'cook', 'admin']), getAllFeedbacks);

export default router;
