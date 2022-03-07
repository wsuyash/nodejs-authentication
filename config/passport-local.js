const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passReqToCallback: true
	}, 
	async (req, email, password, done) => {
		const responseKey = req.body['g-recaptcha-response'];
		const secretKey = process.env.RECAPTCHA_SECRET_KEY;
		const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseKey}`;

		try {
			const response = await fetch(verifyUrl);
			const data = await response.json();

			if (!data.success) {
				req.flash('error', 'Invalid captcha. Please try again.');
				return done(null, false);
			}

			const user = await User.findOne({ email });	

			if (!user) {
				req.flash('error', 'Incorrect email or password.');
				return done(null, false);
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				req.flash('error', 'Incorrect email or password.');
				return done(null, false);
			}

			return done(null, user);

		} catch (error) {
			return done(error);
		}
	}
));

passport.serializeUser((user, done) => {
	return done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
	try {
		const user = await User.findById(userId);

		if (!user) {
			return done(null, false);
		}

		return done(null, user);

	} catch (error) {
		return done(error);
	}
});

passport.checkAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	return res.redirect('/');
}

module.exports = passport;