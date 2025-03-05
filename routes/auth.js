const auth = require("express").Router();
const passport = require("passport");

const usersController = require("../middleware/users");

auth.post("/register", usersController.registerUser);
auth.post("/login", usersController.login);

auth.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
auth.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }), usersController.loginWithGithub);

module.exports = auth;