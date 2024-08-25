const express = require('express');
const { getTokenBalanceController } = require('../controllers/tokenController');

const router = express.Router();

// Define the route to get token balance
router.get('/token-balance', getTokenBalanceController);

module.exports = router;
