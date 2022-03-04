const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const path = require('path');
const PORT = process.env.PORT || 3000;

const passport = require('passport');
const passportLocal = require('./config/passport-local');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

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

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'some secret key',
	cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
	store: store,
	resave: false,
	saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes'));

app.listen(PORT, () => {
	console.log(`Server up and running on port ${PORT}`);
});