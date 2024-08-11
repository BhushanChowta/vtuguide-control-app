// models/ActionLog.js
const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
  },
  blogId: {
    type: String,
  },
  postId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ActionLog = mongoose.model('ActionLog', actionLogSchema);

module.exports = ActionLog;
