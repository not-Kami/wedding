import jwt from 'jsonwebtoken';
import User from './user.model.js';
import mongoose from 'mongoose';

// Hard-coded JWT secret as fallback
const JWT_SECRET = process.env.JWT_SECRET || 'wedding_planner_jwt_secret_key_2024';

export const register = async (req, res) => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists with timeout
    const existingUser = await User.findOne({ email }).maxTimeMS(10000);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password });
    
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ message: 'Database connection timeout. Please try again.' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid input data' });
    }
    
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

export const login = async (req, res) => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email with timeout
    const user = await User.findOne({ email }).maxTimeMS(10000);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ message: 'Database connection timeout. Please try again.' });
    }
    
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};