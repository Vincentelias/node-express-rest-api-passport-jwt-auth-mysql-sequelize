const models = require("../models");
const Order = models.order;
const User = models.User;
const Status = models.status;
const Order_product = models.order_product;
const actionController = require("../controllers/actionController");

exports.getOrders = async function(req, res) {
  try {
    let orders = await Order.findAll({
      where: { visible: 1 },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Status,
          attributes: ["status"]
        }
      ],
      attributes: ["id", "created_at"]
    });

    if (orders) {
      return res.send(orders);
    }

    throw new Error("Something went wrong");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.getOrder = async function(req, res) {
  try {
    let orderId = req.params.id;

    let order = await Order.findOne({
      where: { id: orderId, visible: 1 },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Status,
          attributes: ["status"]
        },
        {
          model: User,
          attributes: ["id", "name"]
        }
      ],
      attributes: ["id", "created_at", "updated_at"]
    });

    let totals = await models.sequelize.query(
      "select order_id ,sum(price*amount) as total from order_products join products on order_products.product_id = products.id group by order_id",

      {
        model: Order_product,
        mapToModel: true
      }
    );

    let total = totals.filter(total => total.orderId == orderId)[0];

    //convert to json
    order = order.get({ plain: true });
    order.total = total.get({
      plain: true
    }).total;

    if (order) {
      return res.send(order);
    }

    throw new Error("Something went wrong");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.updateOrder = async function(req, res) {
  try {
    let orderId = req.params.id;
    let userId = req.user.id;
    let statusId = req.body.status;
    let name = req.user.name;

    let order = await Order.findOne({
      where: {
        id: orderId
      }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (!statusId) {
      throw new Error("No status given");
    }

    let affectedRows = await Order.update(
      { statusId: statusId },
      {
        where: {
          id: orderId
        }
      }
    );

    let updatedOrder = await Order.findOne({
      where: {
        id: orderId
      },
      include: [
        {
          model: Status,
          attributes: ["status"]
        }
      ]
    });

    if (!updatedOrder) {
      throw new Error("No updated needed");
    }
    let actionString = `${name} changed the status of order ${orderId} to ${
      updatedOrder.Status.status
    }`;

    let action = await actionController.addAction(
      userId,
      orderId,
      actionString
    );

    if (action) {
      return res.send("order updated");
    }

    throw new Error("Something went wrong");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.deleteOrder = async function(req, res) {
  try {
    let orderId = req.params.id;
    let userId = req.user.id;
    let name = req.user.name;
    let order = await Order.findOne({
      where: {
        id: orderId
      }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    let affectedRows = await Order.update(
      { visible: 0 },
      {
        where: {
          id: orderId
        }
      }
    );

    if (affectedRows == 0) {
      throw new Error("Somethign went wrong");
    }

    let actionString = `${name} deleted order ${orderId}`;

    let action = await actionController.addAction(
      userId,
      orderId,
      actionString
    );

    if (!action) {
      throw new Error("Unable to add action");
    }

    return res.send("order deleted");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};
