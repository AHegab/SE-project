import React from 'react';
import { Link } from 'react-router-dom';
import "./styleAdmins.css";
const Admins = () => {
  return (
    <div className="centered-container">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/AddProduct">Add Product</Link></li>
        {/* <li><Link to="/make-admin">Make Admin</Link></li>
        <li><Link to="/remove-user">Remove User</Link></li> */}
        <li><Link to="/FeedbackList">See Feedback</Link></li>
        <li><Link to="/edit-users">Edit Users</Link></li>
        <li><Link to="/ViewAllOrders">See All Orders</Link></li>
        <li><Link to="/edit-orders">Edit Orders</Link></li>
        <li><Link to="/update-products">Update Products</Link></li>
      </ul>
    </div>
  );
};

export default Admins;
