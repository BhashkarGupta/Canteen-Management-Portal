import { Router } from 'express';
import { registerUser, loginUser, resetUserPassword,changePassword,registerUserAdmin,registerUserRoot,getAllUsers, updateCredit} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
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

// Register user, cook, admin, root by root
router.post(
  '/register/root',
  authMiddleware,
  allowRoles(['root']),
  registerUserRoot
);

// Register user, cook, admin by admin
router.post(
  '/register/admin',
  authMiddleware,
  allowRoles(['root', 'admin']),
  registerUserAdmin
);

// Reset User Password
router.put(
  '/reset-password',
  authMiddleware,
  allowRoles(['root', 'admin']),
  resetUserPassword
);

// Change Password (Authenticated Users)
router.put(
  '/change-password',
  authMiddleware,
  changePassword
);

// Fethch all users
router.get('/get-all-users', authMiddleware, allowRoles(['root', 'admin']), getAllUsers);

// update credit balace
router.put('/update-credit', authMiddleware, allowRoles(['root', 'admin']), updateCredit);

export default router;
