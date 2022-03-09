// Imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

// Configure local strategy
passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passReqToCallback: true
	}, 
	async (req, email, password, done) => {
		// For reCaptcha
		const responseKey = req.body['g-recaptcha-response'];
		const secretKey = process.env.RECAPTCHA_SECRET_KEY;
		const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseKey}`;

		try {
			// Verify reCaptcha
			const response = await fetch(verifyUrl);
			const data = await response.json();

			// If reCaptcha is not verified
			if (!data.success) {
				req.flash('error', 'Invalid captcha. Please try again.');
				return done(null, false);
			}

			// If reCaptcha is verified, then check if user exists
			const user = await User.findOne({ email });	

			// If user doesn't exist
			if (!user) {
				req.flash('error', 'Incorrect email or password.');
				return done(null, false);
			}

			// If user exists, check if password is correct
			const isMatch = await bcrypt.compare(password, user.password);

			// If password is incorrect
			if (!isMatch) {
				req.flash('error', 'Incorrect email or password.');
				return done(null, false);
			}

			// If password is correct, return user
			return done(null, user);

		} catch (error) {
			// Return error
			req.flash('error', error.message);
			return done(error);
		}
	}
));

// Serialize user
passport.serializeUser((user, done) => {
	return done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (userId, done) => {
	try {
		// Find user by id
		const user = await User.findById(userId);

		// If user doesn't exist
		if (!user) {
			return done(null, false);
		}

		// If user exists, return user
		return done(null, user);

	} catch (error) {
		// Return error
		return done(error);
	}
});

// Custom middleware to check for authentication
passport.checkAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	return res.redirect('/');
}

// Export local strategy
module.exports = passport;