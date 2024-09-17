// Venue booking routes
import express from 'express';
import { createVenueBooking, getAllBookings } from '../controllers/venueBookingController.js';

const router = express.Router();

// Create a new venue booking
router.post('/', createVenueBooking);

// Admin: View all bookings
router.get('/', getAllBookings);

export default router;
