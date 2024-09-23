// controllers/venueBookingController.js
import VenueBooking from '../models/VenueBooking.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';

export const requestVenueBooking = async (req, res) => {
  try {
    const { venue_id, booking_date, start_time, end_time, purpose } = req.body;
    const venue = await Venue.findByPk(venue_id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Optional: Check for overlapping bookings

    const booking = await VenueBooking.create({
      user_id: req.user.userId,
      venue_id,
      booking_date,
      start_time,
      end_time,
      purpose,
    });
    res.status(201).json({ message: 'Booking request submitted', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserVenueBookings = async (req, res) => {
  try {
    const bookings = await VenueBooking.findAll({
      where: { user_id: req.user.userId },
      include: [Venue],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    if (!['root', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { id } = req.params;
    const { status, admin_comment } = req.body;
    const booking = await VenueBooking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.update({ status, admin_comment });
    res.json({ message: 'Booking status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllVenueBookings = async (req, res) => {
  try {
    if (!['root', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const bookings = await VenueBooking.findAll({
      include: [Venue, User],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
