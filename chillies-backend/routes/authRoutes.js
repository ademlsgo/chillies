const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

require('dotenv').config();

const users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('Admin123!', 10),
        role: 'superuser',
    },
];

// Route pour la connexion
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username ou password manquant.' });
    }

    const user = users.find((u) => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.status(200).json({ token });
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

module.exports = { router, authenticateJWT };
