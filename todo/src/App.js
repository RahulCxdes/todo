import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ActivityProgress from './pages/ActivityProgress';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Header from './pages/Header';
import Leaderboard from './pages/Leaderboard';
import Connect from './pages/Connect'; // Import the Connect page
// import ActivityInfo from './pages/ActivityInfo';
import ChatBot from './pages/ChatBot';

// Initialize AuthContext before anything else
export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [username, setUsername] = useState(''); // Track username

  const login = (name) => {
    setIsLoggedIn(true);
    setUsername(name); // Set username when login occurs
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUsername(''); // Clear username on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      <Router>
        <Header /> {/* Include Header component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<ActivityProgress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} /> {/* Dynamic profile route */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/leader" element={<Leaderboard />} />
          <Route path="/connect" element={<Connect />} /> {/* New Connect page */}
          {/* <Route path="/activity-info/:activityName" element={<ActivityInfo />} /> Activity info page */}
          <Route path="/bot" element={<ChatBot/>} /> Activity info page
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
