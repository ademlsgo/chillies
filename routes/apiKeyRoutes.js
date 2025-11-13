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
const checkSuperUser = require('../middlewares/checkSuperUser');

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API key generated successfully
 *                 apiKey:
 *                   type: string
 *                   example: "d3a9efc29c77f33d20f5bc2d7d097a3dc51f9b13f7c3c2740d70c2ec91d5286c"
 *       401:
 *         description: Token invalide ou manquant
 *       403:
 *         description: Accès refusé (superuser uniquement)
 *       500:
 *         description: Erreur serveur
 */
router.post('/generate', verifyToken, checkSuperUser, async (req, res) => {
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
