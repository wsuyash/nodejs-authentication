const express = require('express');
const passport = require('passport');
const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.get('/dashboard', passport.checkAuth, homeController.dashboard);
router.use('/users', require('./users'));

module.exports = router;