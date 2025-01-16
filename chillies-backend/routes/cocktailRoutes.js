const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('./authRoutes');

// Liste de cocktails en exemple
let cocktails = [
    { id: 1, name: 'Mojito', ingredients: ['Rum', 'Mint', 'Sugar', 'Lime'], instructions: 'Mix everything' },
];

// Route pour obtenir tous les cocktails
router.get('/', (req, res) => {
    res.json(cocktails);
});

// Route pour obtenir un cocktail par ID
router.get('/:id', (req, res) => {
    const cocktail = cocktails.find(c => c.id === parseInt(req.params.id));
    if (!cocktail) {
        return res.status(404).json({ message: 'Cocktail non trouvé.' });
    }
    res.json(cocktail);
});

// Route pour créer un cocktail
router.post('/', authenticateJWT, (req, res) => {
    const { name, ingredients, instructions } = req.body;
    const newCocktail = {
        id: cocktails.length + 1,
        name,
        ingredients,
        instructions
    };
    cocktails.push(newCocktail);
    res.status(201).json(newCocktail);
});

// Route pour modifier un cocktail
router.put('/:id', authenticateJWT, (req, res) => {
    const { name, ingredients, instructions } = req.body;
    const cocktailIndex = cocktails.findIndex(c => c.id === parseInt(req.params.id));
    if (cocktailIndex === -1) {
        return res.status(404).json({ message: 'Cocktail non trouvé.' });
    }
    cocktails[cocktailIndex] = { id: parseInt(req.params.id), name, ingredients, instructions };
    res.json(cocktails[cocktailIndex]);
});

// Route pour supprimer un cocktail
router.delete('/:id', authenticateJWT, (req, res) => {
    const cocktailIndex = cocktails.findIndex(c => c.id === parseInt(req.params.id));
    if (cocktailIndex === -1) {
        return res.status(404).json({ message: 'Cocktail non trouvé.' });
    }
    cocktails.splice(cocktailIndex, 1);
    res.status(204).send();
});

module.exports = router;
