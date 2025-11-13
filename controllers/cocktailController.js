const { Cocktail } = require('../models/cocktail');
const { Op } = require('sequelize');

// Get all cocktails
const getAllCocktails = async (req, res) => {
    try {
        console.log('Tentative de récupération de tous les cocktails...');
        const cocktails = await Cocktail.findAll({
            order: [['createdAt', 'DESC']]
        });
        console.log(`${cocktails.length} cocktails trouvés`);
        res.json(cocktails);
    } catch (error) {
        console.error('Erreur lors de la récupération des cocktails:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des cocktails',
            error: error.message
        });
    }
};

// Get a single cocktail by ID
const getCocktailById = async (req, res) => {
    try {
        console.log(`Recherche du cocktail avec l'ID: ${req.params.id}`);
        const cocktail = await Cocktail.findByPk(req.params.id);
        
        if (!cocktail) {
            console.log(`Cocktail avec l'ID ${req.params.id} non trouvé`);
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }
        
        console.log(`Cocktail trouvé: ${cocktail.name}`);
        res.json(cocktail);
    } catch (error) {
        console.error('Erreur lors de la récupération du cocktail:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération du cocktail',
            error: error.message
        });
    }
};

// Create a new cocktail
const createCocktail = async (req, res) => {
    try {
        console.log('Tentative de création d\'un nouveau cocktail:', req.body);
        const cocktail = await Cocktail.create(req.body);
        console.log('Nouveau cocktail créé avec succès:', cocktail.id);
        res.status(201).json(cocktail);
    } catch (error) {
        console.error('Erreur lors de la création du cocktail:', error);
        res.status(400).json({
            message: 'Erreur lors de la création du cocktail',
            error: error.message
        });
    }
};

// Update a cocktail
const updateCocktail = async (req, res) => {
    try {
        console.log(`Tentative de mise à jour du cocktail ${req.params.id}:`, req.body);
        const [updated] = await Cocktail.update(req.body, {
            where: { id: req.params.id }
        });
        
        if (updated === 0) {
            console.log(`Cocktail avec l'ID ${req.params.id} non trouvé pour la mise à jour`);
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }
        
        const updatedCocktail = await Cocktail.findByPk(req.params.id);
        console.log('Cocktail mis à jour avec succès:', updatedCocktail.id);
        res.json(updatedCocktail);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du cocktail:', error);
        res.status(400).json({
            message: 'Erreur lors de la mise à jour du cocktail',
            error: error.message
        });
    }
};

// Delete a cocktail
const deleteCocktail = async (req, res) => {
    try {
        console.log(`Tentative de suppression du cocktail ${req.params.id}`);
        const deleted = await Cocktail.destroy({
            where: { id: req.params.id }
        });
        
        if (deleted === 0) {
            console.log(`Cocktail avec l'ID ${req.params.id} non trouvé pour la suppression`);
            return res.status(404).json({ message: 'Cocktail non trouvé' });
        }
        
        console.log(`Cocktail ${req.params.id} supprimé avec succès`);
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression du cocktail:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression du cocktail',
            error: error.message
        });
    }
};

module.exports = {
    getAllCocktails,
    getCocktailById,
    createCocktail,
    updateCocktail,
    deleteCocktail
};
