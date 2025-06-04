
const fs = require('fs');
const path = require('path');
const dbUser = require('../db/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GithubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

const pathToKey = path.join(__dirname, '../id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithm: ['RS256']
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await dbUser.getUserById(payload.sub);
    if(user) {
      return done(null, user);
    }else {
      return done(null, false);
    }
  }catch(err) {
    done(err, false);
  }
});

const githubStrategy = new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback",
  scope: ["user:email"]
},
async (accessToken, refreshToken, profile, done) => {
  try{
    let user = await dbUser.getUserByGithubId(profile.id);
    if(!user) {
      user = await dbUser.saveNewUserFromGithub(profile);
    }
    return done(null, user);
  }catch(err) {
    return done(err, false);
  }
})

module.exports = (passport) => {
  passport.use(jwtStrategy);
  passport.use(githubStrategy);
}
