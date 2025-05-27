const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // User authenticated via Google OAuth, create JWT token
    const payload = {
      id: req.user.id,
      displayName: req.user.displayName,
      emails: req.user.emails,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Send token to client — for demo we send JSON, in real apps redirect with cookie or header
    res.json({ token });
  }
);

module.exports = router;

// --- Inline tests for authRoutes.js ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  const app = require('../server');
  describe('Auth Routes', () => {
    test('GET /auth/google redirects (302)', async () => {
      const res = await request(app).get('/auth/google');
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toMatch(/accounts\.google\.com/);
    });
    // We cannot test /google/callback fully without mocking Passport,
    // but we confirm route exists and returns 401 on failure redirect
    test('GET /auth/google/callback failure redirects', async () => {
      const res = await request(app).get('/auth/google/callback');
      expect([302, 401]).toContain(res.statusCode);
    });
  });
}
