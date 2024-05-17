import React, { useState } from 'react';
import axios from 'axios';
import './styleContactUs.css';

const ContactUs = () => {
    const [inquiryType, setInquiryType] = useState('');
    const [inquiry, setInquiry] = useState('');
    const [contactMethod, setContactMethod] = useState('Email');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const feedbackData = {
            inquiryType,
            inquiry,
            contactMethod,
            firstName,
            lastName,
            email,
            phoneNumber,
        };

        try {
            const response = await axios.post('http://localhost:3001/v1/api/contactUs', feedbackData);
            setResponseMessage('Feedback submitted successfully');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setResponseMessage('Error submitting feedback');
        }
    };

    return (
        <>
            <div className="container" style={{ backgroundImage: "my-react-app/public/feedbackBackgrounImage.jpg" }}>
                <div className="form_container">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="inquiry_type">Inquiry Topic :</label>
                            <select className="form-control" value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}>
                                <option value="">Select An Option</option>
                                <option value="Models">Models</option>
                                <option value="Website">Website</option>
                                <option value="Stores">Stores</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inquiry">Inquiry : </label>
                            <textarea className="form-control" id="inquiry" rows="3" value={inquiry} onChange={(e) => setInquiry(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">How Would you like to be contacted? </label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="contact" id="email1" value="Email" checked={contactMethod === 'Email'} onChange={(e) => setContactMethod(e.target.value)} />
                                <label className="form-check-label" htmlFor="email1">
                                    By Email
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="contact" id="phone1" value="Phone" checked={contactMethod === 'Phone'} onChange={(e) => setContactMethod(e.target.value)} />
                                <label className="form-check-label" htmlFor="phone1">
                                    By Phone
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Full Name : </label>
                            <div className="row">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pwd">Phone Number:</label>
                            <input type="tel" className="form-control" id="pwd" placeholder="Enter your Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <button type="submit" className="submitButton">Submit</button>
                    </form>
                    {responseMessage && <p>{responseMessage}</p>}
                </div>
            </div>
        </>
    );
};

export default ContactUs;
