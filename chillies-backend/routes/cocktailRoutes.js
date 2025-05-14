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

// Liste de cocktails en exemple
let cocktails = [
    { id: 1, name: 'Mojito', ingredients: ['Rum', 'Mint', 'Sugar', 'Lime'], instructions: 'Mix everything' },
];

// Route GET pour récupérer tous les cocktails
router.get('/cocktails', getAllCocktails);

// Route pour obtenir un cocktail par ID
router.get('/cocktails/:id', getCocktailById);

// Route pour créer un cocktail
router.post('/cocktails', authenticateJWT, createCocktail);

// Route pour modifier un cocktail
router.put('/cocktails/:id', authenticateJWT, updateCocktail);

// Route pour supprimer un cocktail
router.delete('/cocktails/:id', authenticateJWT, deleteCocktail);

module.exports = router;
