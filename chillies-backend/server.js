const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const { seedCocktails } = require('./seeders/cocktailSeeder');

// Import des fichiers de routes
const { router: authRouter } = require('./routes/authRoutes');
const cocktailRoutes = require('./routes/cocktailRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialisation de l'application Express
const app = express();

// ✅ Middleware CORS (placé juste après app)
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middlewares JSON
app.use(express.json());
app.use(bodyParser.json());

// Log des requêtes (utile pour debug)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Headers:`, req.headers);
    next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api', cocktailRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Route test
app.get('/', (req, res) => {
    res.send('API is running');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({
        message: 'Une erreur est survenue',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Démarrage après synchronisation DB
sequelize.sync().then(async () => {
    await seedCocktails();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log('🔗 Routes disponibles :');
        console.log('- GET /api/cocktails');
        console.log('- POST /api/auth/login');
        console.log('- GET /api/auth/me');
    });
}).catch(error => {
    console.error('Unable to start server:', error);
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);
