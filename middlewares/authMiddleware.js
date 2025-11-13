const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Vérifie le token JWT et charge l'utilisateur depuis la BDD
 */
exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

/**
 * Vérifie que l'utilisateur est superuser
 */
exports.isSuperuser = (req, res, next) => {
    if (!req.user || req.user.role !== 'superuser') {
        return res.status(403).json({ message: 'Superuser access required' });
    }
    next();
};
