require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport-setup');

const app = express();
const PORT = process.env.PORT || 3000;

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware to protect routes
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
}

// Routes

// Home
app.get('/', (req, res) => {
  res.send(`<h1>Welcome</h1><a href="/auth/google">Login with Google</a>`);
});

// Google OAuth login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Protected dashboard
app.get('/dashboard', ensureAuth, (req, res) => {
  const user = req.user;
  res.send(`
    <h1>Dashboard</h1>
    <p>Welcome, ${user.displayName}</p>
    <p>Email: ${user.emails[0].value}</p>
    <a href="/logout">Logout</a>
  `);
});

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Failure route
app.get('/auth/failure', (req, res) => {
  res.send('Authentication Failed. <a href="/">Try again</a>');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
