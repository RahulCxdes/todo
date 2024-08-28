// routes/userRoutes.js

const express = require('express');
const User = require('../models/userModel');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password, age, gender } = req.body;

  try {
    const newUser = new User({
      username,
      email,  // Ensure this is correctly included
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

/// routes/userRoutes.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send back user data including username
    res.status(200).json({
      message: 'Login successful!',
      user: { username: user.username, email: user.email } // Sending username
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});


module.exports = router;
