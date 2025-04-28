import express from 'express';
import database from './database.config.js';
import userRouter from '../resources/user/user.route.js';
import weddingRouter from '../resources/wedding/wedding.route.js';
import loggerMiddleware from '../middleware/config.logger.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
database.then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log('Error connecting to database', err);
});

app.use('/api/users', userRouter);
app.use('/api/weddings', weddingRouter);
app.use('/', loggerMiddleware);

export default app;

