const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL
	}, 
	async (accessToken, refreshToken, profile, done) => {
		const { name, email } = profile._json;

		try {

			const user = await User.findOne({ email: email });

			if (user) {
				return done(null, user);
			}

			const password = crypto.randomBytes(20).toString('hex');

			const newUser = new User({
				name,
				email,
				password
			});

			await newUser.save();

			done(null, newUser);

		} catch (error) {
			console.log(error);	
			return done(error);
		}

	}
));

module.exports = passport;