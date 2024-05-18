// OrderCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <h3>Order ID: {order._id}</h3>
      <p>User ID: {order.userId}</p>
      <p>Product IDs:</p>
      <ul>
        {order.productIds.map((productId, index) => (
          <li key={index}>{productId}</li>
        ))}
      </ul>
      <p>Date Time: {order.datetime}</p>
      <p>Notes: {order.notes}</p>
      <p>Total: {order.total}</p>
      {/* Remove any <a> tags from here */}
    </div>
  );
};

export default OrderCard;
