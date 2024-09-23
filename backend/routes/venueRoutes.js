// routes/venueRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { getVenues, addVenue, deleteVenue } from '../controllers/venueController.js';

const router = Router();

// Get all venues
router.get('/', authMiddleware, getVenues);

// Add a new venue
// router.post('/', authMiddleware, addVenue);
router.post('/', authMiddleware, allowRoles(['root', 'admin']), addVenue);

// Delete a venue
// router.delete('/:id', authMiddleware, deleteVenue);
router.delete('/:id', authMiddleware, allowRoles(['root', 'admin']), deleteVenue);


export default router;
