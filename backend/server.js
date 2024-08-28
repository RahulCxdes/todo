
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const stopwatchRoutes = require('./routes/stopwatchRoutes');
const settingsRouter = require('./routes/settings');
const leaderboardRoutes = require('./routes/leaderboard');
// const dailyProgressRoutes = require('./routes/dailyprogressRoutes'); // New route

const app = express();
const port = process.env.PORT || 5000;



app.use(cors({
  origin: '*',  // Frontend address
  credentials: true,  // If you're using sessions
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));

// Use Routes
app.use('/api/users', userRoutes);       // For user registration and login
app.use('/api/activities', activityRoutes); // For activity tracking
app.use('/api/stopwatches', stopwatchRoutes);
app.use('/api/settings', settingsRouter);
app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/dailyProgress', dailyProgressRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
