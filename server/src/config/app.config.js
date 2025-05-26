import express from 'express';
import cors from 'cors';
import weddingRouter from '../resources/wedding/wedding.route.js';
import budgetRouter from '../resources/budget/budget.route.js';
import guestRouter from '../resources/guest/guest.route.js';
import vendorRouter from '../resources/vendor/vendor.route.js';
import loggerMiddleware from '../middleware/config.logger.js';
import connectToDatabase from './database.config.js';

const app = express();

// Ajout du middleware CORS pour résoudre les problèmes de CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware); // Déplacez le logger ici

// Connexion à la base de données
connectToDatabase()
  .then(() => {
    console.log('Database connection initialized');
  })
  .catch(err => {
    console.error('Failed to initialize database connection:', err);
  });

// Ajoutez ceci avant les routes API
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'API test route works!' });
});

// Configuration des routes API
app.use('/api/weddings', weddingRouter);
app.use('/api/guests', guestRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/budgets', budgetRouter);

export default app;

