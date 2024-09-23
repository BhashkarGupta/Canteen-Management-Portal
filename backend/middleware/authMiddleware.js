import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
