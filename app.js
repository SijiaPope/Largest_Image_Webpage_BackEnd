const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const index = require('./routes/index');
const bodyParser = require("body-parser");

// defines configuration
require('dotenv').config();

const app = express(); // initialize express

app.use(logger('dev'));
app.use(bodyParser.json()); // allows to attach/ send data in the body of request 
app.use(bodyParser.urlencoded({extended:false}));

// create a session 
app.set('trust proxy', 1);
app.use(session({
    name: 'URLapp',
    secret: process.env.SESSION_SECRET || 'coocoocachoo',
    cookie: { secure: true, maxAge: (24 * 60 * 60 * 1000) },
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

//sets cors policy, allows to make request to this backend server 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", `*`);
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT, OPTIONS");
    next();
  });

// tells the app that there is a route at / and the router is index 
app.use("/", index);

// throws an error for unknown urls 
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;