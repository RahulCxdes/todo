import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Stopwatch from './Stopwatch';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

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
        const response = await axios.get('https://todo-8.onrender.com/api/activities/activities', {
          params: { username },
        });
        const updatedActivities = response.data.map(activity => ({
          ...activity,
          day: activity.day <= activity.totalDays ? activity.day : activity.totalDays,
        }));
        setActivities(updatedActivities);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchActivities();
  }, [isLoggedIn, username]);

  const calculateProgress = (activity) => {
    const totalDays = activity.totalDays;
    const daysElapsed = activity.day;
    const progressPercentage = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
    return progressPercentage;
  };

  const handleStopwatchStop = (activityId, time) => {
    console.log(`Activity ${activityId} took ${time} minutes`);
  };

  const handleDelete = async (activityId) => {
    try {
      await axios.delete(`https://todo-8.onrender.com/api/activities/${activityId}`);
      setActivities(activities.filter(activity => activity._id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleRedo = (activityId) => {
    navigate('/dashboard');
  };

  const isTerminated = (activity) => {
    return activity.day >= activity.totalDays;
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 p-8">
      <h2 className="text-4xl font-bold text-white mb-6 text-center">Your Activities</h2>
      <div className="text-center text-xl font-semibold mb-6 text-white">Username: {username}</div>
      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className={`p-6 rounded-lg shadow-lg transform transition-transform ${
                isTerminated(activity) ? 'border-4 border-yellow-500 scale-105 bg-gradient-to-r from-yellow-100 to-yellow-300' : 'border-4 border-green-500 bg-white'
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{activity.activityName}</h3>
              <p className="text-lg text-gray-600 mb-2">Total Days: {activity.totalDays}</p>
              <p className="text-lg text-gray-600 mb-2">Current Day: {activity.day}</p>
              {isTerminated(activity) ? (
                <>
                  <p className="text-green-600 font-bold text-xl">Congratulations! Activity Completed</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mr-2" onClick={() => handleRedo(activity._id)}>
                    Redo
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg" onClick={() => handleDelete(activity._id)}>
                    Delete
                  </button>
                </>
              ) : (
                <Stopwatch activityId={activity._id} onStop={(time) => handleStopwatchStop(activity._id, time)} />
              )}
              <div className="relative w-full bg-gray-300 rounded-full h-6 mb-4 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bg-green-500 h-full text-xs text-white text-center leading-6"
                  style={{ width: `${calculateProgress(activity)}%` }}
                >
                  {calculateProgress(activity)}%
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-100">No activities found. Add activities to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ActivityProgress;
