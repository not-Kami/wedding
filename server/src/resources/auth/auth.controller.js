import jwt from 'jsonwebtoken';
import User from './user.model.js';
import { generateTokens } from '../../middleware/auth.middleware.js';
import { JWT_SECRET } from '../../config/dotenv.config.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User already exists',
        code: 'USER_EXISTS'
      });
    }
    
    const user = await User.create({ name, email, password });
    const tokens = generateTokens(user._id);

    res.status(201).json({
      message: 'Registration successful',
      code: 'REGISTRATION_SUCCESS',
      ...tokens
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const tokens = generateTokens(user._id);

    res.status(200).json({
      message: 'Login successful',
      code: 'LOGIN_SUCCESS',
      ...tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        message: 'Refresh token is required',
        code: 'REFRESH_TOKEN_MISSING'
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const tokens = generateTokens(decoded.userId);

    res.status(200).json({
      message: 'Token refreshed successfully',
      code: 'REFRESH_SUCCESS',
      ...tokens
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Refresh token expired',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Invalid refresh token',
        code: 'REFRESH_TOKEN_INVALID'
      });
    }

    return res.status(500).json({ 
      message: 'Token refresh failed',
      code: 'REFRESH_ERROR'
    });
  }
};