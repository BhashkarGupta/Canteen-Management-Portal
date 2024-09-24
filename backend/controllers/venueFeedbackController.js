// controllers/venueFeedbackController.js

import VenueFeedback from '../models/VenueFeedback.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';

// Submit Venue Feedback (User Only)
export const submitVenueFeedback = async (req, res) => {
  try {
    const { venue_id, content } = req.body;
    const user_id = req.user.userId;

    if (!venue_id || !content) {
      return res.status(400).json({ message: 'Venue ID and content are required' });
    }

    // Verify that the venue exists
    const venue = await Venue.findByPk(venue_id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const feedback = await VenueFeedback.create({ venue_id, user_id, content });
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Submit Venue Feedback Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Venue Feedbacks (Admin, Cook, Root)
export const getAllVenueFeedbacks = async (req, res) => {
  try {
    const feedbacks = await VenueFeedback.findAll({
      include: [
        { model: Venue, as: 'venue', attributes: ['id', 'venue_name'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(feedbacks);
  } catch (error) {
    console.error('Get All Venue Feedbacks Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Venue Feedback (Admin, Cook, Root)
export const deleteVenueFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await VenueFeedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Venue feedback not found' });
    }

    // If role is 'cook', ensure they can only delete their own feedback
    if (req.user.role === 'cook' && feedback.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await feedback.destroy();
    res.json({ message: 'Venue feedback deleted successfully' });
  } catch (error) {
    console.error('Delete Venue Feedback Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
