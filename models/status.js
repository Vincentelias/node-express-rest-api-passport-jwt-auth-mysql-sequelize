/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Status",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "status"
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "description"
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
      tableName: "statuses"
    }
  );
};
