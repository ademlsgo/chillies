const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la base de données
const dbConfig = {
    database: process.env.DB_NAME || 'cocktailbar',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4'
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// Création de l'instance Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
    dialectOptions: dbConfig.dialectOptions,
    define: dbConfig.define,
    pool: dbConfig.pool
});

// Fonction pour initialiser la base de données
async function initializeDatabase() {
    try {
        // Test de la connexion
        await sequelize.authenticate();
        console.log('Connection à la base de données réussie.');

        // Configuration du jeu de caractères
        await sequelize.query("ALTER DATABASE `" + dbConfig.database + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        // Synchronisation des modèles avec la base de données
        await sequelize.sync({ alter: true });
        console.log('Base de données synchronisée avec succès.');

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        // Si l'erreur est due à la base de données qui n'existe pas
        if (error.original && error.original.code === 'ER_BAD_DB_ERROR') {
            console.log('Tentative de création de la base de données...');
            // Création d'une connexion temporaire sans spécifier de base de données
            const tempSequelize = new Sequelize('', dbConfig.username, dbConfig.password, {
                host: dbConfig.host,
                dialect: dbConfig.dialect,
                dialectOptions: dbConfig.dialectOptions
            });
            
            try {
                // Création de la base de données avec le bon encodage
                await tempSequelize.query(
                    `CREATE DATABASE IF NOT EXISTS ${dbConfig.database} 
                     CHARACTER SET utf8mb4 
                     COLLATE utf8mb4_unicode_ci;`
                );
                console.log(`Base de données ${dbConfig.database} créée avec succès.`);
                
                // Fermeture de la connexion temporaire
                await tempSequelize.close();
                
                // Réessayer la synchronisation
                await sequelize.sync({ alter: true });
                console.log('Base de données synchronisée avec succès.');
            } catch (createError) {
                console.error('Erreur lors de la création de la base de données:', createError);
                throw createError;
            }
        } else if (error.original && error.original.code === 'ER_TOO_LONG_KEY') {
            console.error('Erreur de clé trop longue. Tentative de correction...');
            try {
                // Modification de la table pour supporter les clés plus longues
                await sequelize.query("ALTER TABLE `cocktails` ROW_FORMAT=DYNAMIC;");
                // Réessayer la synchronisation
                await sequelize.sync({ alter: true });
                console.log('Base de données synchronisée avec succès après correction.');
            } catch (fixError) {
                console.error('Erreur lors de la correction de la table:', fixError);
                throw fixError;
            }
        } else {
            throw error;
        }
    }
}

// Exécution de l'initialisation
initializeDatabase();

module.exports = sequelize;
