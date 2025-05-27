import express from 'express';
import cors from 'cors';
import authRouter from '../resources/auth/auth.route.js';
import weddingRouter from '../resources/wedding/wedding.route.js';
import budgetRouter from '../resources/budget/budget.route.js';
import guestRouter from '../resources/guest/guest.route.js';
import vendorRouter from '../resources/vendor/vendor.route.js';
import loggerMiddleware from '../middleware/config.logger.js';
import connectToDatabase from './database.config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

connectToDatabase()
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

// Route de test
app.get('/api/test', (req, res) => res.json({ message: 'API test route works!' }));

// LOGIN / REGISTER
app.use('/api/auth', authRouter);

// Autres routes
app.get('/', (req, res) => res.json({ message: 'Login route works!' }));
app.use('/api/weddings', weddingRouter);
app.use('/api/guests', guestRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/budgets', budgetRouter);

export default app;
