require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server running on port ${PORT}`);
  }
});

module.exports = { app, server };

// --- Inline Tests ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  const { describe, test, expect, afterAll } = require('@jest/globals');

  describe('Server & Routes', () => {
    afterAll(() => server.close());

    test('GET /api/auth/profile without token should return 401', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });

    test('POST /api/auth/login with correct creds returns token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    test('POST /api/auth/login with wrong creds returns 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpass' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
}
