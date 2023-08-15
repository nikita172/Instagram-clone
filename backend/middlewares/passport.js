const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
require("dotenv").config();

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/user/signin/facebook/callback"
},
  function (accessToken, refreshToken, profile, cb) {
    cb(null, profile)
  }
));



//if we are using session the we can add below function i.e. serializeUser ,deserializeUser
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});