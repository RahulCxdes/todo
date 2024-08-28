const mongoose = require('mongoose');

const stopwatchSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
  activityName: { type: String }, // Add this field
  minutes: { type: Number, default: 0 },
  username: { type: String, required: true } // Add this field
});

module.exports = mongoose.model('Stopwatch', stopwatchSchema);
