const { DataTypes, Model } = require('sequelize');

class Rating extends Model {
  static initModel(sequelize) {
    Rating.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      storeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      score: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      }
    }, {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      indexes: [
        { fields: ['store_id'] },
        { fields: ['user_id'] }
      ],
      uniqueKeys: {
        unique_user_store: {
          fields: ['userId','storeId']
        }
      }
    });

    return Rating;
  }
}

module.exports = Rating;
