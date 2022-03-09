const nodeMailer = require('../config/nodemailer');

module.exports.resetPasswordLink = (user, resetLink) => {
	let htmlString = nodeMailer.renderTemplate({ user: user, link: resetLink  }, '/mailers/reset_password.ejs');

	nodeMailer.transporter.sendMail(
		{
			from: `Nodejs Authentication ${process.env.EMAIL}`,
			to: user.email,
			subject: 'Reset Password',
			html: htmlString
		},
		(err, info) => {
			if (err) {
				console.log(err);
				return;
			}
		}
	);
}