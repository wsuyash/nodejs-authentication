const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passReqToCallback: true
	}, 
	async (req, email, password, done) => {
		try {
			const user = await User.findOne({ email });	

			if (!user) {
				console.log('User not found');
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
			console.log('User could not be deserialized');
			return done(null, false);
		}

		return done(null, user);

	} catch (error) {
		console.log(error);	
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