const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const jsonwebtoken = require("jsonwebtoken");
const {supabaseAuthWithPassword} = require('../config/supabase');
const supabaseDb = require('../db/supabase/supabaseProfileImg');
const dbImage = require('../db/image')

const PRIV_KEY = fs.readFileSync(path.join(__dirname, '../id_rsa_priv.pem'), 'utf8');//process.env.PRIVATE_KEY_JWT;

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
    role: user.role,
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

const supabaseProfileImgUpload = async (filePath, file, profileId, imageExists) => {
  const token = await supabaseAuthWithPassword();
  const upload = await supabaseDb.saveProfileImageToSupabase(
    String(process.env.SUPABASE_PROFILEIMG_BUCKET),
    filePath,
    file,
    token
  )
  const data = await supabaseDb.getPublicUrlToProfileImage(process.env.SUPABASE_PROFILEIMG_BUCKET, filePath);
  if(imageExists) {
    return await dbImage.updateNewProfileImage(data.publicUrl, profileId);
  }
  return await dbImage.saveNewProfileImage(data.publicUrl, profileId);
}

module.exports = {
  issueJwt,
  validPassword,
  genPassword,
  supabaseProfileImgUpload
}
  