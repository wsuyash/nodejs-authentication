// Imports
const mongoose = require('mongoose');

// MongoDB URI
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth'

// Cnnect to MongoDB
mongoose.connect(mongoDbUri);

// Mongoose connection
const db = mongoose.connection;

// On connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// On successful connection
db.once('open', console.log.bind(console, 'MongoDB connected.'));

// Export database
module.exports = db;