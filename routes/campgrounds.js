/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');
const Campground = require('../models/campgrounds');
const Comment = require('../models/comments');

const router = express.Router();

// Middleware

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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

// INDEX ROUTE
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/campgrounds', { campgrounds, currentUser: req.user });
    }
  });
});

// CREATE ROUTE
router.post('/', isLoggedIn, (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };


  const newCamp = {
    name,
    image,
    description: desc,
    author,
  };

  Campground.create(newCamp, (err) => {
    if (err) {
      return console.error();
    }
    return res.redirect('/campgrounds'); // refresh page back to campgrounds.
  });

  // campSites.push(newCamp); // Add new camp to list.
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Show Route
router.get('/:id', (req, res) => {
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

// Edit Campground
router.get('/:id/edit', checkOwner, (req, res) => {
  Campground.findById((req.params.id, (err, found) => {
    res.render('campgrounds/edit', { campground: found });
  }));
});

// Update Campground
router.put('/:id', checkOwner, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
    if (err) {
      console.log(err, updatedCamp);
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Destroy Campground
router.delete('/:id', checkOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
    if (err) {
      console.log(err);
    }
    Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, () => {
      if (err) {
        console.log(err);
      }
      res.redirect('/campgrounds');
    });
  });
});


module.exports = router;
