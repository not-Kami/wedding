// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './src/resources/auth/auth.route.js';
import weddingRoutes from './src/resources/wedding/wedding.route.js';
import guestRoutes from './src/resources/guest/guest.route.js';
import vendorRoutes from './src/resources/vendor/vendor.route.js';
import budgetRoutes from './src/resources/budget/budget.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI - use your provided URI directly if env fails
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:gkfAqupt0mbo9u9h@wedding-planner-db-test.xhdmhed.mongodb.net/?retryWrites=true&w=majority&appName=wedding-planner-db-test';

// Configure mongoose with better timeout settings
mongoose.set('bufferCommands', false);

// Connect to MongoDB with proper error handling
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB Atlas');
    
    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Failed to connect to database. Server not started.');
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/budgets', budgetRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Initialize database connection
connectToDatabase();

export default app;