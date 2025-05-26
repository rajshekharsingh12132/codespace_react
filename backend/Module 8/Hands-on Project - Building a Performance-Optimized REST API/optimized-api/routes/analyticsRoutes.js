const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const router = express.Router();

router.get('/orders', analyticsController.getOrderAnalytics);

module.exports = router;