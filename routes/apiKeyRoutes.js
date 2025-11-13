/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: Gestion des API Keys (superuser uniquement)
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const ApiKey = require('../models/ApiKey');

const { verifyToken } = require('../middlewares/authMiddleware');
const { isSuperuser } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/v1/apikeys/generate:
 *   post:
 *     summary: Génère une nouvelle API Key (superuser uniquement)
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: API Key générée avec succès
 */
router.post('/generate', verifyToken, isSuperuser, async (req, res) => {
    try {
        const newKey = crypto.randomBytes(32).toString('hex');
        const userId = req.user.id;

        const createdKey = await ApiKey.create({
            key: newKey,
            userId
        });

        res.status(201).json({
            message: "API key generated successfully",
            apiKey: createdKey.key
        });

    } catch (error) {
        console.error("Error generating API key:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
