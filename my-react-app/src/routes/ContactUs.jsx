import React from 'react';
import './styleContactUs.css';

const ContactUs = () => {
    return (
        <>
            <div className="container" style={{ backgroundImage: "my-react-app/public/feedbackBackgrounImage.jpg" }}>
                <div className="form_container">
                    <form className="form-horizontal" action="index.html">
                        <div className="form-group">
                            <label htmlFor="inquiry_type">Inquiry Topic :</label>
                            <select className="form-control">
                                <option>Select An Option</option>
                                <option>Models</option>
                                <option>Website</option>
                                <option>Stores</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inquiry">Inquiry : </label>
                            <textarea className="form-control" id="inquiry" rows="3"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">How Would you like to be contacted? </label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="contact" id="email1" value="Email" checked />
                                <label className="form-check-label" htmlFor="email1">
                                    By Email
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="contact" id="phone1" value="Phone" />
                                <label className="form-check-label" htmlFor="phone1">
                                    By Phone
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Full Name : </label>
                            <form>
                                <div className="row">
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="First name" />
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="Last name" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pwd">Phone Number:</label>
                            <input type="tel" className="form-control" id="pwd" placeholder="Enter your Phone Number" />
                        </div>
                        <a href="index.html">
                            <button type="submit" className="submitButton">Submit</button>
                        </a>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ContactUs;
