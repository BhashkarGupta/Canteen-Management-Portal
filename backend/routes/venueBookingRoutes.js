// routes/venueBookingRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import {
  requestVenueBooking,
  getUserVenueBookings,
  updateBookingStatus,
  getAllVenueBookings,
} from '../controllers/venueBookingController.js';

const router = Router();
// Add venue booking
// router.post('/', authMiddleware, requestVenueBooking);
router.post('/', authMiddleware, allowRoles(['user']), requestVenueBooking);

// Get venue booking history for the logged-in user
// router.get('/my-bookings', authMiddleware, getUserVenueBookings);
router.get('/my-bookings', authMiddleware, allowRoles(['user']), getUserVenueBookings);

// Update booking status
// router.put('/:id/status', authMiddleware, updateBookingStatus);
router.put('/:id/status', authMiddleware, allowRoles(['root', 'admin']), updateBookingStatus);

// Get all venue bookings
// router.get('/', authMiddleware, getAllVenueBookings);
router.get('/', authMiddleware, allowRoles(['root', 'admin']), getAllVenueBookings);

export default router;
