const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/protected', authMiddleware, authController.protected);

module.exports = router;

// --- Inline tests for routes ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  const app = require('../server');
  describe('Auth routes', () => {
    test('POST /register', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'routeuser', password: 'pass' });
      expect(res.statusCode).toBe(201);
    });
    test('POST /login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'routeuser', password: 'pass' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });
}
