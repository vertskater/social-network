
  const indexRouter = require("express").Router();
  const users = require("./users");

  indexRouter.use("/users", users);

  module.exports = indexRouter;
  