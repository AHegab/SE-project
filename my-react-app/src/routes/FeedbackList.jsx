import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styleFeedbackList.css';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/v1/api/contactUs');
                setFeedbacks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="feedback-list-container">
            <h2>Feedbacks</h2>
            {feedbacks.length === 0 ? (
                <p>No feedbacks available.</p>
            ) : (
                feedbacks.map((feedback) => (
                    <div key={feedback._id} className="feedback-card">
                        <h3>{feedback.inquiryType}</h3>
                        <p><strong>Inquiry:</strong> {feedback.inquiry}</p>
                        <p><strong>Contact Method:</strong> {feedback.contactMethod}</p>
                        <p><strong>Name:</strong> {feedback.firstName} {feedback.lastName}</p>
                        <p><strong>Email:</strong> {feedback.email}</p>
                        <p><strong>Phone:</strong> {feedback.phoneNumber}</p>
                        <p><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default FeedbackList;
