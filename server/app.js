//import dotenv
import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import app from './src/config/app.config.js';
// ... vos autres imports

const port = process.env.PORT || 3000;

// Configuration de CORS - à placer AVANT vos routes
app.use(cors()); // Cette configuration permet les requêtes de toutes les origines

// Pour une configuration plus spécifique (recommandée en production) :
/*
app.use(cors({
  origin: 'http://localhost:5173', // Autorise uniquement votre frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));
*/

// ... le reste de votre configuration Express
app.use(express.json());

// ... vos routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


