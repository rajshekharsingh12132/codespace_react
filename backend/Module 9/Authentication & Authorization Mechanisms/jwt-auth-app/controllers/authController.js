const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_FILE = './users.json';

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = await readUsers();
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  await writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = await readUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.protected = (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! You accessed a protected route.` });
};

// --- Inline tests for authController ---
if (process.env.NODE_ENV === 'test') {
  const { describe, test, expect, jest, beforeEach } = require('@jest/globals');
  jest.mock('fs', () => ({
    promises: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
    }
  }));
  const fsMock = require('fs').promises;

  describe('authController', () => {
    const res = { status: jest.fn(() => res), json: jest.fn() };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('register - missing fields', async () => {
      const req = { body: {} };
      await exports.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
    });

    test('register - user exists', async () => {
      fsMock.readFile.mockResolvedValue(JSON.stringify([{ username: 'existing', password: 'hash' }]));
      const req = { body: { username: 'existing', password: 'pass' } };
      await exports.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    test('register - success', async () => {
      fsMock.readFile.mockResolvedValue('[]');
      fsMock.writeFile.mockResolvedValue();
      const req = { body: { username: 'newuser', password: 'pass' } };
      await exports.register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    test('login - missing fields', async () => {
      const req = { body: {} };
      await exports.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
    });

    test('login - user not found', async () => {
      fsMock.readFile.mockResolvedValue('[]');
      const req = { body: { username: 'unknown', password: 'pass' } };
      await exports.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    test('login - wrong password', async () => {
      fsMock.readFile.mockResolvedValue(JSON.stringify([{ username: 'user', password: await bcrypt.hash('correct', 10) }]));
      const req = { body: { username: 'user', password: 'wrong' } };
      await exports.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    test('login - success returns token', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      fsMock.readFile.mockResolvedValue(JSON.stringify([{ username: 'user', password: hashed }]));
      const req = { body: { username: 'user', password: 'correct' } };
      res.json = jest.fn();
      await exports.login(req, res);
      expect(res.json).toHaveBeenCalled();
      const token = res.json.mock.calls[0][0].token;
      expect(token).toBeDefined();
    });
  });
}
