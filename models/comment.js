/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Comment",
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
      senderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        field: "sender_id"
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "content"
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
      tableName: "comments"
    }
  );
};
