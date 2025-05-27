require('dotenv').config();
const express = require('express');
const passport = require('passport');
require('./config/passport'); // passport strategy setup
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/authRoutes');
const jwtAuth = require('./middleware/jwtAuth');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: [process.env.JWT_SECRET || 'defaultsecret'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/profile', jwtAuth, (req, res) => {
  res.json({ user: req.user });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

// --- Inline tests for server.js ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  describe('Server & Profile Route', () => {
    test('GET /profile without token returns 401', async () => {
      const app = require('./server');
      const res = await request(app).get('/profile');
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Authorization header missing');
    });
  });
}
