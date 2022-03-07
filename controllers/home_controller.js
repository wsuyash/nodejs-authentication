module.exports.index = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	return res.render('home', {
		title: 'Authentication',
	});
}