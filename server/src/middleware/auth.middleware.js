import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/dotenv.config.js';

// Ensure we have a valid JWT secret
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication token required',
        code: 'TOKEN_MISSING'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired', 
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }

    return res.status(500).json({ 
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

export const generateTokens = (userId) => {
  try {
    const accessToken = jwt.sign(
      { userId },
      JWT_SECRET,
      { 
        expiresIn: '1h',
        algorithm: 'HS256'
      }
    );

    const refreshToken = jwt.sign(
      { userId },
      JWT_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate tokens');
  }
}; 