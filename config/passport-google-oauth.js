// Imports
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');
const crypto = require('crypto');

// Configure google strategy
passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL
	}, 
	async (accessToken, refreshToken, profile, done) => {
		const { name, email } = profile._json;

		try {

			// Check if user already exists
			const user = await User.findOne({ email: email });

			// If user already exists, return user
			if (user) {
				return done(null, user);
			}

			// If user doesn't exist, create new user

			// Create a random password as password field in database is required
			const password = crypto.randomBytes(20).toString('hex');

			// Create new user document
			const newUser = new User({
				name,
				email,
				password
			});

			// Save user to database
			await newUser.save();

			// Return new user
			return done(null, newUser);

		} catch (error) {
			// Return error
			req.flash('error', error.message);
			return done(error);
		}
	}
));

// Export strategy
module.exports = passport;