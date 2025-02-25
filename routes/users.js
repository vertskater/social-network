
  const users = require("express").Router();
  const passport = require("passport");
  const { isUser, isAdmin } = require("../middleware/auth");

  const usersController = require("../middleware/users");

  users.post("/register", usersController.registerUser);

  users.post("/login", usersController.login);

  module.exports = users;
  