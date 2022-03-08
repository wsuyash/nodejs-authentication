const User = require('../models/User');
const bcrypt = require('bcrypt');
const homeController = require('../controllers/home_controller');

module.exports.index = (req, res) => {
	return res.render('dashboard', {
		title: 'Dashboard',
		user: req.user
	});
}

module.exports.changePassword = (req, res) => {
	return res.render('change-password', {
		title: 'Change Password',
	});
}

module.exports.resetPassword = async (req, res) => {
	const { currentPassword, newPassword, confirmNewPassword } = req.body;

	if (newPassword !== confirmNewPassword) {
		req.flash('error', 'Passwords do not match.');
		return res.redirect('back');
	}

	const user = req.user;

	try {
		const isMatch = await bcrypt.compare(currentPassword, user.password); 
		
		if (!isMatch) {
			req.flash('error', 'Incorrect current password.');
			return res.redirect('back');
		}

		const newHashedPassword = await bcrypt.hash(newPassword, 10);

		await User.updateOne({ _id: user._id }, {
			password: newHashedPassword
		});

		req.flash('success', 'Password changed. Login to continue.');
		req.logout();
		return res.redirect('/users/login');

	} catch (error) {
		req.flash('error', error.message);
		return res.redirect('back');
	}

}