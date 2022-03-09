// Imports
const nodeMailer = require('../config/nodemailer');

// Send reset password link to email
module.exports.resetPasswordLink = (user, resetLink) => {
	// Get email template
	let htmlString = nodeMailer.renderTemplate({ user: user, link: resetLink  }, '/mailers/reset_password.ejs');

	// Send email
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