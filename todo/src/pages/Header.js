import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';  // Import AuthContext

const Header = () => {
  const { isLoggedIn, logout, username } = useContext(AuthContext);  // Access login state and logout function

  return (
    <header className="w-full bg-gray-800 text-white fixed top-0 left-0 z-50 shadow-md">
      <div className="flex justify-between items-center p-4 max-w-screen-xl mx-auto">
        <h1 className="text-xl">My App</h1>
        <nav className="space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-white">Welcome, {username}!</span>
              <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-700 rounded-md">Dashboard</Link>
              <Link to="/activities" className="px-4 py-2 hover:bg-gray-700 rounded-md">View Activities</Link>
              <Link to="/profile" className="px-4 py-2 hover:bg-gray-700 rounded-md">View Profile</Link>
              <Link to="/leader" className="px-4 py-2 hover:bg-gray-700 rounded-md">View leaderboard</Link>
              <button
                className="bg-red-500 px-4 py-2 rounded-md"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 hover:bg-gray-700 rounded-md">Login</Link>
              <Link to="/register" className="px-4 py-2 hover:bg-gray-700 rounded-md">Register</Link>
 
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
