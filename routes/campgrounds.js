/* eslint-disable no-console */
const express = require('express');
const Campground = require('../models/campgrounds');

const router = express.Router();

// INDEX ROUTE
router.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/campgrounds', { campgrounds, currentUser: req.user });
    }
  });
}); //

// CREATE ROUTE
router.post('/campgrounds', (req, res) => {
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

router.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// Show Route
router.get('/campgrounds/:id', (req, res) => {
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

module.exports = router;
