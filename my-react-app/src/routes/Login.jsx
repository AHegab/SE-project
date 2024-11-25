import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styleLogin.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/login', {
                Username: username,
                
                InputPassword1: password
            },
            {
                withCredentials: true // Allow sending and receiving cookies
            });
            console.log(username);
            if (response.status === 200) {
                navigate('/');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="login-page">
        <div className="overlay">
            <h1 id="Login-text">Login</h1>
            <form onSubmit={handleLogin}>
            <div className="loginForm">
                <div className="form-group">
                <label htmlFor="Username">User name</label>
                <input
                    type="text"
                    name="Username"
                    id="Username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="InputPassword1">Password</label>
                <input
                    type="password"
                    className="form-control"
                    name="InputPassword1"
                    id="InputPassword1"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn btn-primary">Submit</button>
                <label className="form-check-label" htmlFor="exampleCheck1">Don't have an account?</label>
                <Link to="/register" className="btn btn-secondary">Register</Link>
            </div>
            </form>
        </div>
        </div>
    );
};

export default LoginPage;
