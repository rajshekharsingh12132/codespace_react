const express = require('express');
const mysql = require('mysql');
const request = require('supertest'); // For testing

require('dotenv').config();

const app = express();
app.use(express.json());

// --- Setup MySQL connection pool ---
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'test_db',
});

// Utility query function using Promise
function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Basic email validator
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Routes ---

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
  const id = Number(req.params.id);
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
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
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
  const id = Number(req.params.id);
  const { name, email } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
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
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const result = await query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User with id ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server if run directly
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export app for testing
module.exports = app;

/* --------------------------------------
 * Inline Unit Tests with Jest + Supertest
 * -------------------------------------- */

if (process.env.NODE_ENV === 'test') {
  const testUser = { name: 'Test User', email: 'testuser@example.com' };
  let createdUserId;

  describe('Users API Endpoints', () => {
    it('POST /users - create user', async () => {
      const res = await request(app)
        .post('/users')
        .send(testUser)
        .expect(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
      createdUserId = res.body.id;
    });

    it('GET /users - get all users', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /users/:id - get user by id', async () => {
      const res = await request(app)
        .get(`/users/${createdUserId}`)
        .expect(200);
      expect(res.body).toHaveProperty('id', createdUserId);
      expect(res.body.name).toBe(testUser.name);
    });

    it('PUT /users/:id - update user', async () => {
      const updatedUser = { name: 'Updated Name', email: 'updated@example.com' };
      const res = await request(app)
        .put(`/users/${createdUserId}`)
        .send(updatedUser)
        .expect(200);
      expect(res.body.name).toBe(updatedUser.name);
      expect(res.body.email).toBe(updatedUser.email);
    });

    it('DELETE /users/:id - delete user', async () => {
      const res = await request(app)
        .delete(`/users/${createdUserId}`)
        .expect(200);
      expect(res.body.message).toMatch(/deleted/);
    });

    it('GET /users/:id - user not found', async () => {
      const res = await request(app)
        .get(`/users/999999`)
        .expect(404);
      expect(res.body.error).toBe('User not found');
    });

    it('POST /users - invalid email', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Name', email: 'bademail' })
        .expect(400);
      expect(res.body.error).toBe('Invalid email format');
    });

    it('PUT /users/:id - invalid id', async () => {
      const res = await request(app)
        .put('/users/abc')
        .send({ name: 'Name', email: 'test@example.com' })
        .expect(400);
      expect(res.body.error).toBe('Invalid user ID');
    });
  });
}
