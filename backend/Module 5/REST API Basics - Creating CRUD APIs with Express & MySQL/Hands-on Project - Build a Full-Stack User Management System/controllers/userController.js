const db = require('../config/db');

// Basic input validation function for name and email
function validateUserInput(name, email) {
  if (!name || typeof name !== 'string') return 'Invalid or missing "name"';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return 'Invalid or missing "email"';
  return null;
}

// Create a new user
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  const validationError = validateUserInput(name, email);
  if (validationError) {
    console.warn(`Validation failed on createUser: ${validationError}`);
    return res.status(400).json({ error: validationError });
  }

  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err, result) => {
    if (err) {
      console.error('DB error in createUser:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    console.log(`User created with ID ${result.insertId}`);
    res.status(201).json({ id: result.insertId, name, email });
  });
};

// Get all users
exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('DB error in getUsers:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    res.json(results);
  });
};

// Get a user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    console.warn(`Invalid user ID received: ${id}`);
    return res.status(400).json({ error: 'User ID must be a number' });
  }

  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('DB error in getUserById:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    if (results.length === 0) {
      console.info(`User not found with ID: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  });
};

// Update user information
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (isNaN(id)) {
    console.warn(`Invalid user ID received for update: ${id}`);
    return res.status(400).json({ error: 'User ID must be a number' });
  }

  const validationError = validateUserInput(name, email);
  if (validationError) {
    console.warn(`Validation failed on updateUser: ${validationError}`);
    return res.status(400).json({ error: validationError });
  }

  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(query, [name, email, id], (err, result) => {
    if (err) {
      console.error('DB error in updateUser:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    if (result.affectedRows === 0) {
      console.info(`User not found for update with ID: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`User updated with ID ${id}`);
    res.json({ message: 'User updated successfully' });
  });
};

// Delete a user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    console.warn(`Invalid user ID received for delete: ${id}`);
    return res.status(400).json({ error: 'User ID must be a number' });
  }

  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('DB error in deleteUser:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    if (result.affectedRows === 0) {
      console.info(`User not found for delete with ID: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`User deleted with ID ${id}`);
    res.json({ message: 'User deleted successfully' });
  });
};
