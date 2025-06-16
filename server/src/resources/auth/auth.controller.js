import jwt from 'jsonwebtoken';
import User from './user.model.js';
import { generateTokens } from '../../middleware/auth.middleware.js';

// Hard-coded JWT secret as fallback
const JWT_SECRET = process.env.JWT_SECRET || 'wedding_planner_jwt_secret_key_2024';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password });
    const tokens = generateTokens(user._id);

    res.status(201).json({
      message: 'Registration successful',
      ...tokens
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = generateTokens(user._id);

    res.status(200).json({
      message: 'Login successful',
      ...tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const tokens = generateTokens(decoded.userId);

    res.status(200).json({
      message: 'Token refreshed successfully',
      ...tokens
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};