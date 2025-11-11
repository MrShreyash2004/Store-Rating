const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static initModel(sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          len: [20, 60]
        }
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('admin','user','owner'),
        allowNull: false,
        defaultValue: 'user'
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users'
    });

    // password virtual setter
    User.prototype.setPassword = async function(password) {
      const salt = await bcrypt.genSalt(10);
      this.password_hash = await bcrypt.hash(password, salt);
    };

    User.prototype.validatePassword = async function(password) {
      return bcrypt.compare(password, this.password_hash);
    };

    return User;
  }
}

module.exports = User;
