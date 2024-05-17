import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styleOrders.css'; // Import CSS file for styling

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/v1/api/Order');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders available</p>
        ) : (
          <ul>
            {orders.map((order, index) => (
              <li key={index} className="order-item">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>User ID:</strong> {order.userId}</p>
                <p><strong>Product IDs:</strong></p>
                <ul>
                  {order.productIds.map((productId, index) => (
                    <li key={index}>{productId}</li>
                  ))}
                </ul>
                <p><strong>Date Time:</strong> {order.datetime}</p>
                <p><strong>Notes:</strong> {order.notes}</p>
                <p><strong>Total:</strong> {order.total}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Orders;
