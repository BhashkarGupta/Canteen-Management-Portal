import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';


const router = Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password_hash'] },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
      console.log(error);
    }
  });

export default router;
