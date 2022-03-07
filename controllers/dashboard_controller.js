module.exports.index = (req, res) => {
	return res.render('dashboard', {
		title: 'Dashboard',
		user: req.user
	});
}