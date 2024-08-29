import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get('https://todo-8.onrender.com/api/leaderboard/all');
        setLeaderboardData(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Unable to fetch leaderboard data. Please try again later.');
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-300 p-8">
      <h1 className="text-4xl font-extrabold text-center text-yellow-800 mb-6">Leaderboard</h1>
      {error && <p className="text-red-600 text-center mb-6">{error}</p>}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Top Players</h2>
        {leaderboardData.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4 bg-gray-200 text-left text-gray-600 font-semibold">Rank</th>
                <th className="py-3 px-4 bg-gray-200 text-left text-gray-600 font-semibold">Username</th>
                <th className="py-3 px-4 bg-gray-200 text-left text-gray-600 font-semibold">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player, index) => (
                <tr key={player._id} className="border-t">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{player.username}</td>
                  <td className="py-3 px-4">{player.totalXP}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
