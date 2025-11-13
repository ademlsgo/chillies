const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cocktail = sequelize.define('Cocktail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Le nom du cocktail ne peut pas être vide'
            },
            len: {
                args: [2, 100],
                msg: 'Le nom du cocktail doit contenir entre 2 et 100 caractères'
            }
        }
    },
    image: {
        type: DataTypes.STRING,
        validate: {
            isUrl: {
                msg: 'L\'URL de l\'image doit être valide'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        validate: {
            len: {
                args: [0, 1000],
                msg: 'La description ne peut pas dépasser 1000 caractères'
            }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: {
                msg: 'Le prix doit être un nombre décimal'
            },
            min: {
                args: [0],
                msg: 'Le prix ne peut pas être négatif'
            }
        }
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: {
                args: [['Cocktail', 'Mocktail', 'Shot', 'Long Drink', 'Autre']],
                msg: 'La catégorie doit être valide'
            }
        }
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    ingredients: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('ingredients');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            if (!Array.isArray(value)) {
                throw new Error('Les ingrédients doivent être un tableau');
            }
            this.setDataValue('ingredients', JSON.stringify(value));
        },
        validate: {
            isValidIngredients(value) {
                if (!Array.isArray(JSON.parse(value))) {
                    throw new Error('Les ingrédients doivent être un tableau');
                }
            }
        }
    },
    instructions: {
        type: DataTypes.TEXT,
        validate: {
            len: {
                args: [0, 2000],
                msg: 'Les instructions ne peuvent pas dépasser 2000 caractères'
            }
        }
    },
    origin: {
        type: DataTypes.STRING(100),
        validate: {
            len: {
                args: [0, 100],
                msg: 'L\'origine ne peut pas dépasser 100 caractères'
            }
        }
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active',
        validate: {
            isIn: {
                args: [['active', 'inactive', 'deleted']],
                msg: 'Le statut doit être valide'
            }
        }
    }
}, {
    tableName: 'cocktails',
    timestamps: true,
    engine: 'InnoDB',
    rowFormat: 'DYNAMIC',
    hooks: {
        beforeValidate: (cocktail) => {
            // Convertir le nom en minuscules et capitaliser la première lettre
            if (cocktail.name) {
                cocktail.name = cocktail.name.toLowerCase().replace(/^\w/, c => c.toUpperCase());
            }
            
            // S'assurer que les ingrédients sont un tableau
            if (cocktail.ingredients && typeof cocktail.ingredients === 'string') {
                try {
                    JSON.parse(cocktail.ingredients);
                } catch (e) {
                    throw new Error('Format des ingrédients invalide');
                }
            }
        },
        beforeCreate: (cocktail) => {
            console.log(`Création d'un nouveau cocktail: ${cocktail.name}`);
        },
        afterCreate: (cocktail) => {
            console.log(`Cocktail créé avec succès: ${cocktail.name} (ID: ${cocktail.id})`);
        },
        beforeUpdate: (cocktail) => {
            console.log(`Mise à jour du cocktail: ${cocktail.name} (ID: ${cocktail.id})`);
        },
        afterUpdate: (cocktail) => {
            console.log(`Cocktail mis à jour avec succès: ${cocktail.name} (ID: ${cocktail.id})`);
        },
        beforeDestroy: (cocktail) => {
            console.log(`Suppression du cocktail: ${cocktail.name} (ID: ${cocktail.id})`);
        },
        afterDestroy: (cocktail) => {
            console.log(`Cocktail supprimé avec succès: ${cocktail.name} (ID: ${cocktail.id})`);
        }
    }
});

module.exports = { Cocktail };
