// Auth middleware
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  
  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = await jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    
    // Attach user information to the request object
    req.user = decoded;
    
    // Continue to the next middleware or controller
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
