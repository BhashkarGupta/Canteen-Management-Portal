// routes/profileRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/profileController.js';

const router = Router();

// Get User Profile
router.get('/', authMiddleware, getUserProfile);

// Update User Profile
router.put('/', authMiddleware, updateUserProfile);

export default router;
