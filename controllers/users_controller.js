const User = require('../models/User');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

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

		req.flash('success', 'Registered Successfully! Please login to continue.');
		return res.redirect('/users/login');

	} catch (error) {
		console.error(error);
		return res.redirect('back');	
	}
}

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Logged Out Successfully!');
	return res.redirect('/');
}