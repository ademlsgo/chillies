const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('./authRoutes');

// Liste de commandes en exemple
let orders = [
    { id: 1, cocktailId: 1, quantity: 2, status: 'Pending' },
];

// Route pour obtenir toutes les commandes
router.get('/', (req, res) => {
    res.json(orders);
});

// Route pour obtenir une commande par ID
router.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    res.json(order);
});

// Route pour créer une commande
router.post('/', authenticateJWT, (req, res) => {
    const { cocktailId, quantity, status } = req.body;
    const newOrder = {
        id: orders.length + 1,
        cocktailId,
        quantity,
        status: status || 'Pending',
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// Route pour modifier une commande
router.put('/:id', authenticateJWT, (req, res) => {
    const { cocktailId, quantity, status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    orders[orderIndex] = { id: parseInt(req.params.id), cocktailId, quantity, status };
    res.json(orders[orderIndex]);
});

// Route pour supprimer une commande
router.delete('/:id', authenticateJWT, (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    orders.splice(orderIndex, 1);
    res.status(204).send();
});

module.exports = router;
