const mongoose = require('mongoose');

const stopwatchSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
  activityName: { type: String },
  minutes: { type: Number, default: 0 },
  username: { type: String, required: true },
  followers: [{ type: String }], // Array of usernames following this user
  following: [{ type: String }]  // Array of usernames this user is following
});

module.exports = mongoose.model('Stopwatch', stopwatchSchema);
