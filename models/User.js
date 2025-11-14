const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    identifiant: {
        type: DataTypes.STRING(50),
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    googleId: {
        field: 'google_id',   // IMPORTANT pour mapper google_id
        type: DataTypes.STRING(255),
        unique: true
    },
    role: {
        type: DataTypes.ENUM('user', 'superuser', 'employee'),
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    underscored: true,     // <-- LA LIGNE QUI FIXE TOUT
    timestamps: true
});

module.exports = User;
