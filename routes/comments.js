/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const express = require('express');
const Campground = require('../models/campgrounds');
const Comment = require('../models/comments');

const router = express.Router({ mergeParams: true });

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // REMEMBER TO ALWAYS INVOKE NEXT ON RETURN OR NOTHING HAPPENS.
  }
  return res.redirect('/login');
}

const checkOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .exec((err, found) => {
        if (err) {
          res.redirect('back');
        }
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      });
  } else { res.redirect('back'); }
};

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

// Comment edit route
router.get('/:comment_id/edit', (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log(err);
      return res.redirect('back');
    }
    return res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
  });
});

// Comment update route
router.put('/:comment_id', (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      return res.redirect('back');
    }
    console.log(`this is the author ${updatedComment.username}`);
    return res.redirect(`/campgrounds/${req.params.id}/`);
  });
});

// Destroy route
router.delete('/:comment_id', (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      return res.redirect('back');
    }
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});


module.exports = router;
