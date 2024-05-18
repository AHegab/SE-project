import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./styleHeader.css";

function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for the presence of a specific cookie (e.g., 'authToken')
        const authToken = Cookies.get('userInfo');
        setIsLoggedIn(!!authToken);
    }, []);

    return (
        <nav className="navbar navbar-expand px-3 border-bottom">
            <button className="btn" type="button" data-bs-theme="dark">
                <span className="navbar-toggler-icon"></span>
            </button>
            <ul>
                <li><Link to="/">Home</Link></li>
                {isLoggedIn ? (
                    <li><Link to="/UserProfile">Profile</Link></li>
                ) : (
                    <li><Link to="/Login">Login</Link></li>
                )}
                <li><Link to="/Product">View All Cars</Link></li>
                <li><Link to="/ContactUs">Contact Us</Link></li>

                {isLoggedIn ? (
                    <li><Link to="/PlaceOrderPage">Cart</Link></li>
                    
                ) : (
                    null
                )}
                {isLoggedIn ? (
                    <li><Link to="/PastOrders">Past orders</Link></li>
                    
                ) : (
                    null
                )}
                
            </ul>
        </nav>
    );
}

function Header() {
    return (
        <header style={{ textAlign: 'center', fontFamily: '911 Porscha' }}>
            <h1>Porsche</h1>
            <NavBar />
        </header>
    );
}

export default Header;
