// Load environment variables first
import './src/config/dotenv.config.js';

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/budget', budgetRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;