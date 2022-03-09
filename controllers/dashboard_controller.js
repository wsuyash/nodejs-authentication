// Imports
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Index page
module.exports.index = (req, res) => {
	return res.render('dashboard', {
		title: 'Dashboard',
		user: req.user
	});
}

// Change Password
module.exports.changePassword = (req, res) => {
	// Render change password page
	return res.render('change-password', {
		title: 'Change Password',
	});
}

// Reset Password for logged in user
module.exports.resetPassword = async (req, res) => {
	// Get data from request body
	const { currentPassword, newPassword, confirmNewPassword } = req.body;

	// New password and confirm new password must match
	if (newPassword !== confirmNewPassword) {
		req.flash('error', 'Passwords do not match.');
		return res.redirect('back');
	}

	// Current password and new password shouldn't be same
	if (currentPassword === newPassword) {
		req.flash('error', 'New password must be different from the current password.');
		return res.redirect('back');
	}

	// Get user from the request
	const user = req.user;

	try {
		// Check if current password matches the password in database
		const isMatch = await bcrypt.compare(currentPassword, user.password); 
		
		// If current password is incorrect
		if (!isMatch) {
			req.flash('error', 'Incorrect current password.');
			return res.redirect('back');
		}

		// If current password is correct, hash new password
		const newHashedPassword = await bcrypt.hash(newPassword, 10);

		// Update password in database
		await User.updateOne({ _id: user._id }, {
			password: newHashedPassword
		});

		// Redirect to sign-in page
		req.flash('success', 'Password changed. Login to continue.');
		req.logout();

		return res.redirect('/users/login');

	} catch (error) {
		// Return error
		req.flash('error', error.message);
		return res.redirect('back');
	}

}