// MODEL FOR COMMENTS
const mongoose = require('mongoose');

// Schema Set-Up
const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
});

module.exports = mongoose.model('Comment', commentSchema);
