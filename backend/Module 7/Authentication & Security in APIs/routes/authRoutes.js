const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;

// --- Inline Tests ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  const express = require('express');
  const authRoutes = require('./authRoutes');
  const { describe, test, expect } = require('@jest/globals');

  describe('Auth Routes', () => {
    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    test('POST /api/auth/login responds with token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test('GET /api/auth/profile without token returns 401', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('No token, authorization denied');
    });
  });
}
