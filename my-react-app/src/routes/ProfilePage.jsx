import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
        const response=null;
    useEffect(() => {
        const fetchUserData = async () => {
            // Extract user information from cookies
            const userInfoCookie = Cookies.get('info');
            
            console.log(userInfoCookie); // Assuming 'info' is the name of the cookie
            if (true) {
                const response = await axios.get(`http://localhost:3001/v1/api/users/66464a524350a81c6297f7ea`);
                try {
                    // Parse the user information from JSON string to JavaScript object
                    const user = JSON.parse(userInfoCookie);
                    // Fetch user data from the backend using the user ID
                    console.log(user._id);
                    
                    setUserInfo(response.data); // Update user info state with the fetched data
                } catch (error) {
                    console.error('Error fetching user information:', error);
                }
            }
        };

        fetchUserData(); // Call the async function immediately
    }, []);

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            {userInfo && (
                <div>
                    <p><strong>Username:</strong> {response.data.username}</p>
                    <p><strong>Address:</strong> {response.data.address}</p>
                    {/* Add more user data fields as needed */}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
