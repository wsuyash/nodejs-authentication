// Imports
const express = require('express');
const passport = require('passport');
const router = express.Router();

const homeController = require('../controllers/home_controller');

// Index page
router.get('/', homeController.index);
// Dashboard routes 
router.use('/dashboard', require('./dashboard'));
// Users routes
router.use('/users', require('./users'));

// Export router
module.exports = router;