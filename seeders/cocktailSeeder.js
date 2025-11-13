const { Cocktail } = require('../models/cocktail');

const seedCocktails = async () => {
    try {
        // Vérifier si des cocktails existent déjà
        const count = await Cocktail.count();
        if (count > 0) {
            console.log('Des cocktails existent déjà dans la base de données. Skipping seeding.');
            return;
        }

        // Données de test
        const cocktails = [
            {
                name: 'Mojito',
                description: 'Rhum, menthe fraîche, citron vert, sucre de canne, eau gazeuse',
                price: 8.50,
                category: 'Cocktails classiques',
                image: 'https://example.com/mojito.jpg',
                isAvailable: true,
                ingredients: ['Rhum blanc', 'Menthe fraîche', 'Citron vert', 'Sucre de canne', 'Eau gazeuse'],
                instructions: 'Mélanger le sucre et le citron, ajouter la menthe, écraser légèrement, ajouter le rhum et l\'eau gazeuse.',
                origin: 'Cuba',
                status: 'Disponible'
            },
            {
                name: 'Piña Colada',
                description: 'Rhum blanc, lait de coco, jus d\'ananas',
                price: 9.00,
                category: 'Cocktails tropicaux',
                image: 'https://example.com/pina-colada.jpg',
                isAvailable: true,
                ingredients: ['Rhum blanc', 'Lait de coco', 'Jus d\'ananas'],
                instructions: 'Mélanger tous les ingrédients avec de la glace pilée.',
                origin: 'Porto Rico',
                status: 'Disponible'
            },
            {
                name: 'Margarita',
                description: 'Tequila, triple sec, jus de citron vert, sel',
                price: 8.00,
                category: 'Cocktails classiques',
                image: 'https://example.com/margarita.jpg',
                isAvailable: true,
                ingredients: ['Tequila', 'Triple sec', 'Jus de citron vert', 'Sel'],
                instructions: 'Rincer le verre avec du citron et du sel, mélanger les ingrédients avec de la glace.',
                origin: 'Mexique',
                status: 'Disponible'
            },
            {
                name: 'Daiquiri',
                description: 'Rhum blanc, jus de citron vert, sucre',
                price: 7.50,
                category: 'Cocktails classiques',
                image: 'https://example.com/daiquiri.jpg',
                isAvailable: true,
                ingredients: ['Rhum blanc', 'Jus de citron vert', 'Sucre'],
                instructions: 'Mélanger tous les ingrédients avec de la glace pilée.',
                origin: 'Cuba',
                status: 'Disponible'
            },
            {
                name: 'Virgin Mojito',
                description: 'Menthe fraîche, citron vert, sucre de canne, eau gazeuse',
                price: 6.00,
                category: 'Mocktails',
                image: 'https://example.com/virgin-mojito.jpg',
                isAvailable: true,
                ingredients: ['Menthe fraîche', 'Citron vert', 'Sucre de canne', 'Eau gazeuse'],
                instructions: 'Mélanger le sucre et le citron, ajouter la menthe, écraser légèrement, ajouter l\'eau gazeuse.',
                origin: 'Cuba',
                status: 'Disponible'
            }
        ];

        // Insérer les cocktails
        await Cocktail.bulkCreate(cocktails);
        console.log('Cocktails ajoutés avec succès à la base de données.');
    } catch (error) {
        console.error('Erreur lors de l\'ajout des cocktails:', error);
    }
};

module.exports = { seedCocktails }; 