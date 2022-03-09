const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/login', usersController.login);

router.get('/register', usersController.register);

router.post('/create_session', passport.authenticate('local', { failureRedirect: '/users/login' }), usersController.createSession);

router.post('/create_user', usersController.createUser);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), usersController.createSession);

router.get('/logout', usersController.logout);

router.get('/forgot_password', usersController.forgotPassword);
router.post('/reset_password_link', usersController.resetPasswordLink);

module.exports = router;