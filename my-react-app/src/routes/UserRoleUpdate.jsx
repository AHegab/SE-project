import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UnauthorizedAccess from './UnauthorizedAccess';
import "./styleUpdateUsers.css";
import Cookies from 'js-cookie';

const UserRoleUpdate = () => {
  const [userId, setUserId] = useState('');
  const [newRole, setNewRole] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    if (userInfo && userInfo.role !== "Admin") {
      setIsAuthorized(false);
    }
  }, []);

  const handleRoleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/v1/api/update-role/${userId}`, {
        role: newRole
      });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error updating user role. Please try again.');
      console.error('Error updating user role:', error);
    }
  };

  if (!isAuthorized) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="container">
      <div className="form">
        <h2>User Role Update</h2>
        <label htmlFor="userId">User ID:</label>
        <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <label htmlFor="newRole">New Role:</label>
        <select id="newRole" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </select>
        <button onClick={handleRoleUpdate}>Update Role</button>
        {successMessage && <p className="message">{successMessage}</p>}
        {errorMessage && <p className="message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default UserRoleUpdate;
