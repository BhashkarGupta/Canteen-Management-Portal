// Venue booking routes
import express from 'express';
import { createVenueBooking, getAllBookings, updateBookingStatus, getBookingById} from '../controllers/venueBookingController.js';

const router = express.Router();

// Create a new venue booking
router.post('/', createVenueBooking);

// Admin: View all bookings
router.get('/', getAllBookings);

// Admin: Approve or reject a booking
router.put('/:bookingId/status', updateBookingStatus);

// User: Get a booking by ID
router.get('/:bookingId', getBookingById);

export default router;
