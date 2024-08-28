const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityName: { type: String, required: true },
  totalDays: { type: Number, required: true },
  username: { type: String, required: true },
  day: { type: Number, default: 1 }, // The current day of the activity
  lastUpdate: { type: Date, default: Date.now }, // Last time this activity was updated
});

module.exports = mongoose.model('Activity', activitySchema);
