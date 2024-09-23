// routes/venueRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getVenues, addVenue, deleteVenue } from '../controllers/venueController.js';

const router = Router();

router.get('/', authMiddleware, getVenues);
router.post('/', authMiddleware, addVenue);
router.delete('/:id', authMiddleware, deleteVenue);

export default router;
