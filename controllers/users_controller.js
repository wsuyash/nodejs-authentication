const User = require('../models/User');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
	if (req.isAuthenticated()) {
		req.flash('success', 'You are logged in!');
		return res.redirect('/dashboard');
	}

	return res.render('login', {
		title: 'Login'
	});
}

module.exports.register = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	return res.render('register', {
		title: 'Register'
	});
}

module.exports.createSession = (req, res) => {
	req.flash('success', 'Logged In Successfully!');
	return res.redirect('/dashboard');
}

module.exports.createUser = async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;

	const responseKey = req.body['g-recaptcha-response'];
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;
	const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseKey}`;

	if (password !== confirmPassword){
		req.flash('error', 'Passwords do not match');
		return res.redirect('back');
	}

	try {
		const response = await fetch(verifyUrl);
		const data = await response.json();

		if (!data.success) {
			req.flash('error', 'Invalid captcha. Please try again.');
			return res.redirect('back');
		}

		const user = await User.findOne({ email });	

		if (user) {
			req.flash('error', 'Email already exists. Login to continue.');
			return res.redirect('/users/login');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword
		});

		await newUser.save();

		req.flash('success', 'Registered Successfully! Login to continue.');
		return res.redirect('/users/login');

	} catch (error) {
		req.flash('error', error.message);
		return res.redirect('back');	
	}
}

module.exports.forgotPassword = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	return res.render('forgot-password', {
		title: 'Forgot Password'
	});
}

module.exports.validateResetPassword = async (req, res) => {
 const { id, token } = req.params;

 try {
	const user = await User.findById(id); 

	if (!user) {
		req.flash('error', 'User not found.');
		return res.redirect('back');
	}

	const jwtSecret = process.env.JWT_SECRET;
	const secret = jwtSecret + user.password;

	const payload = jwt.verify(token, secret);

	return res.render('reset-password', {
		title: 'Reset Password',
		user,
		token
	});

 } catch (error) {
	req.flash('error', error.message);
	return res.redirect('back');
 }
}
module.exports.resetPassword = async (req, res) => {
	const { id, token } = req.params;
	const { password, confirmPassword } = req.body;

	if (password !== confirmPassword) {
		req.flash('error', 'Passwords do not match.');
		return res.redirect('back');
	}

	const jwtSecret = process.env.JWT_SECRET;

	try {
		const user = await User.findById(id);

		if (!user) {
			req.flash('error', 'User not found.');
			return res.redirect('back');
		}

		const secret = jwtSecret + user.password;
		const payload = jwt.verify(token, secret);

		const hashedPassword = await bcrypt.hash(password, 10);

		req.flash('success', 'Password reset successfully.');

		await User.updateOne({ _id: id}, { password: hashedPassword });

		return res.redirect('/users/login');

	} catch (error) {
		req.flash('error', error.message);	
		return res.redirect('/');
	}
}

module.exports.resetPasswordLink = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			req.flash('error', 'Invalid email.');
			return res.redirect('back');
		}

		const jwtSecret = process.env.JWT_SECRET;
		const secret = jwtSecret + user.password;
		const payload = {
			email: user.email,
			id: user._id
		}

		const token = jwt.sign(payload, secret, { expiresIn: '15m' });

		const resetLink = `http://localhost:3000/users/reset_password/${user._id}/${token}`;

		resetPasswordMailer.resetPasswordLink(user, resetLink);

		req.flash('success', 'Reset password link has been sent to the email.');

		return res.redirect('/');

	} catch (error) {
		req.flash('error', error.message);
		return res.redirect('back');
	}	

}

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Logged Out Successfully!');
	return res.redirect('/');
}