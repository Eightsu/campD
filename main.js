/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');

const port = 3000;
const app = express();

const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const User = require('./models/users');
const Campground = require('./models/campgrounds');
const Comment = require('./models/comments');
const seedDB = require('./seeds');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/auth');


seedDB();

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'passwordish',
  resave: 'false',
  saveUninitialized: 'false',
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//-----------------------

mongoose.connect('mongodb://localhost:27017/su_camp', {
  useNewUrlParser: true,
});
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware

// Pass user on all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(authRoutes, campgroundRoutes, commentRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
