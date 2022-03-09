// Imports
const User = require('../models/User');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const jwt = require('jsonwebtoken');

// Login
module.exports.login = (req, res) => {
	// If user is already logged in, redirect to dashboard
	if (req.isAuthenticated()) {
		req.flash('success', 'You are logged in!');
		return res.redirect('/dashboard');
	}

	// If user is not logged in, render login page
	return res.render('login', {
		title: 'Login',
		recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
	});
}

// Register
module.exports.register = (req, res) => {
	// If user is already logged in, redirect to dashboard
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	// If user is not logged in, render register page
	return res.render('register', {
		title: 'Register',
		recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
	});
}

// Create session for logged in user
module.exports.createSession = (req, res) => {
	req.flash('success', 'Logged In Successfully!');
	return res.redirect('/dashboard');
}

// Create new user
module.exports.createUser = async (req, res) => {
	// Get data from form
	const { name, email, password, confirmPassword } = req.body;

	// For reCaptcha
	const responseKey = req.body['g-recaptcha-response'];
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;
	const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseKey}`;

	// Passwords do not match
	if (password !== confirmPassword){
		req.flash('error', 'Passwords do not match');
		return res.redirect('back');
	}

	try {
		// Validating reCaptcha
		const response = await fetch(verifyUrl);
		const data = await response.json();

		// If reCaptcha is not valid
		if (!data.success) {
			req.flash('error', 'Invalid captcha. Please try again.');
			return res.redirect('back');
		}

		// Get user
		const user = await User.findOne({ email });	

		// If user already exists
		if (user) {
			req.flash('error', 'Email already exists. Login to continue.');
			return res.redirect('/users/login');
		}

		// If user does not exist, hash user's password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user documet
		const newUser = new User({
			name,
			email,
			password: hashedPassword
		});

		// Save new user
		await newUser.save();

		// Flash success message
		req.flash('success', 'Registered Successfully! Login to continue.');

		// Redirect to login page
		return res.redirect('/users/login');

	} catch (error) {
		// Flash error message
		req.flash('error', error.message);
		// Redirect to register page
		return res.redirect('back');	
	}
}

// Forgot password
module.exports.forgotPassword = (req, res) => {
	// If user is already logged in, redirect to dashboard
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	// If user is not logged in, render forgot password page
	return res.render('forgot-password', {
		title: 'Forgot Password'
	});
}

// Reset password validation
module.exports.validateResetPassword = async (req, res) => {
	// Get id and token from request params
	const { id, token } = req.params;

	try {
		// Get user
		const user = await User.findById(id); 

		// If user does not exist
		if (!user) {
			req.flash('error', 'User not found.');
			return res.redirect('back');
		}

		// If user exists
		// Get jwt secret
		const jwtSecret = process.env.JWT_SECRET;

		// Get secret
		const secret = jwtSecret + user.password;

		// Verify token
		const payload = jwt.verify(token, secret);

		// If token is valid, render reset password page
		return res.render('reset-password', {
			title: 'Reset Password',
			user,
			token
		});

	} catch (error) {
		// Flash error message
		req.flash('error', error.message);
		// Redirect back
		return res.redirect('back');
	}
}

// Reset password
module.exports.resetPassword = async (req, res) => {
	// Get id and token from request params
	const { id, token } = req.params;
	// Get password and confirm password from request body
	const { password, confirmPassword } = req.body;

	// Password and confirm password must match
	if (password !== confirmPassword) {
		req.flash('error', 'Passwords do not match.');
		return res.redirect('back');
	}

	// Get jwt secret
	const jwtSecret = process.env.JWT_SECRET;

	try {
		// Get user
		const user = await User.findById(id);

		// If user does not exist
		if (!user) {
			req.flash('error', 'User not found.');
			return res.redirect('back');
		}

		// Get secret
		const secret = jwtSecret + user.password;
		
		// Verify token
		const payload = jwt.verify(token, secret);

		// If token is valid, hash user's new password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Update user's password
		await User.updateOne({ _id: id}, { password: hashedPassword });

		// Flash success message
		req.flash('success', 'Password reset successfully.');

		// Redirect to login page
		return res.redirect('/users/login');

	} catch (error) {
		// Flash error message
		req.flash('error', error.message);	
		// Redirect home page
		return res.redirect('/');
	}
}

// Send reset password link to user's email
module.exports.resetPasswordLink = async (req, res) => {
	// Get user's email
	const { email } = req.body;

	try {
		// Get user
		const user = await User.findOne({ email: email });

		// If user does not exist
		if (!user) {
			req.flash('error', 'Invalid email.');
			return res.redirect('back');
		}

		// Get jwt secret
		const jwtSecret = process.env.JWT_SECRET;

		// Create secret 
		const secret = jwtSecret + user.password;

		// Create payload
		const payload = {
			email: user.email,
			id: user._id
		}

		// Create token
		const token = jwt.sign(payload, secret, { expiresIn: '15m' });

		// Create reset password link
		const resetLink = `http://localhost:3000/users/reset_password/${user._id}/${token}`;

		// Send email
		resetPasswordMailer.resetPasswordLink(user, resetLink);

		// Flash success message
		req.flash('success', 'Reset password link has been sent to the email.');

		// Redirect to home page
		return res.redirect('/');

	} catch (error) {
		// Flash error message
		req.flash('error', error.message);
		// Redirect back
		return res.redirect('back');
	}	
}

// Logout
module.exports.logout = (req, res) => {
	// Logout user
	req.logout();
	// Redirect to home page
	return res.redirect('/');
}