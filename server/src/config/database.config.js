import mongoose from 'mongoose';
<<<<<<< HEAD

const connectToDatabase = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:gkfAqupt0mbo9u9h@wedding-planner-db-test.xhdmhed.mongodb.net/?retryWrites=true&w=majority&appName=wedding-planner-db-test';
    
    console.log('Using MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Reduced timeout for faster feedback
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 5000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas');
    return true;
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    
    if (err.name === 'MongoServerSelectionError') {
      console.error('🔍 Possible causes:');
      console.error('  - Internet connection issues');
      console.error('  - MongoDB Atlas IP whitelist restrictions');
      console.error('  - Incorrect connection string');
      console.error('  - MongoDB Atlas cluster is paused or unavailable');
    }
    
    throw err;
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

export default connectToDatabase;
=======
import { MONGO_URI } from './dotenv.config.js';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectToDatabase;

>>>>>>> e96b766 (improved basic component & navigation)
