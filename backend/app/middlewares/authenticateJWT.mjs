// authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader); // Debug
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No Bearer token found');
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token); // Debug

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug
    
    if (!decoded.userId) {
      console.log('Token missing userId');
      return res.status(401).json({ error: "Invalid token payload" });
    }
    
    req.user = { id: decoded.userId, username: decoded.username }; // Standardized user object
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    
    return res.status(401).json({ error: "Invalid token" });
  }
};