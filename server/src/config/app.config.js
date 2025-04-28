import express from 'express';
import database from './database.config.js';

const app = express();

database.then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log('Error connecting to database', err);
});

export default app;

