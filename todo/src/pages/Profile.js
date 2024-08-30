import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
// import ProgressBar from './ProgressBar'; // Import the ProgressBar component
import './Profile.css'; // Import the CSS file

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
    <div className="profile-container">
      
      <h2 className="profile-welcome">Welcome, {username}!</h2>
      {error && (
        <p className="profile-error">{error}</p>
      )}
      <div className="profile-content">
        <div className="xp-info">
          <p>Total XP Earned: 
            <span className="xp-value"> {totalXP}</span>
          </p>
        </div>
      
        <div className="activity-details">
          <h2 className="details-title">Activity Details</h2>
          {stopwatches.length > 0 ? (
            <ul className="stopwatch-list">
              {stopwatches.map(stopwatch => (
                <li key={stopwatch._id} className="stopwatch-item">
                  <h3 className="activity-name">{stopwatch.activityName}</h3>
                  <p className="xp-earned">XP Earned: {stopwatch.minutes}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No stopwatch data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
