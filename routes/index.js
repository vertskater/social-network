
  const indexRouter = require("express").Router();
  const auth = require("./auth");

  indexRouter.use("/auth", auth);

  module.exports = indexRouter;
  