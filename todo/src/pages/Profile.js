import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const Profile = () => {
  const { username: currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [totalXP, setTotalXP] = useState(0);

  // Update leaderboard with username and totalXP
  const updateLeaderboard = async (username, totalXP) => {
    try {
      await axios.post('https://todo-activity-3vta.onrender.com/api/leaderboard/update', {
        username,
        totalXP,
      });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };

  // Fetch the profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://todo-activity-3vta.onrender.com/api/stopwatches/profile', {
          params: { username: currentUser }
        });
        setUserData(response.data);
        setTotalXP(response.data.totalXP); // Set totalXP from the fetched data
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Unable to fetch profile data. Please try again later.');
      }
    };

    fetchProfileData();
  }, [currentUser]);

  // Update leaderboard when username or totalXP changes
  useEffect(() => {
    if (currentUser && totalXP > 0) {
      updateLeaderboard(currentUser, totalXP);
    }
  }, [currentUser, totalXP]);

  return (
    <div className="profile-container p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 min-h-screen flex justify-center items-center">
      <div className="max-w-4xl w-full bg-gradient-to-r to-pink-500 via-gray-100 to-gray-200 shadow-2xl rounded-lg p-8 space-y-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">Profile</h2>

        {/* Display User Profile Data */}
        {userData ? (
          <div className="profile-data space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">{currentUser}'s Profile</h3>
              <div className="flex justify-center space-x-4 text-gray-600">
                <p>Followers: <span className="font-bold">{userData.followers.length}</span></p>
                <p>Following: <span className="font-bold">{userData.following.length}</span></p>
              </div>
            </div>

            {/* Display Stopwatch Data */}
            <div className="stopwatch-data bg-gray-50 rounded-lg p-6 shadow-inner">
              <h4 className="text-xl font-medium text-gray-700 mb-4">Stopwatch Data</h4>
              {userData.stopwatches.length > 0 ? (
                <ul className="space-y-4">
                  {userData.stopwatches.map((stopwatch) => (
                    <li key={stopwatch._id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                      <h5 className="font-semibold text-lg text-gray-800">{stopwatch.activityName}</h5>
                      <p className="text-sm text-gray-600">XP Earned: {stopwatch.minutes}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No stopwatch data available.</p>
              )}
              <p className="text-lg font-bold text-gray-700 mt-4">Total XP Earned: {userData.totalXP}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading profile data...</p>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Profile;
