const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '..', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to read users from file
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

// Helper to write users to file
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const users = await readUsers();

    // Check if user exists
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user and save
    users.push({ username, password: hashedPassword });
    await writeUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

// Login user and generate JWT
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const users = await readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// Protected route example
exports.protected = (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! This is protected data.` });
};
