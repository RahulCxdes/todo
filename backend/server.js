const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const stopwatchRoutes = require('./routes/stopwatchRoutes');
const settingsRouter = require('./routes/settings');
const leaderboardRoutes = require('./routes/leaderboard');
const { OpenAI } = require('openai');

require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  console.log('Received prompt:', prompt); // Log received prompt

  if (!prompt) {
    return res.status(400).send('Prompt is required.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    console.log('OpenAI response:', completion.data); // Log OpenAI response
    res.send(completion.data.choices[0].message.content);
  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching response.');
  }
});





mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/stopwatches', stopwatchRoutes);
app.use('/api/settings', settingsRouter);
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes');
// const activityRoutes = require('./routes/activityRoutes');
// const stopwatchRoutes = require('./routes/stopwatchRoutes');
// const settingsRouter = require('./routes/settings');
// const leaderboardRoutes = require('./routes/leaderboard');
// const { OpenAI } = require('openai');

// // const connectivityRoutes = require('./routes/connectivityRoutes'); // Connectivity routes

// require('dotenv').config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
// });

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors({
//   origin: '*',  // Frontend address
//   credentials: true,  // If you're using sessions
// }));

// app.use(bodyParser.json());

// app.post("/chat", async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const completion = await openai.completions.create({
//       model: "text-davinci-003",
//       max_tokens: 512,
//       temperature: 0,
//       prompt: prompt,
//     });
//     res.send(completion.choices[0].text);
//   } catch (error) {
//     console.error('Error fetching response from OpenAI:', error);
//     res.status(500).send('Error fetching response.');
//   }
// });

// // Connect to MongoDB Atlas
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// // Use Routes
// app.use('/api/users', userRoutes);       // For user registration and login
// app.use('/api/activities', activityRoutes); // For activity tracking
// app.use('/api/stopwatches', stopwatchRoutes); // For stopwatch functionality
// app.use('/api/settings', settingsRouter); // For settings related routes
// app.use('/api/leaderboard', leaderboardRoutes); // For leaderboard functionality
// // app.use('/api/connectivity', connectivityRoutes); // For connectivity-related routes

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
