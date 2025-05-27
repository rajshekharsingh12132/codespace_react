require('dotenv').config(); // Load .env variables

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing urlencoded form data
app.use(bodyParser.urlencoded({ extended: false }));

// Session configuration with environment variable for secret
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret', // Use env var in prod
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } // 10 minutes
}));

// Dummy user data for example
const USER = {
  username: 'admin',
  password: 'password123'
};

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  console.warn(`Unauthorized access attempt to: ${req.originalUrl}`);
  return res.redirect('/login?error=Please login to access this page');
}

// Routes

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === USER.username && password === USER.password) {
      req.session.user = username;
      return res.redirect('/dashboard');
    }
    return res.redirect('/login?error=Invalid username or password');
  } catch (error) {
    console.error('Login error:', error);
    return res.redirect('/error?message=An unexpected error occurred');
  }
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.redirect('/dashboard?error=Logout failed. Try again.');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login?error=Logged out successfully');
  });
});

app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'error.html'));
});

app.use((req, res) => {
  console.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
