// Imports
const mongoose = require('mongoose');

// Create user Schema
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Export User Model
module.exports = User;