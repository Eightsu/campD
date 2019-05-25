/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const express = require('express');
const Campground = require('../models/campgrounds');
const Comment = require('../models/comments');

const router = express.Router({ mergeParams: true });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // REMEMBER TO ALWAYS INVOKE NEXT ON RETURN OR NOTHING HAPPENS.
  }
  res.redirect('/login');
}

router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

router.post('/', isLoggedIn, (req, res) => {
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
          // Add username, id to comments.
          // eslint-disable-next-line no-param-reassign
          // eslint-disable-next-line no-underscore-dangle
          comment.author.id = req.user._id;
          // eslint-disable-next-line no-param-reassign
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          // eslint-disable-next-line no-underscore-dangle
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});


module.exports = router;
