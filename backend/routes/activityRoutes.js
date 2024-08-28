const express = require('express');
const Activity = require('../models/Activity');
const Settings = require('../models/Settings');
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
      day: 1  // Initialize with day 1
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

    // Iterate over each activity to update its day based on the last update
    for (const activity of activities) {
      const lastUpdate = activity.lastUpdate;
      const dayDiff = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));  // Calculate the difference in days

      if (dayDiff > 0 && activity.day < activity.totalDays) {
        // If days have passed and activity's day is less than totalDays
        activity.day = Math.min(activity.day + dayDiff, activity.totalDays);  // Increment the day, but don't exceed totalDays
        activity.lastUpdate = now;  // Update the lastUpdate to the current time
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




// // routes/activityRoutes.js

// const express = require('express');
// const Activity = require('../models/Activity');
// const router = express.Router();

// // POST route to add new activity
// router.post('/add-activity', async (req, res) => {
//   try {
//     const { activityName, totalDays, username } = req.body; // Include username

//     if (!activityName || !totalDays || !username) { // Check for username
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newActivity = new Activity({
//       activityName,
//       totalDays,
//       username // Save username
//     });

//     const savedActivity = await newActivity.save();
//     res.status(201).json(savedActivity);
//   } catch (error) {
//     console.error('Error saving activity:', error);
//     res.status(500).json({ message: 'Error saving activity', error });
//   }
// });


// // Route to get activities for a specific user
// router.get('/activities', async (req, res) => {
//   try {
//     // Assume the username is provided in the query parameters
//     const username = req.query.username;

//     if (!username) {
//       return res.status(400).json({ message: 'Username is required' });
//     }

//     const activities = await Activity.find({ username }); // Filter by username
//     res.status(200).json(activities);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching activities' });
//   }
// });

// module.exports = router;
