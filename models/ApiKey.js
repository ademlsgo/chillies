const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ApiKey = sequelize.define('ApiKey', {
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Relations
User.hasMany(ApiKey, { foreignKey: 'userId', onDelete: 'CASCADE' });
ApiKey.belongsTo(User, { foreignKey: 'userId' });

module.exports = ApiKey;
