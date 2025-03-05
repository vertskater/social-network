
  const indexRouter = require("express").Router();
  const auth = require("./auth");
  const profile = require('./profile');

  indexRouter.use("/auth", auth);
  indexRouter.use('/profile', profile);


  module.exports = indexRouter;
  