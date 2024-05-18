import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UnauthorizedAccess from './UnauthorizedAccess';
import Cookies from 'js-cookie';
const EditOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState(''); // Initialize with an empty string
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
        setNotes(response.data.notes || ''); // Ensure notes is always a string
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
      alert('Notes updated successfully!'); // Show success alert
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes'); // Show error alert
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }
  if (!isAuthorized) {
    return <UnauthorizedAccess />;
  }
  return (
    <div>
      <h2>Edit Order</h2>
      <h3>Order ID: {order._id}</h3>
      <p>User ID: {order.userId}</p>
      {/* Display other order details here */}
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
  );
};

export default EditOrder;
