import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './styleProfile.css'; // Import CSS file for styling
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  // State to hold user information retrieved from cookies
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Effect hook to retrieve user information from cookies when the component mounts
  useEffect(() => {
    // Retrieve the user information cookie
    const userCookie = Cookies.get('userInfo');

    // If the cookie exists, parse its value and set it to the state
    if (userCookie) {
      try {
        const parsedUserInfo = JSON.parse(userCookie);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []); 

  // Function to handle signout
  const handleSignOut = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);
    if (confirmed) {
      // Clear the cookies and navigate to login page
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('userInfo');
      setUserInfo(null);
      navigate('/Login');
    }
  };

  // Function to handle requesting admin status
  const handleRequestAdmin = async () => {
    if (userInfo) {
      try {
        const response = await axios.post('http://localhost:3001/v1/api/request-admin', {  // Updated endpoint
          username: userInfo.username,
          userId: userInfo.userId
        }, { withCredentials: true });
        alert(response.data.message);
      } catch (error) {
        console.error('Error requesting admin status:', error);
        alert('There was an error sending your request.');
      }
    }
  };

  return (
    <div className="centered-container">
      <h2>User Profile</h2>
      {userInfo ? (
        <div>
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Address:</strong> {userInfo.Address}</p>
          <p><strong>City:</strong> {userInfo.City}</p>
          <p><strong>Region:</strong> {userInfo.Region}</p>
          <p><strong>Role:</strong> {userInfo.role}</p>
          <p><strong>Zip:</strong> {userInfo.Zip}</p>
          <p><strong>Date of Birth:</strong> {userInfo.Dob}</p>
          {/* Conditionally render additional options if the user's role is 'Admin' */}
          {userInfo.role === 'Admin' && (
            <div>
              <Link to="/admin">Admin Panel</Link>
              {/* Add more links here as needed */}
            </div>
          )}
          {/* Render the request admin button for customers */}
          {userInfo.role === 'Customer' && (
            <button onClick={handleRequestAdmin}>Request Admin</button>
          )}
          <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
          {/* Confirmation modal for sign out */}
          {showConfirmation && (
            <div className="modal-overlay">
              <div className="confirmation-dialog">
                <p>Are you sure you want to sign out?</p>
                <button className="yes-button" onClick={() => handleConfirmation(true)}>Yes</button>
                <button className="no-button" onClick={() => handleConfirmation(false)}>No</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;