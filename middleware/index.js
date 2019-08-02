const midWare = {};

const Campground = require('../models/campgrounds');
const Comment = require('../models/comments');

midWare.checkOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .exec((err, found) => {
        if (err) {
          req.flash('error', 'Camgpground, not found.');
          res.redirect('back');
        }
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'you don\'t have permission to do that.');
          res.redirect('back');
        }
      });
  } else {
    req.flash('error', 'you need to be logged in to do that.');
    res.redirect('back');
  }
};

midWare.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'you need to be logged in, to do that.');
  return res.redirect('/login');
};

midWare.checkComment = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id)
      .exec((err, foundComment) => {
        if (err) {
          res.redirect('back');
        }
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      });
  } else { res.redirect('back'); }
};

module.exports = midWare;
