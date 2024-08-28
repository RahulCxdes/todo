// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  currentDay: { type: Number, required: true },
  lastUpdate: { type: Date, required: true },
});

module.exports = mongoose.model('Settings', settingsSchema);
