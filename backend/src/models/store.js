const { DataTypes, Model } = require('sequelize');

class Store extends Model {
  static initModel(sequelize) {
    Store.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: { isEmail: true }
      },
      address: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      }
    }, {
      sequelize,
      modelName: 'Store',
      tableName: 'stores'
    });

    return Store;
  }
}

module.exports = Store;
