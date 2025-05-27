const User = require('../models/userModel');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, phone });
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };

// --- Inline tests for userController.js ---
if (process.env.NODE_ENV === 'test') {
  const mongoose = require('mongoose');
  const User = require('../models/userModel');
  const httpMocks = require('node-mocks-http');
  const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
  const { getUsers, createUser, updateUser, deleteUser } = require('./userController');

  describe('User Controller', () => {
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

    test('getUsers returns empty array initially', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      await getUsers(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([]);
    });

    test('createUser returns 400 if missing fields', async () => {
      const req = httpMocks.createRequest({ body: { name: '', email: '' } });
      const res = httpMocks.createResponse();
      await createUser(req, res);
      expect(res.statusCode).toBe(400);
    });

    test('createUser successfully creates user', async () => {
      const req = httpMocks.createRequest({ body: { name: 'Jane Doe', email: 'jane@example.com' } });
      const res = httpMocks.createResponse();
      await createUser(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().email).toBe('jane@example.com');
    });

    test('updateUser returns 404 if user not found', async () => {
      const req = httpMocks.createRequest({ params: { id: '60d8f3f20c9b9c3a88e48888' }, body: { name: 'New Name' } });
      const res = httpMocks.createResponse();
      await updateUser(req, res);
      expect(res.statusCode).toBe(404);
    });

    test('deleteUser returns 404 if user not found', async () => {
      const req = httpMocks.createRequest({ params: { id: '60d8f3f20c9b9c3a88e48888' } });
      const res = httpMocks.createResponse();
      await deleteUser(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
}
