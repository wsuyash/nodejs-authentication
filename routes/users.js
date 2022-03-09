// Imports
const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users_controller');

// Login
router.get('/login', usersController.login);

// Register
router.get('/register', usersController.register);

// Create session for logged in user
router.post('/create_session', passport.authenticate('local', { failureRedirect: '/users/login' }), usersController.createSession);

// Create new user
router.post('/create_user', usersController.createUser);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), usersController.createSession);

// Logout
router.get('/logout', usersController.logout);

// Forgot Password
router.get('/forgot_password', usersController.forgotPassword);

// Reset Password
router.get('/reset_password/:id/:token', usersController.validateResetPassword);
router.post('/reset_password_link', usersController.resetPasswordLink);
router.post('/reset_password/:id/:token', usersController.resetPassword);

// Export router
module.exports = router;