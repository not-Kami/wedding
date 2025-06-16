import mongoose from 'mongoose';
import { MONGO_URI } from './dotenv.config.js';

const connectToDatabase = async () => {
    try {
        // Configure mongoose settings
        mongoose.set('bufferCommands', false);
        mongoose.set('bufferMaxEntries', 0);
        
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            bufferCommands: false,
            bufferMaxEntries: 0,
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            waitQueueTimeoutMS: 10000,
        });
        
        console.log('Connected to MongoDB');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default connectToDatabase;