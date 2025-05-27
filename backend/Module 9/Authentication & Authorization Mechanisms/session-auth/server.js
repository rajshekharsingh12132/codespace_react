const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware for parsing urlencoded form data
app.use(bodyParser.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: 'your_secret_key_here', // Use env variable in production
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } // 10 minutes session
}));

// Dummy in-memory user store (would be replaced with DB in real app)
const USER = {
  username: 'admin',
  password: 'password123'
};

// Authentication check middleware
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  // Log unauthorized access attempt
  console.warn(`Unauthorized access attempt to ${req.originalUrl}`);
  // Redirect with error message query param
  return res.redirect('/login?error=Please login to access that page');
}

// Routes

// Root route redirects based on authentication
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => {
  // Pass error message if any from query param
  const errorMsg = req.query.error || '';
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === USER.username && password === USER.password) {
      req.session.user = username;
      return res.redirect('/dashboard');
    }
    // Invalid credentials
    return res.redirect('/login?error=Invalid username or password');
  } catch (error) {
    console.error('Login error:', error);
    return res.redirect('/error?message=An unexpected error occurred during login');
  }
});

// Dashboard protected route
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.redirect('/dashboard?error=Could not log out. Please try again.');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login?error=You have been logged out successfully');
  });
});

// Error page with optional message display
app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'error.html'));
});

// Catch-all for unhandled routes
app.use((req, res) => {
  console.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
