import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import './Header.css'; // Import the CSS file

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
      {/* Toggle button for mobile view */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
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
      
      {/* Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" ref={overlayRef}></div>}

      {/* Header */}
      <header className="header">
        <h1 className="header-title">SelfBuilder</h1>
        <nav className="header-nav">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="header-link">Dashboard</Link>
              <Link to="/activities" className="header-link">Activities</Link>
              <Link to="/profile" className="header-link">Profile</Link>
              <Link to="/leader" className="header-link">Leaderboard</Link>
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
