# API de Gestion de Mariage

## 📋 Table des Matières
- [Aperçu](#aperçu)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Modèles](#modèles)

## 🎯 Aperçu

API RESTful pour la gestion de mariages, permettant de gérer les invités, les prestataires, les budgets et les événements de mariage.

## 📁 Structure du Projet

```
server/
├── src/
│   ├── config/
│   │   ├── app.config.js
│   │   ├── database.config.js
│   │   └── dotenv.config.js
│   ├── middleware/
│   │   └── config.logger.js
│   └── resources/
│       ├── wedding/
│       ├── vendor/
│       ├── guest/
│       └── budget/
```

## 🚀 Installation

1. **Cloner le dépôt:**
   ```bash
   git clone <url-du-dépôt>
   cd wedding
   ```

2. **Installer les dépendances:**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement:**
   Créer un fichier `.env` à la racine du projet:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/wedding-api
   ```

4. **Démarrer le serveur:**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

Le projet utilise trois fichiers de configuration principaux :

- `app.config.js` : Configuration de l'application Express
- `database.config.js` : Configuration de la connexion MongoDB
- `dotenv.config.js` : Configuration des variables d'environnement

## 📚 API Endpoints

### Mariages (Weddings)

```http
GET /api/weddings
POST /api/weddings
GET /api/weddings/:id
PUT /api/weddings/:id
DELETE /api/weddings/:id
```

### Invités (Guests)

```http
GET /api/guests
POST /api/guests
GET /api/guests/:id
PUT /api/guests/:id
DELETE /api/guests/:id
```

### Prestataires (Vendors)

```http
GET /api/vendors
POST /api/vendors
GET /api/vendors/:id
PUT /api/vendors/:id
DELETE /api/vendors/:id
```

### Budgets

```http
GET /api/budgets
POST /api/budgets
GET /api/budgets/:id
PUT /api/budgets/:id
DELETE /api/budgets/:id
```

## 📝 Modèles

### Invité (Guest)
```javascript
{
    wedding: ObjectId,  // Référence au mariage
    name: String,       // Nom de l'invité
    RSVP: Boolean,      // Statut de réponse
    plusOne: Boolean,   // Accompagnant
    status: String      // Statut (pending, confirmed, cancelled)
}
```

## 🔧 Middleware

Le projet utilise un middleware de logging configuré dans `config.logger.js` pour le suivi des requêtes et des erreurs.

