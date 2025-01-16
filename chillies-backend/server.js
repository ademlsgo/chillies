const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Test pour vérifier si la variable est chargée

// Import des fichiers de routes
const authRoutes = require('./routes/authRoutes');
const cocktailRoutes = require('./routes/cocktailRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Pour lire le corps des requêtes JSON

// Routes
console.log('Chargement des routes auth...');
app.use('/api/auth', authRoutes.router);
app.use('/api/cocktails', cocktailRoutes);
app.use('/api/orders', orderRoutes);

// Middleware pour loguer les requêtes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body);
    next();
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('JWT_SECRET:', process.env.JWT_SECRET);
