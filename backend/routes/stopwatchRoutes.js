const express = require('express');
const router = express.Router();
const Stopwatch = require('../models/stopwatchModel');
const Activity = require('../models/Activity'); // Ensure you have this model

// Route to start or update the stopwatch time for an activity
router.post('/update-time', async (req, res) => {
  const { activityId, time, username } = req.body;

  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    let stopwatch = await Stopwatch.findOne({ activityId, username });

    if (stopwatch) {
      stopwatch.minutes += time;
      await stopwatch.save();
    } else {
      stopwatch = new Stopwatch({
        activityId,
        activityName: activity.activityName,
        minutes: time,
        username, // Store username
      });
      await stopwatch.save();
    }

    res.status(200).json({ message: `Stopwatch for activity ${activityId} updated`, minutes: stopwatch.minutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating stopwatch time', error });
  }
});


// Route to get stopwatches for a specific user
router.get('/all', async (req, res) => {
  const { username } = req.query; // Retrieve username from query parameters

  try {
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const stopwatches = await Stopwatch.find({ username }); // Filter by username
    const totalMinutes = stopwatches.reduce((sum, stopwatch) => sum + stopwatch.minutes, 0);
    res.status(200).json({ stopwatches, totalMinutes });
  } catch (error) {
    console.error('Error fetching all stopwatch data:', error);
    res.status(500).json({ message: 'Error fetching stopwatch data', error });
  }
});

module.exports = router;
