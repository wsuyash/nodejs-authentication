// Imports
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Transporter, i.e., sender info
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

// Mail template setup
let renderTemplate = (data, relativePath) => {
	let mailHtml;

	ejs.renderFile(
		path.join(__dirname, '../views', relativePath),
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

// Exports
module.exports = {
	transporter: transporter,
	renderTemplate: renderTemplate
}