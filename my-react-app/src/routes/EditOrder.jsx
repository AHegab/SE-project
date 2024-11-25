import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UnauthorizedAccess from './UnauthorizedAccess';
import Cookies from 'js-cookie';
import './styleEditOrder.css'; // Import the CSS file

const EditOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
        if (userInfo && userInfo.role !== "Admin") {
          setIsAuthorized(false);
        }
        const response = await axios.get(`http://localhost:3001/v1/api/Order/${orderId}`);
        setOrder(response.data);
        setNotes(response.data.notes || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateNotes = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/v1/api/Order/${orderId}`, { notes });
      const response = await axios.get(`http://localhost:3001/v1/api/Order/${orderId}`);
      setOrder(response.data);
      alert('Notes updated successfully!');
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes');
    }
  };

  if (loading) {
    return <div className="center-container">Loading...</div>;
  }

  if (!order) {
    return <div className="center-container">Order not found</div>;
  }
  if (!isAuthorized) {
    return <UnauthorizedAccess />;
  }
  return (
    <div className="center-container">
      <div className="edit-order-container">
        <h2>Edit Order</h2>
        <h3>Order ID: {order._id}</h3>
        <p>User ID: {order.userId}</p>
        <form onSubmit={handleUpdateNotes}>
          <label>
            Notes:
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <button type="submit">Update Notes</button>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
