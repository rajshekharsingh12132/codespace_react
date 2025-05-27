// Generic error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
  });
};

module.exports = errorHandler;

// --- Inline Tests ---
if (process.env.NODE_ENV === 'test') {
  const { describe, test, expect } = require('@jest/globals');
  const errorHandler = require('./errorHandler');
  const httpMocks = require('node-mocks-http');

  describe('Error Handler Middleware', () => {
    test('responds with error message and status code', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.statusCode = 400;
      const next = jest.fn();
      const err = new Error('Test error');

      errorHandler(err, req, res, next);

      expect(res.statusCode).toBe(400);
      const data = res._getJSONData();
      expect(data.message).toBe('Test error');
    });

    test('defaults status code 500 if none set', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const err = new Error('Another error');

      errorHandler(err, req, res, next);

      expect(res.statusCode).toBe(500);
      const data = res._getJSONData();
      expect(data.message).toBe('Another error');
    });
  });
}
