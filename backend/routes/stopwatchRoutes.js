const express = require('express'); 
const Activity = require('../models/Activity');
const Settings = require('../models/Settings');
const Stopwatch = require('../models/stopwatchModel.js');
const User = require('../models/userModel');
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
      day: 1, // Initialize with day 1
      lastUpdate: new Date(), // Track when the activity was added
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error saving activity:', error);
    res.status(500).json({ message: 'Error saving activity', error });
  }
});



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


// Route to fetch users for Connect page
router.get('/users', async (req, res) => {
  try {
    const users = await Stopwatch.find(); // Fetch all users' data from stopwatch
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Route to follow a user
// Route to follow a user
router.post('/follow', async (req, res) => {
  try {
    const { usernameToFollow, currentUser } = req.body;

    if (!usernameToFollow || !currentUser) {
      return res.status(400).json({ message: 'Both usernames are required' });
    }

    // Update following list of the current user
    await Stopwatch.updateOne(
      { username: currentUser },
      { $addToSet: { following: usernameToFollow } }
    );

    // Update followers list of the user to be followed
    await Stopwatch.updateOne(
      { username: usernameToFollow },
      { $addToSet: { followers: currentUser } }
    );

    res.status(200).json({ message: 'Follow action successful' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Error following user', error });
  }
});

// In your Express router file

// Route to get activities for a specific user
router.get('/stopwatch/activities', async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const stopwatches = await Stopwatch.find({ username });

    if (!stopwatches.length) {
      return res.status(404).json({ message: 'No activities found for this user' });
    }

    res.status(200).json(stopwatches);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error });
  }
});

// Route to get profile data
router.get('/profile', async (req, res) => {
  const { username } = req.query;
  try {
    const stopwatches = await Stopwatch.find({ username });
    if (stopwatches.length === 0) {
      return res.status(404).json({ error: 'No data found for this user' });
    }

    // Compute total XP and counts
    const totalXP = stopwatches.reduce((sum, stopwatch) => sum + stopwatch.minutes, 0);
    const followers = stopwatches[0].followers || [];
    const following = stopwatches[0].following || [];

    res.json({
      stopwatches,
      totalXP,
      followers,
      following
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile data' });
  }
});



router.get('/connect', async (req, res) => {
  try {
    const { currentUser } = req.query;

    if (!currentUser) {
      return res.status(400).json({ message: 'Current user is required' });
    }

    // Fetch all users except the current one
    const allUsers = await Stopwatch.find({ username: { $ne: currentUser } });

    // Fetch current user's profile to check who they are following
    const currentUserProfile = await Stopwatch.findOne({ username: currentUser });

    res.status(200).json({
      allUsers,
      following: currentUserProfile.following
    });
  } catch (error) {
    console.error('Error fetching connect data:', error);
    res.status(500).json({ message: 'Error fetching connect data', error });
  }
});

router.post('/unfollow', async (req, res) => {
  try {
    const { usernameToUnfollow, currentUser } = req.body;
    console.log('Received data:', { usernameToUnfollow, currentUser }); // Add this line

    if (!usernameToUnfollow || !currentUser) {
      return res.status(400).json({ message: 'Both usernames are required' });
    }

    // Update following list of the current user
    await Stopwatch.updateOne(
      { username: currentUser },
      { $pull: { following: usernameToUnfollow } }
    );

    // Update followers list of the user to be unfollowed
    await Stopwatch.updateOne(
      { username: usernameToUnfollow },
      { $pull: { followers: currentUser } }
    );

    res.status(200).json({ message: 'Unfollow action successful' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
});


// Route to get user details including followers and following
router.get('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await Stopwatch.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});

module.exports = router;
