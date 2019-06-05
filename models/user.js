/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "name"
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "invalid email"
          }
        },

        unique: {
          args: true,
          msg: "Email address already in use!"
        },

        field: "email"
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "email_verified_at"
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "password"
      },
      role: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "user",
        field: "role"
      },
      rememberToken: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "remember_token"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "updated_at"
      }
    },
    {
      tableName: "users"
    }
  );
};
