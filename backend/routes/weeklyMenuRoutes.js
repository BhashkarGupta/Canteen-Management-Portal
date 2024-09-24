import express from 'express';
import { getTodayMenu, manageWeeklyMenu, getWeeklyMenu, deleteMenuItemFromDay } from '../controllers/weeklyMenuController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get today's menu (user accessible)
router.get('/today', authMiddleware, getTodayMenu);

// Get weekly menu (user accessible)
router.get('/week', authMiddleware, getWeeklyMenu);

// Manage weekly menu (only cook and admin can manage)
router.post('/manage', authMiddleware, allowRoles(['cook', 'root']), manageWeeklyMenu);

// Delete specific menu item from weekly menu (only cook and root can manage)
router.delete('/:day/:menuItemId', authMiddleware, allowRoles(['cook', 'root']), deleteMenuItemFromDay);


export default router;
