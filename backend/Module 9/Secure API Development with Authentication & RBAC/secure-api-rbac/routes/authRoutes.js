const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);

module.exports = router;

/* Inline Unit Test */
// curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"user","password":"user123"}'

