/**
 * @swagger
 * tags:
 *   name: Cocktails
 *   description: Gestion des cocktails (CRUD)
 */

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('./authRoutes');

const {
    getAllCocktails,
    getCocktailById,
    createCocktail,
    updateCocktail,
    deleteCocktail
} = require('../controllers/cocktailController');

/* ---------------------------------------------------------
   GET - TOUS LES COCKTAILS
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/cocktails:
 *   get:
 *     summary: Récupérer tous les cocktails
 *     tags: [Cocktails]
 *     responses:
 *       200:
 *         description: Liste des cocktails
 */
router.get('/', getAllCocktails);

/* ---------------------------------------------------------
   GET - UN COCKTAIL PAR ID
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/cocktails/{id}:
 *   get:
 *     summary: Récupérer un cocktail par ID
 *     tags: [Cocktails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cocktail
 *     responses:
 *       200:
 *         description: Cocktail trouvé
 *       404:
 *         description: Cocktail non trouvé
 */
router.get('/:id', getCocktailById);

/* ---------------------------------------------------------
   POST - CRÉER UN COCKTAIL (admin JWT)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/cocktails:
 *   post:
 *     summary: Créer un nouveau cocktail
 *     tags: [Cocktails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Cocktail créé
 *       400:
 *         description: Champs invalides
 *       401:
 *         description: Non autorisé (Token manquant)
 */
router.post('/', authenticateJWT, createCocktail);

/* ---------------------------------------------------------
   PUT - MODIFIER COCKTAIL (admin JWT)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/cocktails/{id}:
 *   put:
 *     summary: Modifier un cocktail existant
 *     tags: [Cocktails]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cocktail mis à jour
 *       404:
 *         description: Cocktail non trouvé
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', authenticateJWT, updateCocktail);

/* ---------------------------------------------------------
   DELETE - SUPPRIMER COCKTAIL (admin JWT)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/cocktails/{id}:
 *   delete:
 *     summary: Supprimer un cocktail
 *     tags: [Cocktails]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cocktail supprimé
 *       404:
 *         description: Cocktail non trouvé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', authenticateJWT, deleteCocktail);

module.exports = router;
