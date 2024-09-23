// routes/venueBookingRoutes.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  requestVenueBooking,
  getUserVenueBookings,
  updateBookingStatus,
  getAllVenueBookings,
} from '../controllers/venueBookingController.js';

const router = Router();

router.post('/', authMiddleware, requestVenueBooking);
router.get('/my-bookings', authMiddleware, getUserVenueBookings);
router.put('/:id/status', authMiddleware, updateBookingStatus);
router.get('/', authMiddleware, getAllVenueBookings);

export default router;
