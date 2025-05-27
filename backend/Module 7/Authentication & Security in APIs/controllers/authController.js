const jwt = require('jsonwebtoken');

const DUMMY_USER = {
  username: 'admin',
  password: 'admin123',
};

exports.login = (req, res, next) => {
  const { username, password } = req.body;

  if (username !== DUMMY_USER.username || password !== DUMMY_USER.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
};

exports.getProfile = (req, res) => {
  // req.user is set by authMiddleware
  res.json({ username: req.user.username, message: 'Profile data' });
};

// --- Inline Tests ---
if (process.env.NODE_ENV === 'test') {
  const { describe, test, expect } = require('@jest/globals');
  const httpMocks = require('node-mocks-http');
  const authController = require('./authController');

  describe('Auth Controller', () => {
    test('login success returns token', () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'admin', password: 'admin123' },
      });
      const res = httpMocks.createResponse();
      authController.login(req, res);
      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data.token).toBeDefined();
    });

    test('login failure returns 401', () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'admin', password: 'wrong' },
      });
      const res = httpMocks.createResponse();
      authController.login(req, res);
      const data = res._getJSONData();
      expect(res.statusCode).toBe(401);
      expect(data.message).toBe('Invalid credentials');
    });

    test('getProfile returns username and message', () => {
      const req = httpMocks.createRequest();
      req.user = { username: 'admin' };
      const res = httpMocks.createResponse();
      authController.getProfile(req, res);
      const data = res._getJSONData();
      expect(data.username).toBe('admin');
      expect(data.message).toBe('Profile data');
    });
  });
}
