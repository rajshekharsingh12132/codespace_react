const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.serializeUser((user, done) => {
  // Store user ID or profile info in session
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Retrieve user from session
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    /*
      Normally you would save user profile info to DB here.
      For demo, just return profile.
    */
    return done(null, profile);
  }
));
