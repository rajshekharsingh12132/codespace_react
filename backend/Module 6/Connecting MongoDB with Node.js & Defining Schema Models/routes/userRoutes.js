const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Define routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Inline route test: simple check that router has all routes
const routes = router.stack.map(r => r.route.path);
if (!routes.includes('/users')) console.error('GET /users route missing');
if (!routes.includes('/users/:id')) console.error('PUT/DELETE /users/:id route missing');
else console.log('Routes defined:', routes);

module.exports = router;
