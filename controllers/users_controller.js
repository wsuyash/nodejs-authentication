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