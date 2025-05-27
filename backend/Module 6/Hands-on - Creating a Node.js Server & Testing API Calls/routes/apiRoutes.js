const express = require('express');
const router = express.Router();

// In-memory users store
let users = [];
let nextId = 1;

// GET /users - get all users
router.get('/users', (req, res) => {
  res.json(users);
});

// GET /users/:id - get user by id
router.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST /users - add new user
router.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const user = { id: nextId++, name };
  users.push(user);
  res.status(201).json(user);
});

// PUT /users/:id - update existing user
router.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  user.name = name;
  res.json(user);
});

// DELETE /users/:id - delete user
router.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
