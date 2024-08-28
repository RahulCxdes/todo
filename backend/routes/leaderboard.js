// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');

// Route to update or create a leaderboard entry
router.post('/update', async (req, res) => {
  const { username, totalXP } = req.body;

  try {
    // Find the user's leaderboard entry or create a new one
    let leaderboardEntry = await Leaderboard.findOne({ username });

    if (leaderboardEntry) {
      // Update the user's total XP if the entry exists
      leaderboardEntry.totalXP = totalXP;
      await leaderboardEntry.save();
    } else {
      // Create a new leaderboard entry if it doesn't exist
      leaderboardEntry = new Leaderboard({ username, totalXP });
      await leaderboardEntry.save();
    }

    res.status(200).json({ message: 'Leaderboard updated', leaderboardEntry });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ message: 'Failed to update leaderboard', error });
  }
});



// Route to get all leaderboard entries sorted by totalXP in descending order
router.get('/all', async (req, res) => {
    try {
      const leaderboard = await Leaderboard.find().sort({ totalXP: -1 });
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      res.status(500).json({ message: 'Failed to fetch leaderboard data', error });
    }
  });

module.exports = router;
