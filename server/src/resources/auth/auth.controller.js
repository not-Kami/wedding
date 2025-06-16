import jwt from 'jsonwebtoken';
import User from './user.model.js';

// Fallback JWT secret if environment variable is not loaded
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_for_development_only_change_in_production';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('JWT_SECRET available:', !!JWT_SECRET);
    
    const user = await User.create({ name, email, password });
    
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('JWT_SECRET available:', !!JWT_SECRET);
    
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

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};