const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  channelId: {
    type: String,
    required: false
  }
});

chatSessionSchema.index({ participants: 1 }, { unique: false }); // allow search by participants

module.exports = mongoose.model('Chat', chatSessionSchema);