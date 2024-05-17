import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
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
        // Log the parsed user info for debugging
        console.log("Parsed user info:", parsedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // Function to handle signout
  const handleSignOut = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);
    if (confirmed) {
      // Clear the 'userInfo' cookie
      Cookies.remove('userInfo');
      // Clear the user info from state
      setUserInfo(null);
      navigate('/Login');

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
          {showConfirmation && (
            <div className="modal-overlay">
              <div className="confirmation-dialog">
                <p>Are you sure you want to sign out?</p>
                <button className="yes-button" onClick={() => handleConfirmation(true)}>Yes</button>
                <button className="no-button" onClick={() => handleConfirmation(false)}>No</button>
              </div>
            </div>
          )}
          <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>...</p>
      )}
    </div>
  );
};

export default UserProfile;