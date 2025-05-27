const express = require('express');
const { getDashboard, getAdminPanel } = require('../controllers/userController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

const router = express.Router();

router.get('/dashboard', auth, getDashboard);
router.get('/admin', auth, checkRole('admin'), getAdminPanel);

module.exports = router;

/* Inline Unit Test */
// curl http://localhost:5000/api/users/dashboard -H "Authorization: Bearer <token>"

