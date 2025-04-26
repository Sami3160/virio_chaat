const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionLink: {
    typr:String,
    required: true
  },
  chatLink: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);