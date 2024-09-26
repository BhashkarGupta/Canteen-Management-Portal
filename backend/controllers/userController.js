import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { parse } from 'dotenv';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      employee_id,
      email,
      password,
      address,
      contact_number,
      role, // Accept the role from the request body
    } = req.body;

    if(role === 'root' || role === 'admin' || role === 'cook') {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user with the specified role
    const user = await User.create({
      name,
      employee_id,
      email,
      password_hash,
      address,
      contact_number,
      role, // Include the role here
    });

    // Generate JWT token
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerUserAdmin = async (req, res) => {
  try {
    const {
      name,
      employee_id,
      email,
      password,
      address,
      contact_number,
      role, // Accept the role from the request body
    } = req.body;

    if(role === 'root') {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user with the specified role
    const user = await User.create({
      name,
      employee_id,
      email,
      password_hash,
      address,
      contact_number,
      role, // Include the role here
    });

    // Generate JWT token
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerUserRoot = async (req, res) => {
  try {
    const {
      name,
      employee_id,
      email,
      password,
      address,
      contact_number,
      role, // Accept the role from the request body
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user with the specified role
    const user = await User.create({
      name,
      employee_id,
      email,
      password_hash,
      address,
      contact_number,
      role, // Include the role here
    });

    // Generate JWT token
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const payload = { userId: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token, message: 'Login successful' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Reset User Password
export const resetUserPassword = async (req, res) => {
  try {
    const { email,newPassword } = req.body;

    // Find the target user
    const targetUser = await User.findAll({ where: { email: email } });
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get roles
    const currentUserRole = req.user.role;
    const targetUserRole = targetUser.role;

    // Access Control
    if (currentUserRole === 'root') {
      // Root can reset passwords for all users
    } else if (currentUserRole === 'admin') {
      if (targetUserRole == 'root') {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update user's password
    await targetUser[0].update({ password_hash });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    // Find the authenticated user
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check password strength
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers',
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update user's password
    await user.update({ password_hash });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// add credit
export const updateCredit = async (req, res) => {
  try {
    const { email, credit } = req.body;

    // Find the target user
    const targetUser = await User.findAll({ where: { email: email } });
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const credit_balance = (parseFloat(targetUser[0].credit_balance) + parseFloat(credit)).toString();

    // Update user's credit
    await targetUser[0].update({ credit_balance});

    res.json({ message: 'Credit balance updated successfully' });
  } catch (error) {
    console.error('Credit update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};