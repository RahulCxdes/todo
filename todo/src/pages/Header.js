import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';  // Import AuthContext
import './Header.css'; // Import the CSS file

const Header = () => {
  const { isLoggedIn, logout, username } = useContext(AuthContext);  // Access login state and logout function

  return (
    <header className="header-container">
      <div className="header-content">
        <h1 className="header-title">SelfBuild</h1>
        <nav className="header-nav">
          {isLoggedIn ? (
            <>
              <span className="header-welcome">Hi, {username}!</span>
              <Link to="/dashboard" className="header-link">Dashboard</Link>
              <Link to="/activities" className="header-link">Activities</Link>
              <Link to="/profile" className="header-link">Profile</Link>
              <Link to="/leader" className="header-link">Leaderboard</Link>
              <button className="header-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">Login</Link>
              <Link to="/register" className="header-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
