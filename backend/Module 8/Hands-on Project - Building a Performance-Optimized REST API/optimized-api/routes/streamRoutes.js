const express = require('express');
const streamController = require('../controllers/streamController');
const router = express.Router();

router.get('/file', streamController.processLargeFile);
router.get('/orders', streamController.streamOrders);
module.exports = router;