const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import des fichiers de routes
const authRoutes = require('./routes/authRoutes');
// const cocktailRoutes = require('./routes/cocktailRoutes');
// const orderRoutes = require('./routes/orderRoutes');

// Import de la configuration de la base de données
const db = require('./config/db');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(cors({ origin: 'http://localhost:3000' })); // Autorise uniquement le front-end sur localhost:3000

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/cocktails', cocktailRoutes);
// app.use('/api/orders', orderRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
