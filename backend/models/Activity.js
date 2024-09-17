const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityName: String,
  totalDays: Number,
  day: { type: Number, default: 1 },
  email: String, // Store the user's email
  username: String, // Store the user's username
  streakCount: { type: Number, default: 0 }, // Add streak count
  lastActivityDate: { type: Date, default: null } // Track the last activity completion date
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
