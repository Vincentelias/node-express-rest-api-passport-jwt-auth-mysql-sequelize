/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      customerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        field: "customer_id"
      },
      statusId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "statuses",
          key: "id"
        },
        field: "status_id"
      },
      visible: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "1",
        field: "visible"
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
      tableName: "orders"
    }
  );
};
