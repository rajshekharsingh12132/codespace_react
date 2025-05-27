const jwt = require('jsonwebtoken');

function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = jwtAuth;

// --- Inline tests for jwtAuth.js ---
if (process.env.NODE_ENV === 'test') {
  const httpMocks = require('node-mocks-http');
  const jwt = require('jsonwebtoken');
  const { describe, test, expect, jest } = require('@jest/globals');

  describe('jwtAuth middleware', () => {
    test('401 if missing Authorization header', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtAuth(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ error: 'Authorization header missing' });
      expect(next).not.toHaveBeenCalled();
    });

    test('401 if token missing in header', () => {
      const req = httpMocks.createRequest({ headers: { authorization: 'Bearer' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtAuth(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ error: 'Token missing' });
      expect(next).not.toHaveBeenCalled();
    });

    test('next called with valid token', () => {
      const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET || 'testsecret');
      const req = httpMocks.createRequest({ headers: { authorization: `Bearer ${token}` } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user.id).toBe('123');
    });

    test('401 if token invalid', () => {
      const req = httpMocks.createRequest({ headers: { authorization: 'Bearer invalidtoken' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtAuth(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });
}
