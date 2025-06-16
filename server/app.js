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

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/budgets', budgetRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;