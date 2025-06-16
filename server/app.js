// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectToDatabase from './src/config/database.config.js';
import authRoutes from './src/resources/auth/auth.route.js';
import weddingRoutes from './src/resources/wedding/wedding.route.js';
import guestRoutes from './src/resources/guest/guest.route.js';
import vendorRoutes from './src/resources/vendor/vendor.route.js';
import budgetRoutes from './src/resources/budget/budget.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting Wedding Planner Server...');
console.log('📍 Port:', PORT);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Configure mongoose
mongoose.set('bufferCommands', false);

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
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint hit');
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Initialize server
const startServer = async () => {
  try {
    // Try to connect to database first
    console.log('🔄 Connecting to database...');
    await connectToDatabase();
    
    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log('✅ Server successfully started!');
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log('📡 API endpoints available:');
      console.log(`   - Health check: http://localhost:${PORT}/health`);
      console.log(`   - Test: http://localhost:${PORT}/api/test`);
      console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    });
    
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.log('🔄 Starting server without database connection for debugging...');
    
    // Start server anyway for debugging purposes
    app.listen(PORT, () => {
      console.log('⚠️  Server started in DEBUG mode (no database)');
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log('📡 Test endpoint available for debugging');
    });
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (err) {
    console.error('❌ Error closing database connection:', err);
  }
  process.exit(0);
});

// Start the server
startServer();

export default app;