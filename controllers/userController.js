const models = require("../models");
const User = models.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");
const availableUserRoles = require("../config/userRolesConfig");

exports.addUser = async function(req, res) {
  let body = req.body;

  try {
    if (body.password !== body.confirm_password) {
      throw new Error("passwords do not match");
    }

    if (body.password.length < 4 || body.password.length > 20) {
      throw new Error("password must be between 4 and 20 characters long");
    }

    let hash = await bcrypt.hash(body.password, 10);

    let user = await User.create({
      name: body.name,
      email: body.email,
      password: hash,
      role: "employee"
    });

    if (!user) {
      throw new Error("something went wrong");
    }

    exports.authenticate(req, res);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.authenticate = async function authenticate(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email or password is missing");
  }

  try {
    const dbUser = await User.findOne({ where: { email } });
    let correctCredentials = await bcrypt.compare(password, dbUser.password);

    if (correctCredentials) {
      if (dbUser.role === "user") {
        throw new Error("User is not authorized to login");
      }

      return res.send({
        data: jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name
          },
          jwtConfig.secretOrKey
        )
      });
    }

    throw new Error("invalid password");
  } catch (e) {
    console.log(e.message);
    return res.status(400).send({ error: "Wrong email or password entered" });
  }
};

exports.isAdmin = async function(userId) {
  return await User.findOne({
    where: {
      id: userId,
      role: "administrator"
    }
  });
};

exports.getUsers = async function(req, res) {
  try {
    let isAdmin = await exports.isAdmin(req.user.id);

    if (!isAdmin) {
      return res.status(401).send("Unauthorized");
    }

    let users = await User.findAll({
      attributes: ["id", "name", "email", "created_at", "updated_at", "role"]
    });

    if (users) {
      return res.send(users);
    }

    throw new Error("Something went wrong");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.deleteUser = async function(req, res) {
  try {
    let isAdmin = await exports.isAdmin(req.user.id);
    let userId = req.params.id;

    if (!isAdmin) {
      return res.status(401).send("Unauthorized");
    }

    let user = await User.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "administrator") {
      throw new Error("Unable to delete administrator account");
    }

    User.destroy({
      where: {
        id: userId
      }
    });

    return res.send("user deleted");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.updateUser = async function(req, res) {
  try {
    let isAdmin = await exports.isAdmin(req.user.id);
    let userId = req.params.id;
    let role = req.body.role;

    if (!availableUserRoles.roles.includes(role)) {
      throw new Error("Invalid user role");
    }

    if (!isAdmin) {
      return res.status(401).send("Unauthorized");
    }

    let user = await User.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!userId) {
      throw new Error("No user id given");
    }

    let affectedRows = await User.update(
      { role: role },
      {
        where: {
          id: userId
        }
      }
    );

    let updatedUser = await User.findOne({
      where: {
        id: userId
      }
    });

    if (updatedUser.role === user.role) {
      throw new Error("No updated needed");
    }

    return res.send("user updated");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};
