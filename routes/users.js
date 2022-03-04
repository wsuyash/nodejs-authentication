const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/login', usersController.login);
router.get('/register', usersController.register);
router.post('/create_session', passport.authenticate('local', {
	failureRedirect: '/users/login',
}), usersController.createSession);
router.post('/create_user', usersController.createUser);
router.get('/logout', usersController.logout);

module.exports = router;