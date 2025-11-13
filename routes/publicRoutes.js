/**
 * @swagger
 * tags:
 *   name: Public API
 *   description: Endpoints publics protégés par API Key
 */

const express = require('express');
const router = express.Router();
const checkApiKey = require('../middlewares/checkApiKey');
const { Cocktail } = require('../models/Cocktail'); // ⚠️ destructuring correct

/**
 * @swagger
 * /api/v1/public/cocktails:
 *   get:
 *     summary: Récupérer tous les cocktails (API publique via API Key)
 *     tags: [Public API]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Liste des cocktails
 *       401:
 *         description: API Key manquante
 *       403:
 *         description: API Key invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/cocktails', checkApiKey, async (req, res) => {
    try {
        const cocktails = await Cocktail.findAll();
        res.json({ data: cocktails });
    } catch (err) {
        console.error("❌ Error fetching cocktails:", err);
        res.status(500).json({ message: "Error fetching cocktails" });
    }
});

module.exports = router;
