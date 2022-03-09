const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.google.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD
	}
});

let renderTemplate = (data, relativePath) => {
	let mailHtml;

	ejs.renderFile(
		path.join(__dirname, '../views/mailers', relativePath),
		data,
		(err, template) => {
			if (err) {
				console.log('Error', err);
				return;
			}

			mailHtml = template;
			return;
		}
	)

	return mailHtml;
}

module.exports = {
	transporter: transporter,
	renderTemplate: renderTemplate
}