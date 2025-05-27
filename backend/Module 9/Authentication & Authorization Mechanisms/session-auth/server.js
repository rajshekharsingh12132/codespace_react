const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'your_secret_key_here', // In production, use a strong secret in env variables
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } // Session expires in 10 minutes
}));

// In-memory user for demo
const USER = {
  username: 'admin',
  password: 'password123'
};

// Middleware to protect routes
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    res.redirect('/dashboard');
  } else {
    res.redirect('/error');
  }
});

app.get('/dashboard', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'error.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/* Inline Unit Tests */
if (require.main === module) {
  const http = require('http');
  const assert = require('assert');

  async function test() {
    // Helper to make HTTP requests
    const request = (options, postData) => new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
      });
      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });

    // Test: GET /login returns login page
    let res = await request({ hostname: 'localhost', port: PORT, path: '/login', method: 'GET' });
    assert.strictEqual(res.statusCode, 200, 'GET /login should return 200');
    assert.ok(res.data.includes('<form'), 'Login page should contain form');

    // Test: POST /login with wrong creds redirects to /error
    res = await request({
      hostname: 'localhost', port: PORT, path: '/login', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, 'username=wrong&password=wrong');
    assert.strictEqual(res.statusCode, 302, 'POST /login wrong creds should redirect');
    assert.ok(res.headers.location === '/error', 'Redirect should be to /error');

    // Test: POST /login with correct creds redirects to /dashboard
    res = await request({
      hostname: 'localhost', port: PORT, path: '/login', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, `username=${USER.username}&password=${USER.password}`);
    assert.strictEqual(res.statusCode, 302, 'POST /login correct creds should redirect');
    assert.ok(res.headers.location === '/dashboard', 'Redirect should be to /dashboard');

    console.log('All inline tests passed');
    server.close();
  }

  test().catch(err => {
    console.error('Inline tests failed:', err);
    server.close();
  });
}
