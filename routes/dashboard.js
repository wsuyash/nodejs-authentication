const express = require('express');
const passport = require('passport');
const router = express.Router();

const dashboardController = require('../controllers/dashboard_controller');

router.get('/', passport.checkAuth, dashboardController.index);
router.get('/change_password', passport.checkAuth, dashboardController.changePassword);
router.post('/change_password', dashboardController.resetPassword);

module.exports = router;