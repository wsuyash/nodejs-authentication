// Imports
const express = require('express');
const passport = require('passport');
const router = express.Router();

const dashboardController = require('../controllers/dashboard_controller');

// Index page
router.get('/', passport.checkAuth, dashboardController.index);
// Change Password
router.get('/change_password', passport.checkAuth, dashboardController.changePassword);
// Reset Password for logged in user
router.post('/change_password', dashboardController.resetPassword);

// Export router
module.exports = router;