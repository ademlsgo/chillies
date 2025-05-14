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
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  identifiant: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [8, 100]
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'superuser'),
    defaultValue: 'user',
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;
