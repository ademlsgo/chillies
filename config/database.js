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

// Fonction pour initialiser la base de données avec retry pour les deadlocks
async function initializeDatabase() {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            // Test de la connexion
            await sequelize.authenticate();
            console.log('Connection à la base de données réussie.');

            // Configuration du jeu de caractères
            try {
                await sequelize.query("ALTER DATABASE `" + dbConfig.database + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            } catch (dbError) {
                // Ignorer l'erreur si la base de données existe déjà avec le bon encodage
                if (dbError.original && dbError.original.code !== 'ER_DB_CREATE_EXISTS') {
                    console.warn('Avertissement lors de la configuration de la base de données:', dbError.message);
                }
            }

            // Synchronisation des modèles avec la base de données
            await sequelize.sync({ alter: true });
            console.log('Base de données synchronisée avec succès.');
            return; // Succès, sortir de la boucle

        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la base de données:', error.message);
            
            // Gérer spécifiquement les deadlocks
            if (error.original && error.original.code === 'ER_LOCK_DEADLOCK') {
                retryCount++;
                if (retryCount < maxRetries) {
                    const waitTime = retryCount * 1000; // Attendre 1s, 2s, 3s...
                    console.warn(`Deadlock détecté. Nouvelle tentative ${retryCount}/${maxRetries} dans ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue; // Réessayer
                } else {
                    console.error('Erreur: Deadlock persistant après', maxRetries, 'tentatives.');
                    // Essayer une synchronisation sans alter en dernier recours
                    try {
                        console.log('Tentative de synchronisation sans modification de structure...');
                        await sequelize.sync({ alter: false });
                        console.log('Base de données synchronisée (sans modification de structure).');
                        return;
                    } catch (syncError) {
                        console.error('Erreur lors de la synchronisation sans alter:', syncError);
                        throw error; // Lancer l'erreur originale
                    }
                }
            }
            
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
                    return;
                } catch (createError) {
                    console.error('Erreur lors de la création de la base de données:', createError);
                    throw createError;
                }
            } 
            
            // Si l'erreur est due à une clé trop longue
            if (error.original && error.original.code === 'ER_TOO_LONG_KEY') {
                console.error('Erreur de clé trop longue. Tentative de correction...');
                try {
                    // Modification de la table pour supporter les clés plus longues
                    await sequelize.query("ALTER TABLE `cocktails` ROW_FORMAT=DYNAMIC;");
                    // Réessayer la synchronisation
                    await sequelize.sync({ alter: true });
                    console.log('Base de données synchronisée avec succès après correction.');
                    return;
                } catch (fixError) {
                    console.error('Erreur lors de la correction de la table:', fixError);
                    throw fixError;
                }
            }
            
            // Pour les autres erreurs, réessayer une fois de plus ou lancer l'erreur
            retryCount++;
            if (retryCount >= maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Si on arrive ici, toutes les tentatives ont échoué
    throw new Error('Impossible de synchroniser la base de données après plusieurs tentatives.');
}

// Exécution de l'initialisation
initializeDatabase().catch(error => {
    console.error('Erreur fatale lors de l\'initialisation de la base de données:', error);
    process.exit(1);
});

module.exports = sequelize;
