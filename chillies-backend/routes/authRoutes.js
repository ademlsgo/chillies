const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// importing Environment Variables
require('dotenv').config();

// simulatingADatabase
const users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('Admin123!', 10), // hashAPassword
        role: 'superuser',
    },
];

// routeToConnect
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // userVerification
    const user = users.find((u) => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    // passwordCheck
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // generationOfTheJWTToken
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.status(200).json({ token });
});

// routeToCreateASuperUser
router.post('/register-superuser', (req, res) => {
    const { username, password } = req.body;

    // checkingIfUserAlreadyExists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    // creatingANewUser
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

module.exports = router;

