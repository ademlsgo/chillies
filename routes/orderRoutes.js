/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes (client + admin)
 */

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('./authRoutes');

// 🧪 Temp: stockage en mémoire (à remplacer par une BDD)
let orders = [
    {
        id: 1,
        table_number: 3,
        cocktails: [{ cocktail_id: 1, quantity: 2 }],
        status: 'Pending',
    },
];

/* ---------------------------------------------------------
   GET - Toutes les commandes (ADMIN)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Récupérer toutes les commandes (ADMIN)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get('/', authenticateJWT, (req, res) => {
    res.json(orders);
});

/* ---------------------------------------------------------
   GET - Une commande par ID (ADMIN)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID (ADMIN)
 *     tags: [Orders]
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
 *         description: Commande trouvée
 *       404:
 *         description: Commande non trouvée
 */
router.get('/:id', authenticateJWT, (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).json({ message: 'Commande non trouvée.' });
    res.json(order);
});

/* ---------------------------------------------------------
   POST - Créer une commande (CLIENT)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Créer une nouvelle commande (Client)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - table_number
 *               - cocktails
 *             properties:
 *               table_number:
 *                 type: integer
 *               cocktails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     cocktail_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Commande créée
 *       400:
 *         description: Mauvais paramètres
 */
router.post('/', (req, res) => {
    const { table_number, cocktails } = req.body;

    if (!table_number || !Array.isArray(cocktails) || cocktails.length === 0) {
        return res.status(400).json({ message: 'table_number et cocktails sont requis.' });
    }

    const newOrder = {
        id: orders.length + 1,
        table_number,
        cocktails,
        status: 'Pending',
    };

    orders.push(newOrder);
    console.log('✅ Nouvelle commande :', newOrder);
    res.status(201).json(newOrder);
});

/* ---------------------------------------------------------
   PUT - Modifier une commande (ADMIN)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Modifier une commande (ADMIN)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_number:
 *                 type: integer
 *               cocktails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     cocktail_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commande modifiée
 *       404:
 *         description: Commande non trouvée
 */
router.put('/:id', authenticateJWT, (req, res) => {
    const { table_number, cocktails, status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));

    if (!table_number || !Array.isArray(cocktails) || cocktails.length === 0) {
        return res.status(400).json({ message: 'table_number et cocktails sont requis.' });
    }

    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    orders[orderIndex] = {
        id: parseInt(req.params.id),
        table_number,
        cocktails,
        status: status || 'Pending',
    };

    res.json(orders[orderIndex]);
});

/* ---------------------------------------------------------
   DELETE - Supprimer commande (ADMIN)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Supprimer une commande (ADMIN)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Commande supprimée
 *       404:
 *         description: Non trouvée
 */
router.delete('/:id', authenticateJWT, (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    orders.splice(orderIndex, 1);
    res.status(204).send();
});

/* ---------------------------------------------------------
   PATCH - Modifier le statut (ADMIN)
--------------------------------------------------------- */
/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande (ADMIN)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nouveau statut (Pending, Preparing, Done, Delivered...)
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       404:
 *         description: Commande non trouvée
 *       400:
 *         description: Champ status requis
 */
router.patch('/:id/status', authenticateJWT, (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === parseInt(req.params.id));

    if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    if (!status) {
        return res.status(400).json({ message: 'Le champ status est requis.' });
    }

    order.status = status;
    console.log(`🔄 Statut commande ${order.id} → ${status}`);
    res.json(order);
});

module.exports = router;
