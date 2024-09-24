// controllers/announcementController.js
import Announcement from '../models/Announcement.js';
import User from '../models/User.js';

// Create Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const created_by = req.user.userId;

    const announcement = await Announcement.create({ title, content, created_by });
    res.status(201).json(announcement);
  } catch (error) {
    console.error('Create Announcement Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(announcements);
  } catch (error) {
    console.error('Get Announcements Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check permissions
    if (req.user.role === 'cook' && announcement.created_by !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only root and admin can edit any announcement, cook can edit their own
    if (!['root', 'admin', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await announcement.update({ title, content });
    res.json(announcement);
  } catch (error) {
    console.error('Update Announcement Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check permissions
    if (req.user.role === 'cook' && announcement.created_by !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only root and admin can delete any announcement, cook can delete their own
    if (!['root', 'admin', 'cook'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await announcement.destroy();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete Announcement Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
