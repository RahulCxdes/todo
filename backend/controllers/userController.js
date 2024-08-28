const User = require('../models/userModel');

// Register a new user
const registerUser = async (req, res) => {
  const { username, password, age, gender } = req.body;

  try {
    const newUser = new User({ username, password, age, gender });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

module.exports = { registerUser };
