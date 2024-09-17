import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const Connect = () => {
  const { username: currentUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stopwatches, setStopwatches] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Handle searching for users
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setUserList([]);
      return;
    }

    try {
      const response = await axios.get(`https://todo-activity-3vta.onrender.com/api/users/search`, { params: { query } });
      setUserList(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Unable to fetch users. Please try again later.');
    }
  };

  // Fetch the selected user's stopwatch data and follow status
  const fetchStopwatchData = async (user) => {
    try {
      const response = await axios.get(`https://todo-activity-3vta.onrender.com/api/stopwatches/all`, {
        params: { username: user }
      });
      setStopwatches(response.data.stopwatches);
      setTotalXP(response.data.totalMinutes);
      setFollowers(response.data.stopwatches[0]?.followers.length || 0);
      setFollowing(response.data.stopwatches[0]?.following.length || 0);
      setSelectedUser(user);

      // Check if the current user is already following the selected user
      setIsFollowing(response.data.stopwatches[0]?.followers.includes(currentUser));
    } catch (error) {
      console.error('Error fetching stopwatch data:', error);
      setError('Unable to fetch stopwatch data. Please try again later.');
    }
  };

  // Handle follow action
  const handleFollow = async () => {
    try {
      const response = await axios.post('https://todo-activity-3vta.onrender.com/api/stopwatches/follow', {
        usernameToFollow: selectedUser,
        currentUser,
      });
      if (response.status === 200) {
        setFollowers((prev) => prev + 1);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following user:', error);
      setError('Error following user');
    }
  };

  // Handle unfollow action
  const handleUnfollow = async () => {
    try {
      const response = await axios.post('https://todo-activity-3vta.onrender.com/api/stopwatches/unfollow', {
        usernameToUnfollow: selectedUser,
        currentUser,
      });
      if (response.status === 200) {
        setFollowers((prev) => prev - 1);
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setError(`Error unfollowing user: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Connect with Users</h2>

      {/* Search Bar */}
      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Display User List */}
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
        {userList.length > 0 ? (
          <ul className="space-y-3">
            {userList.map((user) => (
              <li
                key={user._id}
                className="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer transition"
                onClick={() => fetchStopwatchData(user.username)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      {/* Display Stopwatch Data for Selected User */}
      {selectedUser && (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{selectedUser}'s Stopwatch Data</h3>
          <p className="text-gray-700 mb-2">Followers: {followers}</p>
          <p className="text-gray-700 mb-2">Following: {following}</p>

          {stopwatches.length > 0 ? (
            <ul className="space-y-3">
              {stopwatches.map((stopwatch) => (
                <li key={stopwatch._id} className="p-3 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold">{stopwatch.activityName}</h4>
                  <p>XP Earned: {stopwatch.minutes}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No stopwatch data available for {selectedUser}.</p>
          )}

          <p className="text-gray-700 mt-4">Total XP Earned: {totalXP}</p>

          {/* Follow/Unfollow Button */}
          {selectedUser !== currentUser && (
            <div className="mt-6">
              {!isFollowing ? (
                <button
                  onClick={handleFollow}
                  className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition"
                >
                  Follow {selectedUser}
                </button>
              ) : (
                <button
                  onClick={handleUnfollow}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  Unfollow {selectedUser}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Connect;
