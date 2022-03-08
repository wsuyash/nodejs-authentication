const express = require('express');
const passport = require('passport');
const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get('/', homeController.index);
router.use('/dashboard', require('./dashboard'));
router.use('/users', require('./users'));

module.exports = router;