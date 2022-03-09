const nodeMailer = require('../config/nodemailer');

module.exports.resetPasswordLink = (email) => {
	nodeMailer.transporter.sendMail(
		{
			from: `Nodejs Authentication ${process.env.EMAIL}`,
			to: email,
			subject: 'New Mail Test',
			html: '<h1>Does this work?</h1>'
		},
		(err, info) => {
			if (err) {
				console.log(err);
				return;
			}
		}
	);
}