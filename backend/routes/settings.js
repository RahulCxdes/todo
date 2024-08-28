// routes/settings.js
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get the current day
router.get('/current-day', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create initial record if none exists
      settings = new Settings({ currentDay: 1, lastUpdate: new Date() });
      await settings.save();
    } else {
      // Update day if needed
      const now = new Date();
      const dayDiff = Math.floor((now - settings.lastUpdate) / (1000 * 60 * 60 * 24));

      if (dayDiff > 0) {
        settings.currentDay += dayDiff;
        settings.lastUpdate = now;
        await settings.save();
      }
    }
    res.json({ currentDay: settings.currentDay });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
