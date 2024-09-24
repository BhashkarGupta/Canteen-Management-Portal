// routes/ratingRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  submitRating,
  getRatingsForMenuItem,
  getAllRatings,
} from '../controllers/ratingController.js';

const router = Router();

// Submit Rating - Accessible by all authenticated users
router.post('/', authMiddleware, allowRoles(['user']),submitRating);

// Get Ratings for a Menu Item - Accessible by all authenticated users
router.get('/menu/:menu_item_id', authMiddleware, getRatingsForMenuItem);

// Get All Ratings - Accessible by root and admin
router.get('/', authMiddleware, allowRoles(['root', 'admin', 'cook']), getAllRatings);

export default router;
