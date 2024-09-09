// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['NOT_REVIEWED', 'REVIEWED'], 
    default: 'NOT_REVIEWED' 
  },
  blogPostID: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
