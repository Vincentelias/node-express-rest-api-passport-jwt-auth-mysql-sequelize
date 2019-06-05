/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Action",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      orderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "orders",
          key: "id"
        },
        field: "order_id"
      },
      employeeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        field: "employee_id"
      },
      action: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "action"
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
      tableName: "actions"
    }
  );
};
