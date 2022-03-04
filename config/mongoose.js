const mongoose = require('mongoose');

const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth'

mongoose.connect(mongoDbUri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', console.log.bind(console, 'MongoDB connected.'));

module.exports = db;