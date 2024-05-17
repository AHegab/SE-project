import React from 'react';
import "./styleRegister.css";
// import { Helmet } from 'react-helmet';

function Register() {
    return (
        <div className="register-container">
            
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Register</title>
                {/* Bootstrap CSS */}
                {/* <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" /> */}
            
            <form id="registerForm" action="/register" method="post">
                <div className="form-group">
                    <label htmlFor="inputUsername">Username</label>
                    <input type="text" className="form-control" name="username" id="inputUsername" placeholder="Username" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" name="password" id="inputPassword" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputAddress">Address</label>
                    <input type="text" className="form-control" name="address" id="inputAddress" placeholder="1234 Main St" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputDOB">Date of Birth</label>
                    <input type="date" className="form-control" name="dob" id="inputDOB" placeholder="Date of Birth" />
                </div>
                <button type="submit" className="btn btn-primary">Sign up</button>
            </form>
        </div>
    );
}

export default Register;
