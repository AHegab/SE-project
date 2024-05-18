// src/routes/ViewAllUsers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styleViewAllUsers.css'; // Make sure to create this CSS file

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/v1/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-all-users-container">
      <h2>Registered Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Address</th>
            <th>City</th>
            <th>Region</th>
            <th>Role</th>
            <th>Zip</th>
            <th>Date of Birth</th>
            <th>Mail</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.address}</td>
              <td>{user.city}</td>
              <td>{user.region}</td>
              <td>{user.role}</td>
              <td>{user.zip}</td>
              <td>{user.dob}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllUsers;
