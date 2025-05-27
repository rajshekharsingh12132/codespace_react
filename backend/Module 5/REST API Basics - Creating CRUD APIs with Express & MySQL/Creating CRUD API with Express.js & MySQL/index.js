const express = require('express');
const { query } = require('../db.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Helper function for email validation (basic)
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Routes

// GET all users
app.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET user by ID
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const users = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

  try {
    const result = await query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update user
app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

  try {
    const result = await query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ id, name, email });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const result = await query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User with id ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
