/* eslint-disable no-console */
const express = require('express');
const passport = require('passport');
const User = require('../models/users');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing');
});

router.get('/register', (req, res) => {
  res.render('register');
});

// Handle Register form
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line consistent-return
  // eslint-disable-next-line no-unused-vars
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.render('register');
    }
    return passport.authenticate('local')(req, res, () => {
      req.flash('success', `Thanks for signing up ${user.username}!`);
      res.redirect('/campgrounds');
    });
  });
});

// Show Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle Login Form
router.post('/login', passport.authenticate('local',
  { // Middleware
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    // eslint-disable-next-line no-unused-vars
  }), (req, res) => { });

// Logout route
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'Logout Successful');
  res.redirect('/campgrounds');
});

module.exports = router;
