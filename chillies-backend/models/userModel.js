const db = require('../config/db'); // On gère la connexion à la DB

exports.findByUsername = async (username) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Error fetching user');
    }
};
