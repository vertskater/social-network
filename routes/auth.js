
  const auth = require("express").Router();
  const passport = require("passport");
  const { isUser, isAdmin } = require("../middleware/authRoles");

  const usersController = require("../middleware/users");

  auth.post("/register", usersController.registerUser);

  auth.post("/login", usersController.login);

  module.exports = auth;
  