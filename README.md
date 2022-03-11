# Authentication
Authenticate users using local (email/password) and Google authentication.

# Tech Stack
1. Node.js
2. Express.js
3. EJS
4. Tailwind CSS
5. MongoDB

# Hosting
This project is hosted at: https://sw-node-auth.herokuapp.com/

# Run This Project Locally
## Prerequisites
1. Install node and npm.
2. Install MongoDB and optionally, a frontend like MongoDB Compass or Robo3T.

## Setup
### 1. Clone this repository and change into the directory:
```
git clone https://github.com/wsuyash/nodejs-authentication.git
cd nodejs-authentication/
```
### 2. Install the dependencies:
```
npm install
```
### 3. Create a file called '.env' and add the following lines:
```
<!-- You can get the following two from a random key generating website -->
SESSION_SECRET=<a random string>
JWT_SECRET=<a random string>

<!-- This is optional, add this if you want to connect to an online instance of MongoDB -->
MONGODB_URI=<the URI provided by the MongoDB instance provider>

<!-- The following two have to be generated from Google -->
GOOGLE_CLIENT_ID=<get this by registering your app on Google Cloud Platform>
GOOGLE_CLIENT_SECRET=<get this by registering your app on Google Cloud Platform>

GOOGLE_CALLBACK_URL=http://localhost:3000/users/auth/google/redirect

<!-- The following two have to be generated from Google's reCaptcha -->
RECAPTCHA_SITE_KEY=<get this from Google's reCaptcha website>
RECAPTCHA_SECRET_KEY=<get this from Google's reCaptcha website>

EMAIL=<gmail you'll use to send mails to users> Ex: abc@gmail.com
EMAIL_USERNAME=<gmail username> Ex: abc
EMAIL_PASSWORD=<password for the email mentioned above>

RESET_LINK_LOCAL=http://localhost:3000
```
### 4. Start The Server:
```
npm start
```

### The server should now be running at http://localhost:3000

### The local instance of MongoDB should be running at mongodb://localhost:27017/auth. Check with MongoDB GUI like MongoDB Compass or Robo3T.

# Directory Structure
```
.
├── config
│   ├── flash-middleware.js
│   ├── mongoose.js
│   ├── nodemailer.js
│   ├── passport-google-oauth.js
│   └── passport-local.js
├── controllers
│   ├── dashboard_controller.js
│   ├── home_controller.js
│   └── users_controller.js
├── index.js
├── mailers
│   └── reset_password_mailer.js
├── models
│   └── User.js
├── package.json
├── package-lock.json
├── public
│   ├── css
│   │   ├── input.css
│   │   └── output.css
│   └── images
│       ├── authentication.png
│       ├── google-logo.png
│       ├── login.png
│       └── register.png
├── README.md
├── routes
│   ├── dashboard.js
│   ├── index.js
│   └── users.js
├── tailwind.config.js
└── views
    ├── change-password.ejs
    ├── dashboard.ejs
    ├── forgot-password.ejs
    ├── home.ejs
    ├── layout.ejs
    ├── login.ejs
    ├── mailers
    │   └── reset_password.ejs
    ├── register.ejs
    └── reset-password.ejs

10 directories, 33 file
```