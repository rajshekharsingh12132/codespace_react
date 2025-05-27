const db = require('../config/db');

// Helper: Simple input validation for user data
function validateUserInput(name, email) {
  if (!name || typeof name !== 'string') return 'Invalid or missing "name"';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return 'Invalid or missing "email"';
  return null;
}

// Create new user
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  const validationError = validateUserInput(name, email);
  if (validationError) return res.status(400).json({ error: validationError });

  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err, result) => {
    if (err) return res.status(500).json({ error: `DB error: ${err.message}` });
    res.status(201).json({ id: result.insertId, name, email });
  });
};

// Retrieve all users
exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: `DB error: ${err.message}` });
    res.json(results);
  });
};

// Retrieve a single user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'User ID must be a number' });

  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: `DB error: ${err.message}` });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
};

// Update user details
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'User ID must be a number' });

  const validationError = validateUserInput(name, email);
  if (validationError) return res.status(400).json({ error: validationError });

  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(query, [name, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: `DB error: ${err.message}` });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully' });
  });
};

// Delete a user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'User ID must be a number' });

  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: `DB error: ${err.message}` });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
};
