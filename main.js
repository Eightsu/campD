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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // REMEMBER TO ALWAYS INVOKE NEXT ON RETURN OR NOTHING HAPPENS.
  }
  res.redirect('/login');
}

app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX ROUTE
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/campgrounds', { campgrounds, currentUser: req.user });
    }
  });
}); //

// CREATE ROUTE
app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const desc = req.body.description;

  const newCamp = {
    name,
    image,
    description: desc,
  };

  Campground.create(newCamp, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds'); // refresh page back to campgrounds.
    }
  });

  // campSites.push(newCamp); // Add new camp to list.
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// Show Route
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, found) => {
      if (err) {
        console.log(err);
      } else {
        console.log(found);
        res.render('campgrounds/show', { campground: found });
      }
    });
});


app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      console.log(req.body.comment);
      // eslint-disable-next-line no-shadow
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          // eslint-disable-next-line no-underscore-dangle
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// AUTH ROUTES

// Register
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle Register form
app.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line consistent-return
  // eslint-disable-next-line no-unused-vars
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('/register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// Show Login Form
app.get('/login', (req, res) => { res.render('login'); });

// Handle Login Form
app.post('/login', passport.authenticate('local',
  { // Middleware
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    // eslint-disable-next-line no-unused-vars
  }), (req, res) => { });

// Logout route
app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/campgrounds');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
