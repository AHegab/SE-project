import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styleRegister.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/register', {
                username,
                password,
                address,
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
                <a id="porsche-text" href="/">Porsche</a>
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
                            <label htmlFor="inputDOB">Date of Birth</label>
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
