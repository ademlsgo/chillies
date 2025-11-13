/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (superuser uniquement)
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { verifyToken, isSuperuser } = require('../middleware/auth');

/* ---------------------------------------------------------
   GET /users — Tous les users (superuser)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Récupère tous les utilisateurs (superuser uniquement)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Token invalide ou manquant
 *       403:
 *         description: Accès refusé (superuser requis)
 */
router.get('/', verifyToken, isSuperuser, userController.getAllUsers);

/* ---------------------------------------------------------
   GET /users/{id} — 1 user par ID
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID (superuser uniquement)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', verifyToken, isSuperuser, userController.getUserById);

/* ---------------------------------------------------------
   POST /users — Créer user
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Crée un utilisateur (superuser uniquement)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, employee, superuser]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Requête invalide
 */
router.post('/', verifyToken, isSuperuser, userController.createUser);

/* ---------------------------------------------------------
   PUT /users/{id} — MAJ user
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur (superuser uniquement)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, employee, superuser]
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Non trouvé
 */
router.put('/:id', verifyToken, isSuperuser, userController.updateUser);

/* ---------------------------------------------------------
   DELETE /users/{id} — Supprimer user
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur (superuser uniquement)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Suppression réussie
 *       404:
 *         description: Non trouvé
 */
router.delete('/:id', verifyToken, isSuperuser, userController.deleteUser);

module.exports = router;
