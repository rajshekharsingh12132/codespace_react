const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;

// --- Inline tests for userRoutes.js ---
if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');
  const express = require('express');
  const userRoutes = require('./userRoutes');
  const app = express();
  app.use(express.json());
  app.use('/api/users', userRoutes);

  const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
  const mongoose = require('mongoose');
  const User = require('../models/userModel');

  describe('User Routes', () => {
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/userDB_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await User.deleteMany({});
    });

    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    });

    test('GET /api/users returns 200', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/users creates user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Route Test', email: 'route@example.com' });
      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe('route@example.com');
    });

    test('PUT /api/users/:id updates user', async () => {
      const user = await User.findOne({ email: 'route@example.com' });
      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ name: 'Updated Name' });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    });

    test('DELETE /api/users/:id deletes user', async () => {
      const user = await User.findOne({ email: 'route@example.com' });
      const res = await request(app)
        .delete(`/api/users/${user._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User removed');
    });
  });
}
