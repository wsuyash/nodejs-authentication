// Home page
module.exports.index = (req, res) => {
	// If user is logged in, redirect to dashboard
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	// Render home page
	return res.render('home', {
		title: 'Authentication',
	});
}