var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const productController = require("../controllers/productController");
const commentController = require("../controllers/commentController.js");
const actionController = require("../controllers/actionController");
const passport = require("passport");
const jwtStrategry = require("../strategies/jwt");
passport.use(jwtStrategry);

router.post("/api/register", function(req, res) {
  userController.addUser(req, res);
});

router.post("/login", function(req, res) {
  userController.authenticate(req, res);
});

router.get(
  "/api/orders",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    orderController.getOrders(req, res);
  }
);

router.get(
  "/api/orders/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    orderController.getOrder(req, res);
  }
);

router.get(
  "/api/orders/:id/products",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    productController.getProducts(req, res);
  }
);

router.delete(
  "/api/orders/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    orderController.deleteOrder(req, res);
  }
);

router.get(
  "/api/orders/:id/comments",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    commentController.getComments(req, res);
  }
);

router.post(
  "/api/orders/:id/comments",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    commentController.addComment(req, res);
  }
);

router.put(
  "/api/orders/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    orderController.updateOrder(req, res);
  }
);

router.get(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    userController.getUsers(req, res);
  }
);

router.delete(
  "/api/users/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    userController.deleteUser(req, res);
  }
);

router.put(
  "/api/users/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    userController.updateUser(req, res);
  }
);

router.get(
  "/api/actions",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    actionController.getActions(req, res);
  }
);

router.use(function(err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
