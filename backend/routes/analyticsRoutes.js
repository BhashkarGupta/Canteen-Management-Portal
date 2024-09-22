
import express from 'express';
import { getPopularMenuItems, getIngredientUsageReport } from '../controllers/analyticsController.js';

const router = express.Router();

// Get popular menu items
router.get('/popular-items', getPopularMenuItems);

// Get ingredient usage report
router.get('/ingredient-usage', getIngredientUsageReport);

export default router;
