import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

import './Header.css';

const Header = () => {
  const { isLoggedIn, logout, username } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && overlayRef.current) {
      if (
        !sidebarRef.current.contains(event.target) &&
        !overlayRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
        ref={sidebarRef}
      >
        <button className="sidebar-close" onClick={toggleSidebar}>
          ✕
        </button>
        <h1 className="sidebar-title">SelfBuilder</h1>
        <nav className="sidebar-nav">
          {isLoggedIn ? (
            <>
              <span className="sidebar-welcome">Welcome, {username}!</span>
              <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
              <Link to="/activities" className="sidebar-link">Activities</Link>
              <Link to="/profile" className="sidebar-link">Profile</Link>
              <Link to="/leader" className="sidebar-link">Leaderboard</Link>
              <Link to="/connect" className="sidebar-link">Connect</Link>
              <Link to="/bot" className="sidebar-link">bot</Link>
              {/* <Link to="/look" className="sidebar-link">Look</Link> Add Look link */}
              <button className="sidebar-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="sidebar-link">Login</Link>
              <Link to="/register" className="sidebar-link">Register</Link>
            </>
          )}
        </nav>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" ref={overlayRef}></div>}

      <header className="header">
        <h1 className="header-title">SelfBuilder</h1>
        <nav className="header-nav">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="header-link">Dashboard</Link>
              <Link to="/activities" className="header-link">Activities</Link>
              <Link to="/profile" className="header-link">Profile</Link>
              <Link to="/leader" className="header-link">Leaderboard</Link>
              <Link to="/connect" className="header-link">Connect</Link>
              <Link to="/bot" className="sidebar-link">bot</Link>
              {/* <Link to="/look" className="header-link">Look</Link> Add Look link */}
              <button className="header-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">Login</Link>
              <Link to="/register" className="header-link">Register</Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
