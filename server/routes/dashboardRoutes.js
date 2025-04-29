const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');

router.route('/').get(getDashboardStats);

module.exports = router;
