const express = require('express');
const router = express.Router();

let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// GET all users
router.get('/users', (req, res) => {
  res.json(users);
});

// GET single user by ID
router.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: `User with ID ${id} not found` });
  }

  res.json(user);
});

// POST add new user
router.post('/users', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update existing user
router.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: `User with ID ${id} not found` });
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  users[userIndex].name = name;
  res.json(users[userIndex]);
});

// DELETE user by ID
router.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: `User with ID ${id} not found` });
  }

  users.splice(userIndex, 1);
  res.json({ message: `User with ID ${id} deleted successfully` });
});

module.exports = router;
