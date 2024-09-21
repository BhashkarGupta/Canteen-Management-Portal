// Controller logic for venue booking operations
import { Op } from 'sequelize';
import VenueBooking from '../models/VenueBooking.js';
import User from '../models/User.js';

// Create a venue booking
export const createVenueBooking = async (req, res) => {
  const { bookingDate, bookingTime, reservationStart, reservationEnd, purpose, venue, userId } = req.body;

  try {
    // Check if the venue is already booked
    const existingBooking = await VenueBooking.findOne({
      where: {
        venue,
        reservationStart: { [Op.lte]: reservationEnd },
        reservationEnd: { [Op.gte]: reservationStart },
        status: 'approved',  // Only check approved bookings
      },
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Venue is already booked for the selected time.' });
    }

    // Create booking
    const booking = await VenueBooking.create({
      bookingDate,
      bookingTime,
      reservationStart,
      reservationEnd,
      purpose,
      venue,
      UserId: userId,
    });

    res.status(201).json({ message: 'Booking created successfully, awaiting approval.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
  }
};

// Fetch all bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {
      const bookings = await VenueBooking.findAll({
        include: {
          model: User,
          attributes: { exclude: ['passwordHash'] } // Exclude passwordHash from the response
        }
      });
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  // Approve or Reject a booking (Admin)
export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const booking = await VenueBooking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: `Booking ${status} successfully`, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch a booking by its ID (User)
export const getBookingById = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await VenueBooking.findByPk(bookingId, {
      include: {
        model: User,
        attributes: { exclude: ['passwordHash'] }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};