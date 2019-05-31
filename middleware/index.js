const midWare = {};

const Campground = require('../models/campgrounds');
const Comment = require('../models/comments');

midWare.checkOwner = (req, res, next) => {
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

midWare.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
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
