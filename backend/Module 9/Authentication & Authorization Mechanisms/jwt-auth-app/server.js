require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // for testing

// --- Inline tests for server.js ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  describe('Auth API Integration', () => {
    let server;
    beforeAll(() => {
      server = require('http').createServer(app);
    });
    afterAll((done) => server.close(done));

    test('POST /api/auth/register - success', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'testpass' });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
    });

    test('POST /api/auth/login - success', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpass' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test('GET /api/auth/protected - without token', async () => {
      const res = await request(app).get('/api/auth/protected');
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Authorization header missing');
    });
  });
}
