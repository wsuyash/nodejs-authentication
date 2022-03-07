module.exports.home = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	return res.render('home', {
		title: 'Authentication',
	});
}

module.exports.dashboard = (req, res) => {
	return res.render('dashboard', {
		title: 'Dashboard',
		user: req.user
	});
}