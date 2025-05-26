import mongoose from 'mongoose';
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

