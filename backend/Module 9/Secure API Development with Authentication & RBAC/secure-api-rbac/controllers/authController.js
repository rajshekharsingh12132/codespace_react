const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByUsername } = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/* Inline Unit Test */
// Simulate request/response objects and test login function
if (require.main === module) {
  (async () => {
    // Mock res object
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.payload = payload;
        return this;
      },
    };

    // Test missing credentials
    let req = { body: {} };
    await exports.login(req, res);
    console.assert(res.statusCode === 400, 'Should return 400 if missing credentials');

    // Test invalid username
    req = { body: { username: 'unknown', password: 'pass' } };
    await exports.login(req, res);
    console.assert(res.statusCode === 401, 'Should return 401 for invalid username');

    // Test invalid password
    req = { body: { username: 'admin', password: 'wrongpass' } };
    await exports.login(req, res);
    console.assert(res.statusCode === 401, 'Should return 401 for invalid password');

    // Test valid login (will return token)
    req = { body: { username: 'admin', password: 'admin123' } };
    await exports.login(req, res);
    console.assert(res.payload.token, 'Should return token on valid login');

    console.log('AuthController inline tests passed');
  })();
}
