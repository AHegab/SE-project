import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styleRegister.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [zip, setZip] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/register', {
                username,
                email,
                password,
                address,
                city,
                region,
                zip,
                dob
            });

            if (response.status === 201) {
                navigate('/login');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="register-page">
            <div className="overlay">
                <h1 id="register-text">Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="registerForm">
                        <div className="form-group">
                            <label htmlFor="inputUsername">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                id="inputUsername"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputEmail">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                id="inputEmail"
                                placeholder="johndoe@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                id="inputPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputAddress">Address</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                id="inputAddress"
                                placeholder="1234 Main St"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputCity">City</label>
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                id="inputCity"
                                placeholder="Cairo"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                            </div>
                            <div className="form-group">
                            <label htmlFor="inputRegion">Region</label>
                            <input
                                type="text"
                                className="form-control"
                                name="region"
                                id="inputRegion"
                                placeholder="MENA"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            />
                            </div>
                            <div className="form-group">
                            <label htmlFor="inputZip">Zip</label>
                            <input
                                type="text"
                                className="form-control"
                                name="zip"
                                id="inputZip"
                                placeholder="12345"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                            />
                            </div>
                        <div className="form-group">
                            <label htmlFor="inputDOB">Birthdate</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dob"
                                id="inputDOB"
                                placeholder="Date of Birth"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="btn btn-primary">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
