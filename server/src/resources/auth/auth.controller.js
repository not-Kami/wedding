import jwt from 'jsonwebtoken';
import User from './user.model.js';
<<<<<<< HEAD
import mongoose from 'mongoose';
=======
import { generateTokens } from '../../middleware/auth.middleware.js';
>>>>>>> e96b766 (improved basic component & navigation)

// Hard-coded JWT secret as fallback
const JWT_SECRET = process.env.JWT_SECRET || 'wedding_planner_jwt_secret_key_2024';

export const register = async (req, res) => {
<<<<<<< HEAD
  console.log('=== REGISTRATION DEBUG START ===');
  console.log('Request body:', req.body);
  console.log('Database connection state:', mongoose.connection.readyState);
  console.log('Database name:', mongoose.connection.name);
  
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected');
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const { name, email, password } = req.body;
    console.log('Extracted data:', { name, email, password: password ? '***' : 'undefined' });
    
    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    console.log('✅ Input validation passed');
    
    // Check if user already exists with timeout
    console.log('🔍 Checking if user exists...');
    const existingUser = await User.findOne({ email }).maxTimeMS(10000);
    console.log('Existing user check result:', existingUser ? 'User exists' : 'User does not exist');
    
    if (existingUser) {
      console.log('❌ User already exists');
      return res.status(409).json({ message: 'User already exists' });
    }
    
    console.log('✅ User does not exist, proceeding with creation');
    console.log('🔨 Creating new user...');
    
    const user = await User.create({ name, email, password });
    console.log('✅ User created successfully:', { id: user._id, name: user.name, email: user.email });
    
    console.log('🔑 Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('✅ Token generated successfully');

    console.log('=== REGISTRATION DEBUG END - SUCCESS ===');
    res.status(201).json({ token });
  } catch (error) {
    console.log('=== REGISTRATION DEBUG END - ERROR ===');
    console.error('❌ Registration error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      console.log('🕐 Database timeout error');
      return res.status(503).json({ message: 'Database connection timeout. Please try again.' });
    }
    
    if (error.name === 'ValidationError') {
      console.log('📝 Validation error');
      console.error('Validation details:', error.errors);
      return res.status(400).json({ message: 'Invalid input data', details: error.errors });
    }
    
    if (error.code === 11000) {
      console.log('🔄 Duplicate key error');
      return res.status(409).json({ message: 'User already exists' });
    }
    
    res.status(500).json({ message: 'Registration failed. Please try again.' });
=======
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
>>>>>>> e96b766 (improved basic component & navigation)
  }
};

export const login = async (req, res) => {
<<<<<<< HEAD
  console.log('=== LOGIN DEBUG START ===');
  console.log('Request body:', { email: req.body.email, password: req.body.password ? '***' : 'undefined' });
  console.log('Database connection state:', mongoose.connection.readyState);
  
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected');
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    console.log('✅ Input validation passed');
    
    // Find user by email with timeout
    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email }).maxTimeMS(10000);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found, checking password...');
    // Check password
    const isValidPassword = await user.comparePassword(password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password valid, generating token...');
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('=== LOGIN DEBUG END - SUCCESS ===');
    res.status(200).json({ token });
  } catch (error) {
    console.log('=== LOGIN DEBUG END - ERROR ===');
    console.error('❌ Login error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      console.log('🕐 Database timeout error');
      return res.status(503).json({ message: 'Database connection timeout. Please try again.' });
    }
    
    res.status(500).json({ message: 'Login failed. Please try again.' });
=======
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
>>>>>>> e96b766 (improved basic component & navigation)
  }
};