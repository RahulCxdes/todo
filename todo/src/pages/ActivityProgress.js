import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Stopwatch from './Stopwatch';

const ActivityProgress = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchActivities = async () => {
      try {
        const response = await axios.get('https://todo-activity-3vta.onrender.com/api/activities/activities', {
          params: { username },
        });
        const updatedActivities = response.data.map(activity => ({
          ...activity,
          day: Math.min(activity.day, activity.totalDays),
        }));
        setActivities(updatedActivities);
      } catch (error) {
        setError(error.response?.data?.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [isLoggedIn, username]);

  const calculateProgress = (activity) => {
    const progressPercentage = Math.min(100, Math.round((activity.day / activity.totalDays) * 100));
    return progressPercentage;
  };

  const handleGetInfo = (activityName) => {
    // Navigate to the ActivityInfo page with the activityName as a route parameter
    navigate(`/activity-info/${activityName}`);
  };

  const handleStopwatchStop = (activityId, time) => {
    console.log(`Activity ${activityId} took ${time} minutes`);
  };

  const handleDelete = async (activityId) => {
    try {
      await axios.delete(`https://todo-activity-3vta.onrender.com/api/activities/${activityId}`);
      setActivities(activities.filter(activity => activity._id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
      setError('Failed to delete the activity. Please try again.');
    }
  };

  const handleRedo = () => {
    // Optionally, handle redo logic here
  };

  const isTerminated = (activity) => activity.day >= activity.totalDays;

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Your Activities</h2>
      <div className="text-center text-xl font-semibold text-white mb-8">Username: {username}</div>
      <div className="space-y-8 max-w-5xl mx-auto">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const progressPercentage = calculateProgress(activity);
            const isActivityTerminated = isTerminated(activity);
            const streakCount = activity.streakCount || 0; // Display streak count
            const lastActivityDate = activity.lastActivityDate
              ? new Date(activity.lastActivityDate).toLocaleDateString()
              : 'N/A'; // Format lastActivityDate

            return (
              <div
                key={activity._id}
                className={`p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 bg-gradient-to-r from-yellow-400 to-green-300 border-green-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{activity.activityName}</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                      onClick={() => handleGetInfo(activity.activityName)}
                    >
                      Get Info
                    </button>
                    {isActivityTerminated && (
                      <>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                          onClick={handleRedo}
                        >
                          Redo
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                          onClick={() => handleDelete(activity._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-lg text-white">
                  <p className="mb-1">Total Days: {activity.totalDays}</p>
                  <p className="mb-1">Current Day: {activity.day}</p>
                  <p className="mb-1">Streak Count: {streakCount}</p> {/* Display streak count */}
                  <p className="mb-1">Last Activity Date: {lastActivityDate}</p> {/* Display last activity date */}
                </div>
                {!isActivityTerminated && (
                  <Stopwatch
                    activityId={activity._id}
                    onStop={(time) => handleStopwatchStop(activity._id, time)}
                  />
                )}
                <div className="relative w-full bg-gray-300 rounded-full h-6 mt-4 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 bg-green-600 h-full text-xs text-white text-center leading-6"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    {progressPercentage}%
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-white text-lg">No activities found. Add activities to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ActivityProgress;
