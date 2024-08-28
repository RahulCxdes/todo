// models/Leaderboard.js
const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  totalXP: { type: Number, required: true },
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
