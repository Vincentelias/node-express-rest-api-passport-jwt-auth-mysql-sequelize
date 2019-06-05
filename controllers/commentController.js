const models = require("../models");
const Comment = models.comment;
const User = models.User;

exports.getComments = async function(req, res) {
  try {
    let orderId = req.params.id;

    let comments = await Comment.findAll({
      order: [["created_at", "DESC"]],
      where: { order_id: orderId },
      include: {
        model: User,
        attributes: ["name"]
      },
      attributes: ["id", "content", "created_at"]
    });

    if (comments) {
      return res.send(comments);
    }

    throw new Error("Something went wrong");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.addComment = async function(req, res) {
  let body = req.body;

  try {
    let comment = await Comment.create({
      orderId: req.params.id,
      senderId: req.user.id,
      content: body.content
    });

    if (!comment) {
      throw new Error("something went wrong");
    }

    return res.send(comment);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};
