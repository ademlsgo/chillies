const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const sequelize = require('./config/database');
const { seedCocktails } = require('./seeders/cocktailSeeder');

// Import des fichiers de routes
const { router: authRouter } = require('./routes/authRoutes');
const cocktailRoutes = require('./routes/cocktailRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const publicRoutes = require('./routes/publicRoutes');
const { swaggerUi, swaggerSpec } = require('./config/swagger');



// Initialisation de l'application Express
const app = express();

// Configuration de Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Middleware CORS
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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/cocktails', cocktailRoutes);
app.use('/api/v1/api-keys', apiKeyRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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

// Démarrage du serveur
async function startServer() {
    try {
        await sequelize.authenticate();
        await seedCocktails();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log('🔗 Routes disponibles :');
            console.log('- GET /api/cocktails');
            console.log('- POST /api/auth/login');
            console.log('- POST /api/auth/google/login');
            console.log('- GET /api/auth/me');
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

setTimeout(() => {
    startServer();
}, 2000);

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Force rebuild
