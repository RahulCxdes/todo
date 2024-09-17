// routes/userRoutes.js

const express = require('express');
const User = require('../models/userModel');

const router = express.Router();




// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password, age, gender } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already present' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({
      username,
      email,
      password,
      age,
      gender
    });

    await newUser.save();
    res.status(200).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Direct password comparison (plain text)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send back user data including username
    res.status(200).json({
      message: 'Login successful!',
      user: { username: user.username, email: user.email } // Sending username
    });
  } catch (error) {
    console.error('Error logging in:', error.message); // Log error message
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


// Follow a user
router.post('/follow', async (req, res) => {
  const { currentUser, userToFollow } = req.body;

  try {
    const current = await User.findOne({ username: currentUser });
    const target = await User.findOne({ username: userToFollow });

    if (!current.following.includes(userToFollow)) {
      current.following.push(userToFollow);
      target.followers.push(currentUser);

      await current.save();
      await target.save();
      res.status(200).json({ message: 'User followed successfully' });
    } else {
      res.status(400).json({ message: 'Already following' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error });
  }
});

// Search users
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    }).limit(10);
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users', error });
  }
});

module.exports = router;

