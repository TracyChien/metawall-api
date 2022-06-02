var express = require("express");
var router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const AuthController = require("../controllers/tpAuth");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);
// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleCallback
);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  AuthController.facebookCallback
);

module.exports = router;
