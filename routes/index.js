const express = require('express');
const passport = require('passport');
const router = express.Router();

const homeController = require('../controllers/home_controller');
const dashboardController = require('../controllers/dashboard_controller');

router.get('/', homeController.index);
router.use('/dashboard', passport.checkAuth, dashboardController.index);
router.use('/users', require('./users'));

module.exports = router;