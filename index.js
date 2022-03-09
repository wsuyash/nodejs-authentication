const express = require('express'); // Import express
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts
const db = require('./config/mongoose'); // Get database connection
const path = require('path'); // Import path
const PORT = process.env.PORT || 3000; // Port
const env = require('dotenv').config(); // Import dotenv config

// Import passport and session modules
const passport = require('passport');
const passportLocal = require('./config/passport-local');
const passportGoogle = require('./config/passport-google-oauth');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Import flash related modules
const flash = require('connect-flash');
const flashMiddleware = require('./config/flash-middleware');

// Initialize express app
const app = express();

// Create session store
const store = new MongoDBStore({
	uri: db._connectionString,
	collection: 'sessions'
}, (error) => {
	if (error) {
		return console.error(error);
	}

	return console.log('MongoDB session store connected');
});

// For form data
app.use(express.urlencoded({extended: true}));
// For json data
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Create session
app.use(session({
	secret: process.env.SESSION_SECRET,
	cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
	store: store,
	resave: false,
	saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize flash
app.use(flash());
app.use(flashMiddleware.setFlash);

// EJS
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// Set view engine
app.set('view engine', 'ejs');
// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes'));

// Start server
app.listen(PORT, () => {
	console.log(`Server up and running on port ${PORT} @ http://localhost:${PORT}`);
});