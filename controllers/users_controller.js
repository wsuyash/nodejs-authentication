const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports.login = (req, res) => {
	return res.render('login', {
		title: 'Login'
	});
}

module.exports.register = (req, res) => {
	return res.render('register', {
		title: 'Register'
	});
}

module.exports.createSession = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });	

		if (!user) {
			console.log('Invalid email or password.');
			return res.redirect('back');
		}

		const isMatch = await bcrypt.compare(password, user.password); 

		if (!isMatch) {
			console.log('Invalid email or password.');
			return res.redirect('back');
		}

		return res.send('Successfully logged in.');

	} catch (error) {
		console.error(error);
		return res.redirect('back');
	}
}

module.exports.createUser = async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;

	if (password !== confirmPassword){
		console.log('Passwords do not match');
		return res.redirect('back');
	}

	try {
		const user = await User.findOne({ email });	

		if (user) {
			console.log('Email already exists');
			return res.redirect('/users/login');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword
		});

		await newUser.save();

		return res.redirect('/users/login');

	} catch (error) {
		console.error(error);
		return res.redirect('back');	
	}
}