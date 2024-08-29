import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import ProgressBar from './ProgressBar'; // Import the ProgressBar component

const Profile = () => {
  const { username } = useContext(AuthContext);
  const [stopwatches, setStopwatches] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [error, setError] = useState(null);

  const updateLeaderboard = async (username, totalXP) => {
    try {
      await axios.post('https://todo-8.onrender.com/api/leaderboard/update', {
        username,
        totalXP,
      });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };

  useEffect(() => {
    const fetchStopwatchData = async () => {
      try {
        const response = await axios.get('https://todo-8.onrender.com/api/stopwatches/all', {
          params: { username }
        });
        setStopwatches(response.data.stopwatches);
        setTotalXP(response.data.totalMinutes);
      } catch (error) {
        console.error('Error fetching stopwatch data:', error);
        setError('Unable to fetch stopwatch data. Please try again later.');
      }
    };

    if (username) {
      fetchStopwatchData();
    }
  }, [username]);

  useEffect(() => {
    if (username && totalXP > 0) {
      updateLeaderboard(username, totalXP);
    }
  }, [username, totalXP]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">Profile</h1>
      <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">Welcome, {username}!</h2>
      {error && (
        <p className="text-red-500 text-center mb-6">{error}</p>
      )}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <div className="text-center mb-6">
          <p className="text-2xl font-semibold text-gray-700">
            Total XP Earned: 
            <span className="text-3xl font-bold text-blue-600"> {totalXP}</span>
          </p>
        </div>
        <ProgressBar xp={totalXP} />
        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Activity Details</h2>
          {stopwatches.length > 0 ? (
            <ul className="list-none space-y-4">
              {stopwatches.map(stopwatch => (
                <li key={stopwatch._id} className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-800">{stopwatch.activityName}</h3>
                  <p className="text-lg font-medium text-gray-600">XP Earned: {stopwatch.minutes}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No stopwatch data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
