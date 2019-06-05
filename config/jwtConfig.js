const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = {
  //define a secret key for signing the jwt tokens
  secretOrKey: "secret",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
