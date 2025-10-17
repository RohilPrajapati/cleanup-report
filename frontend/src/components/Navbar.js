import React, { useEffect, useState } from 'react';
import { logout_api_call } from '../pages/auth/api/call';
import { useNavigate } from 'react-router-dom';
import { logout } from '../helpers';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username,setUsername] = useState('User')
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData); // localStorage stores strings
        if (parsedUser.username) {
          setUsername(parsedUser.username);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear any stored tokens or user data
    // localStorage.removeItem('token');
    
    // Redirect to login or show confirmation
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout_api_call(localStorage.getItem("refresh_token")).then((res) => {
        logout()
        navigate('/login'); 
      })
      
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="brand-text">Dashboard</span>
        </div>

        {/* User Section */}
        <div className="navbar-user">
          <div className="user-info" onClick={toggleDropdown}>
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="username">{username}</span>
            <svg 
              className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`}
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item user-details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{username}</span>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;