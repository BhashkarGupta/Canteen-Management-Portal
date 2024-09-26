// controllers/feedbackController.js
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// Submit Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user.userId;

    if (!content) {
      return res.status(400).json({ message: 'Feedback content is required' });
    }

    const feedback = await Feedback.create({ content, user_id });
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Submit Feedback Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Feedbacks (Accessible by root and admin)
export const getAllFeedbacks = async (req, res) => {
  try {
    if (!['root', 'admin', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const feedbacks = await Feedback.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(feedbacks);
  } catch (error) {
    console.error('Get All Feedbacks Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
