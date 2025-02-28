
    const crypto = require("crypto");
    const jsonwebtoken = require("jsonwebtoken");

    const PRIV_KEY = process.env.PRIVATE_KEY_JWT;
    
    const genPassword = (password) => {
      const salt = crypto.randomBytes(32).toString("hex");
      const genHash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "SHA512")
        .toString("hex");
      return {
        salt: salt,
        hash: genHash,
      };
    };
    function validPassword(password, hash, salt) {
      const hashVerify = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
      return hash === hashVerify;
    }
    function hashApiKey(key) {
      return crypto.createHash("sha256").update(key).digest("hex");
    }
    
    const issueJwt = (user) => {
      const _id = user.id;
      const expiresIn = "1d";
      const payload = {
        sub: _id,
        iat: Date.now(),
      };
    
      const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: "RS256",
      });
    
      return {
        token: "Bearer " + signedToken,
        expires: expiresIn,
      };
    };
    module.exports = {
      issueJwt,
      validPassword,
      genPassword
    }
  