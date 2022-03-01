const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;

const app = express();

// For form data
app.use(express.urlencoded({extended: true}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
app.use('/', require('./routes'));

app.listen(PORT, () => {
	console.log(`Server up and running on port ${PORT}`);
});