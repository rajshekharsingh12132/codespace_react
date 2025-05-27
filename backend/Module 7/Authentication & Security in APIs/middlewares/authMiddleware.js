const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

// --- Inline Tests ---
if (process.env.NODE_ENV === 'test') {
  const { describe, test, expect } = require('@jest/globals');
  const httpMocks = require('node-mocks-http');
  const jwt = require('jsonwebtoken');
  const authMiddleware = require('./authMiddleware');

  describe('Auth Middleware', () => {
    test('rejects missing token', () => {
      const req = httpMocks.createRequest({ headers: {} });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);
      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data.message).toBe('No token, authorization denied');
      expect(next).not.toHaveBeenCalled();
    });

    test('rejects invalid token', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer invalidtoken' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);
      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data.message).toBe('Token is not valid');
      expect(next).not.toHaveBeenCalled();
    });

    test('accepts valid token and calls next', () => {
      const token = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const req = httpMocks.createRequest({
        headers: { authorization: `Bearer ${token}` },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);
      expect(req.user.username).toBe('admin');
      expect(next).toHaveBeenCalled();
    });
  });
}
