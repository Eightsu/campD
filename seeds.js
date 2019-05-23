/* eslint-disable no-shadow */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');
const Comment = require('./models/comments');

const data = [
  {
    name: "Charlie's Valley",
    image: 'https://source.unsplash.com/WLUHO9A_xik/1600x900',
    description: 'Beautiful Rolling Hills.',
  },
  {
    name: 'Mesa Lake',
    image: 'https://source.unsplash.com/WLUHO9A_xik/1600x900',
    description: 'Tranquil waters',
  },
  {
    name: 'Burnaby Crutch',
    image: 'https://source.unsplash.com/WLUHO9A_xik/1600x900',
    description: 'Long drives, and calm winds.',
  },
];

// Remove all campgrounds
function seedDB() {
  Campground.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('removed Campgrounds.');
      Comment.deleteMany({ }, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('removed Comments.');
      });
    }
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added Campground.');
          Comment.create(
            {
              text: 'Absolutely breathtaking.',
              author: 'Jill Barnes',
            },
            (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Comment added.');
                campground.comments.push(comment);
                campground.save();
              }
            },
          );
        }
      });
    });
  });
}
module.exports = seedDB;
