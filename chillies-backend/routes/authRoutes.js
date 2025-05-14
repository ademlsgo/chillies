const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

require('dotenv').config();

// Utilisateurs de votre base de données
const users = [
    {
        id: 1,
        first_name: 'Adem',
        last_name: 'Fellah',
        email: 'ademverdon@gmail.com',
        password: bcrypt.hashSync('AdemFellah13?', 10),
        role: 'superuser',
        identifiant: 'ademfellah'
    },
    {
        id: 2,
        first_name: 'Marin',
        last_name: 'Harel',
        email: 'marin.harel@gmail.com',
        password: bcrypt.hashSync('MarinHarel13?', 10),
        role: 'employee',
        identifiant: 'marinharel'
    }
];

// Route pour la connexion
router.post('/login', (req, res) => {
    const { identifiant, password } = req.body;

    if (!identifiant || !password) {
        return res.status(400).json({ message: 'Identifiant ou mot de passe manquant.' });
    }

    const user = users.find((u) => u.identifiant === identifiant);
    if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
        { 
            id: user.id, 
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            identifiant: user.identifiant
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    res.status(200).json({ 
        token,
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            identifiant: user.identifiant
        }
    });
});

// Route pour créer un super utilisateur
router.post('/register-superuser', (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword,
        role: 'superuser',
    };
    users.push(newUser);

    res.status(201).json({ message: 'Super utilisateur créé avec succès.' });
});

// Middleware pour vérifier le token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token manquant.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }
        req.user = user;
        next();
    });
};

// Route protégée pour vérifier le statut de l'authentification
router.get('/me', authenticateJWT, (req, res) => {
    res.json(req.user);
});

module.exports = { router, authenticateJWT };


// Par exemple, une route pour /api/cocktails redirigera vers une fonction dans le contrôleur pour récupérer ou
// créer un cocktail.
