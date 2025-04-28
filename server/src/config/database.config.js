import mongoose from 'mongoose';
import MONGO_URI from './dotenv.config.js';

const database = mongoose.connect(MONGO_URI);

export default database;

