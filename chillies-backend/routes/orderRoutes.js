const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('./authRoutes');

// 🧪 Stockage temporaire en mémoire (à remplacer par une BDD réelle dans un projet final)
let orders = [
    {
        id: 1,
        table_number: 3,
        cocktails: [{ cocktail_id: 1, quantity: 2 }],
        status: 'Pending',
    },
];

// ✅ Obtenir toutes les commandes (admin uniquement)
router.get('/', (req, res) => {
    res.json(orders); // Aucun auth ici pour le moment, tu peux ajouter authenticateJWT si besoin
});

// ✅ Obtenir une commande par ID (admin uniquement)
router.get('/:id', authenticateJWT, (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).json({ message: 'Commande non trouvée.' });
    res.json(order);
});

// ✅ Créer une commande (client – pas besoin d’être authentifié)
router.post('/', (req, res) => {
    const { table_number, cocktails } = req.body;

    if (
        !table_number ||
        !Array.isArray(cocktails) ||
        cocktails.length === 0
    ) {
        return res.status(400).json({ message: 'table_number et cocktails sont requis.' });
    }

    const newOrder = {
        id: orders.length + 1,
        table_number,
        cocktails,
        status: 'Pending',
    };

    orders.push(newOrder);
    console.log('✅ Nouvelle commande reçue :', newOrder);
    res.status(201).json(newOrder);
});

// ✅ Modifier une commande (admin uniquement)
router.put('/:id', authenticateJWT, (req, res) => {
    const { table_number, cocktails, status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));

    if (
        !table_number ||
        !Array.isArray(cocktails) ||
        cocktails.length === 0
    ) {
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

// ✅ Supprimer une commande (admin uniquement)
router.delete('/:id', authenticateJWT, (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    orders.splice(orderIndex, 1);
    res.status(204).send();
});

// ✅ Mise à jour du statut d'une commande (admin uniquement)
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
    console.log(`🔄 Statut commande ${order.id} mis à jour : ${status}`);
    res.json(order);
});

module.exports = router;
