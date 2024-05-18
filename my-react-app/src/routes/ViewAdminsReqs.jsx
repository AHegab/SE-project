import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UnauthorizedAccess from './UnauthorizedAccess';
import Cookies from 'js-cookie';
import './styleViewAdminsReqs.css'; // Import the CSS file

const ViewAdminsReqs = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    if (userInfo && userInfo.role !== "Admin") {
      setIsAuthorized(false);
    }

    const fetchCollection = async () => {
      try {
        const response = await axios.get('http://localhost:3001/v1/api/req');
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

  if (!isAuthorized) {
    return <UnauthorizedAccess />;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="view-admins-reqs">
      <h2>Collection Data</h2>
      <ul>
        {collectionData.map((item, index) => (
          <li key={index} className="collection-item">
            <p><strong>ID:</strong> {item._id ? item._id.$oid : 'N/A'}</p>
            <p><strong>Username:</strong> {item.username}</p>
            <p><strong>User ID:</strong> {item.userId}</p>
            <p><strong>Created At:</strong> {item.createdAt ? item.createdAt.$date : 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAdminsReqs;
