const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();


// POST route to add new activity
router.post('/add-activity', async (req, res) => {
  try {
    const { activityName, totalDays, username } = req.body;

    if (!activityName || !totalDays || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newActivity = new Activity({
      activityName,
      totalDays,
      username,
      day: 1,
      lastActivityDate: new Date(), // Set current date as the initial last activity date
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error saving activity:', error);
    res.status(500).json({ message: 'Error saving activity', error });
  }
});

// Route to get activities for a specific user, updating their days based on the last update
router.get('/activities', async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Fetch activities for the user
    const activities = await Activity.find({ username });

    const now = new Date();

    // Iterate over each activity to update its day and streak based on the last update
    for (const activity of activities) {
      const lastUpdate = activity.lastActivityDate || now;
      const dayDiff = Math.floor((now - new Date(lastUpdate)) / (1000 * 60 * 60 * 24));  // Calculate the difference in days

      if (dayDiff > 0) {
        // Update activity day
        activity.day = Math.min(activity.day + dayDiff, activity.totalDays);

        // Update streak
        if (dayDiff > 1) {
          activity.streakCount = 0;  // Reset streak if more than 1 day has passed
        } else {
          activity.streakCount = (activity.streakCount || 0) + 1; // Increment the streak
        }

        // Update the last activity date to the current time
        activity.lastActivityDate = now;

        await activity.save();  // Save the updated activity
      }
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities and updating days:', error);
    res.status(500).json({ message: 'Error fetching activities and updating days', error });
  }
});
// DELETE route to remove an activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Activity ID is required' });
    }

    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error deleting activity', error });
  }
});

module.exports = router;
