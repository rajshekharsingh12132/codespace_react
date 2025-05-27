const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
  callbackURL: '/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  // You can save the user to DB here or just pass the profile on
  return done(null, profile);
}));

// --- Inline tests for passport.js ---
if (process.env.NODE_ENV === 'test') {
  const { describe, test, expect } = require('@jest/globals');
  describe('Passport Google Strategy config', () => {
    test('should have GoogleStrategy configured', () => {
      expect(passport._strategies.google).toBeDefined();
    });
  });
}
