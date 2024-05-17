import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UserProfile = () => {
  // State to hold user information retrieved from cookies
  const [userInfo, setUserInfo] = useState(null);

  // Effect hook to retrieve user information from cookies when the component mounts
  useEffect(() => {
    // Retrieve the user information cookie
    const userCookie = Cookies.get('userInfo');

    // Log the retrieved cookie value for debugging
    console.log("Retrieved cookie:", userCookie);

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

  // Log userInfo state for debugging
  console.log("UserInfo state:", userInfo);

  return (
    <div>
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
        </div>
      ) : (
        <p>...</p>
      )}
    </div>
  );
};

export default UserProfile;
