import mongoose from 'mongoose';
import User from '../resources/auth/user.model.js';
import { MONGO_URI } from './dotenv.config.js';

const createDemoUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@weddingplanner.com' });
    
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@weddingplanner.com',
      password: 'Demo123!' // This will be hashed automatically by the pre-save middleware
    });

    await demoUser.save();
    console.log('Demo user created successfully');
    
  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createDemoUser();