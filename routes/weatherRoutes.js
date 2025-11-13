/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Récupération de la météo via l'API OpenWeather
 */

const express = require('express');
const router = express.Router();
const { getWeatherByCity } = require('../services/weatherService');

/**
 * @swagger
 * /api/v1/weather/{city}:
 *   get:
 *     summary: Obtenir la météo d'une ville
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         description: Nom de la ville (ex: Marseille)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Données météo récupérées avec succès
 *       404:
 *         description: Ville introuvable ou erreur API
 *       500:
 *         description: Erreur serveur
 */
router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const weather = await getWeatherByCity(city);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
