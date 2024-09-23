import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// export const registerUser = async (req, res) => {
//   try {
//     const { name, employee_id, email, password, address, contact_number } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const password_hash = await bcrypt.hash(password, salt);

//     // Create user
//     const user = await User.create({
//       name,
//       employee_id,
//       email,
//       password_hash,
//       address,
//       contact_number,
//     });

//     // Generate JWT token
//     const payload = { userId: user.id, role: user.role };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ token, message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

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
  