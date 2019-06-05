const models = require("../models");

exports.getProducts = async function(req, res) {
  try {
    let orderId = req.params.id;

    let products = await models.sequelize.query(
      "select products.*,amount, (amount*price) as total from order_products join products on products.id = order_products.product_id where order_id = :orderId",
      {
        replacements: { orderId: orderId },
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    if (products) {
      return res.send(products);
    }

    throw new Error("Something went wrong");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};
