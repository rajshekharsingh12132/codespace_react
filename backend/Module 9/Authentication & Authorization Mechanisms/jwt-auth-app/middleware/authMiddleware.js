const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;

// --- Inline tests for authMiddleware ---
if (process.env.NODE_ENV === 'test') {
  const httpMocks = require('node-mocks-http');
  const jwt = require('jsonwebtoken');
  const { describe, test, expect, jest } = require('@jest/globals');

  describe('authMiddleware', () => {
    test('should respond 401 if no Authorization header', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ error: 'Authorization header missing' });
      expect(next).not.toBeCalled();
    });

    test('should respond 401 if token missing in header', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ error: 'Token missing' });
      expect(next).not.toBeCalled();
    });

    test('should call next if token is valid', () => {
      const token = jwt.sign({ username: 'user' }, process.env.JWT_SECRET || 'testsecret');
      const req = httpMocks.createRequest({
        headers: { authorization: `Bearer ${token}` },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(next).toBeCalled();
      expect(req.user.username).toBe('user');
    });

    test('should respond 401 if token is invalid', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer invalidtoken' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ error: 'Invalid token' });
      expect(next).not.toBeCalled();
    });
  });
}
