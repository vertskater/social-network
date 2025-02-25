
  const crypto = require("crypto");
  const dbUser = require("../db/user");
  const utils = require("../lib/utils");
  const { body, validationResult } = require("express-validator");
  
  const alphaError = "must have Alphabetical characters.";
  const lengthError = "must have at least 5 and max 30 characters";
  const emailError = "must be of format example@mailserver.at";

  const validateSchema = [
    body("forename")
      .isAlpha()
      .withMessage(`forename ${alphaError}`)
      .isLength({ min: 5, max: 30 })
      .withMessage(`forename ${lengthError}`)
      .trim(),
    body("surname")
      .isAlpha()
      .withMessage(`surname ${alphaError}`)
      .isLength({ min: 5, max: 30 })
      .withMessage(`surname ${lengthError}`)
      .trim(),
    body("email").isEmail().withMessage(`E-Mail ${emailError}`).trim(),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("password must have at least 12 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[W_]).{8,}$/)
      .withMessage(
        "Password must be at least 12 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character"
      ),
    body("pass-confirm")
      .trim()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("passwords do not match!"),
  ];
    const registerUser = [
    validateSchema,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: "user credentials not matching requirements",
          errorInfo: errors,
        });
      }
      const saltHash = utils.genPassword(req.body.password);
      const salt = saltHash.salt;
      const hash = saltHash.hash;
      try {
        const user = await dbUser.postNewUser({
          forename: req.body.forename,
          lastname: req.body.lastname,
          email: req.body.email,
          password: `${hash}.${salt}`,
        });
        if (user) {
          const jwt = utils.issueJwt(user);
          return res
            .status(200)
            .json({ success: true, jwt: jwt.token, expiresIn: jwt.expires });
        }
        res.status(401).json({ success: false });
      } catch (err) {
        next(err);
      }
    },
  ];

  const login = async (req, res, next) => {
    try {
      const user = await dbUser.getUserByEmail(req.body.email);
      if (!user) {
        return res.status(401).json({ success: false, msg: "user not found" });
      }
      const hashSalt = user.password.split(".");
      const verifyPassword = utils.validPassword(
        req.body.password,
        hashSalt[0],
        hashSalt[1]
      );
      if (verifyPassword) {
        const jwt = utils.issueJwt(user);
        return res.status(200).json({
          success: true,
          msg: "jwt token issued, you are logged in",
          token: jwt.token,
          role: user.role,
          expiresIn: jwt.expires,
        });
      }
      res.status(401).json({ success: false, msg: "wrong password" });
    } catch (err) {
      next(err);
    }
  };
  
    module.exports = {
      registerUser,
      login,
    };
  