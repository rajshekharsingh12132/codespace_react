require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server running on port ${PORT}`);
  }
});

module.exports = { app, server };

// --- Inline tests for server.js ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  const { describe, test, expect, afterAll } = require('@jest/globals');

  describe('Server Basic', () => {
    test('GET /api/users status 200', async () => {
      const res = await request(module.exports.app).get('/api/users');
      expect(res.statusCode).toBe(200);
    });
    afterAll(() => {
      module.exports.server.close();
    });
  });
}
