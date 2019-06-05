/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Order_product",
    {
      orderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "orders",
          key: "id"
        },
        field: "order_id"
      },
      productId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "products",
          key: "id"
        },
        field: "product_id"
      },
      amount: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "1",
        field: "amount"
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
      tableName: "order_products"
    }
  );
};
