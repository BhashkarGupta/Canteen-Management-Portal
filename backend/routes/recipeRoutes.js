// routes/recipeRoutes.js

import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { addRecipe } from '../controllers/recipeController.js';

const router = Router();

// Add recipe to a menu item
// router.post('/', authMiddleware, addRecipe);
router.post('/', authMiddleware, allowRoles(['root', 'cook']), addRecipe);

export default router;
