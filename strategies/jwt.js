const JwtStrategy = require("passport-jwt").Strategy;
const jwtConfig = require("../config/jwtConfig");
const User = require("../models").user;

module.exports = new JwtStrategy(jwtConfig, async (jwt_payload, done) => {
  let email = jwt_payload.email;
  let user = await User.findOne({ where: { email } });

  if (user) {
    return done(null, user);
  } else {
    return done(err, false);
  }
});
