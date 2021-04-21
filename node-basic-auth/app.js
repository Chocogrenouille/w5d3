// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// session configuration
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./db/index');

app.use(
  session({
    secret: process.env.SECRET_ID,
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
)

// default value for title local
app.locals.title = 'Understanding authentication & authorisation';

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const signup = require('./routes/signup');
app.use('/', signup);

const login = require('./routes/login');
app.use('/', login);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
