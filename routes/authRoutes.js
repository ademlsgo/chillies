/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints d'authentification (Admin + Users + Google OAuth)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

require('dotenv').config();

/* ----------------------------------------------------------
   AUTH ADMIN (superuser / employee)
----------------------------------------------------------- */

router.post('/login', async (req, res) => {
    const { identifiant, password } = req.body;

    if (!identifiant || !password) {
        return res.status(400).json({ message: 'Identifiant ou mot de passe manquant.' });
    }

    try {
        const user = await User.findOne({ where: { identifiant } });

        if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé.' });

        if (user.role !== 'superuser' && user.role !== 'employee') {
            return res.status(403).json({ message: 'Connexion réservée aux administrateurs.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Mot de passe incorrect.' });

        const token = jwt.sign({
            id: user.id,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            identifiant: user.identifiant
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

    } catch (err) {
        console.error('Erreur login admin:', err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

/* ----------------------------------------------------------
   REGISTER SUPERUSER
----------------------------------------------------------- */

router.post('/register-superuser', async (req, res) => {
    try {
        const { identifiant, password, first_name, last_name, email } = req.body;

        if (!identifiant || !password)
            return res.status(400).json({ message: 'Identifiant et mot de passe requis.' });

        const exists = await User.findOne({ where: { identifiant } });
        if (exists) return res.status(400).json({ message: 'Utilisateur déjà existant.' });

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            identifiant,
            password: hashed,
            first_name: first_name || 'Admin',
            last_name: last_name || 'User',
            email: email || null,
            role: 'superuser'
        });

        res.status(201).json({
            message: 'Superuser créé.',
            user: { id: newUser.id }
        });

    } catch (err) {
        console.error('Erreur superuser:', err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

/* ----------------------------------------------------------
   MIDDLEWARE JWT
----------------------------------------------------------- */

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'Token manquant.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide.' });
        req.user = user;
        next();
    });
};

/* ----------------------------------------------------------
   GOOGLE ONE TAP LOGIN
----------------------------------------------------------- */

router.post('/google/login', async (req, res) => {
    try {
        const { googleId, email, firstName, lastName } = req.body;

        if (!googleId)
            return res.status(400).json({ message: 'Google ID manquant.' });

        let user = await User.findOne({ where: { googleId } });

        if (!user && email) {
            user = await User.findOne({ where: { email } });
            if (user) {
                user.googleId = googleId;
                await user.save();
            }
        }

        if (!user) {
            user = await User.create({
                first_name: firstName || 'User',
                last_name: lastName || '',
                email: email || null,
                googleId,
                role: 'user'
            });
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur Google Login:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion Google.' });
    }
});

/* ----------------------------------------------------------
   /me
----------------------------------------------------------- */

router.get('/me', authenticateJWT, (req, res) => {
    res.json(req.user);
});

/* ----------------------------------------------------------
   EXPORT
----------------------------------------------------------- */

module.exports = {
    router,
    authenticateJWT
};
