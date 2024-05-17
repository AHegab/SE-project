import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewAdminsReqs = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get('http://localhost:3001/v1/api/req'); // Replace with your API endpoint
        setCollectionData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collection:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Collection Data</h2>
      <ul>
        {collectionData.map((item, index) => (
          <li key={index}>
            <p><strong>ID:</strong> {item._id.$oid}</p>
            <p><strong>Username:</strong> {item.username}</p>
            <p><strong>User ID:</strong> {item.userId}</p>
            <p><strong>Created At:</strong> {item.createdAt.$date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAdminsReqs;
