import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';  // Import AuthContext
import './snakeStyle.css';  // Import the CSS file

const Dashboard = () => {
  const { username } = useContext(AuthContext); // Access username from AuthContext
  const [activityName, setActivityName] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // POST request to add the activity
      const response = await axios.post('https://todo-8.onrender.com/api/activities/add-activity', {
        activityName,
        totalDays: parseInt(totalDays),
        username,
        day: 1  // Explicitly pass day 1
      });

      if (response.status === 201) {
        setSuccessMessage('Activity added successfully!');
        setActivityName('');
        setTotalDays('');
      }
    } catch (error) {
      console.error('Error adding activity:', error.response ? error.response.data : error.message);
      setSuccessMessage('Failed to add activity. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen bg-custom p-10 relative">
      {/* Container for the snake and the box */}
      <div className="box-container">
        <div className="rules-box">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Activity Tracker Rules</h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            <li>1 XP for every minute of activity per day.</li>
            <li>Accumulate XP based on the time spent each day.</li>
            <li>Your avatar will level up as you gain more XP.</li>
            <li>Keep track of your progress and challenge yourself!</li>
          </ul>
        </div>

        <div className="snake-container">
          <svg className="snake" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M10,50 Q20,20 40,20 Q60,20 70,50 Q80,80 60,80 Q40,80 30,50 Q20,20 10,50 Z" />
          </svg>
        </div>
      </div>

      {/* Activity Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Activity</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="activityName" className="block text-gray-700 text-lg font-bold mb-2">Activity</label>
            <input
              type="text"
              id="activityName"
              name="activityName"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="Enter your activity"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="totalDays" className="block text-gray-700 text-lg font-bold mb-2">Total Days</label>
            <input
              type="number"
              id="totalDays"
              name="totalDays"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              placeholder="Enter total days"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add Activity
          </button>
        </form>

        {successMessage && (
          <p className="text-green-500 mt-4 text-center">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
