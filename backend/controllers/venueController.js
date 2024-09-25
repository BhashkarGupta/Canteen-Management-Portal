// controllers/venueController.js
import Venue from '../models/Venue.js';

// Get all venues
export const getVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new venue
export const addVenue = async (req, res) => {
  try {
    if (!['root', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { venue_name, location, description } = req.body;
    const venue = await Venue.create({ venue_name, location, description });
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a venue
export const deleteVenue = async (req, res) => {
  try {
    if (!['root', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { id } = req.params;
    await Venue.destroy({ where: { id } });
    res.json({ message: 'Venue deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error);
  }
};
