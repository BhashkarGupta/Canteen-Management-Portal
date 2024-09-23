// routes/recipeRoutes.js

import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addRecipe } from '../controllers/recipeController.js';

const router = Router();

// Add recipe to a menu item
router.post('/', authMiddleware, addRecipe);

export default router;
