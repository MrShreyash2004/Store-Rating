const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

// initialize models
const models = {
  User: User.initModel(sequelize),
  Store: Store.initModel(sequelize),
  Rating: Rating.initModel(sequelize),
};

// Associations
models.User.hasMany(models.Rating, { foreignKey: 'userId', as: 'ratings' });
models.Rating.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

models.Store.hasMany(models.Rating, { foreignKey: 'storeId', as: 'ratings' });
models.Rating.belongsTo(models.Store, { foreignKey: 'storeId', as: 'store' });

models.User.hasMany(models.Store, { foreignKey: 'ownerId', as: 'ownedStores' });
models.Store.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
