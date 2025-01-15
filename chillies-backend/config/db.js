const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', // Adresse de ton serveur MySQL
    user: 'root', // Ton utilisateur MySQL
    database: 'cocktailbar' // Nom de ta base de données
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err.message);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

module.exports = db;
