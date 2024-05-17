import React from 'react';
import { Link } from 'react-router-dom';
import "./styleHeader.css";

function NavBar() {
    return (
        <nav className="navbar navbar-expand px-3 border-bottom">
            <button className="btn" type="button" data-bs-theme="dark">
                <span className="navbar-toggler-icon"></span>
            </button>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Product">View All Cars</Link></li>
                <li><Link to="/ContactUs">Contact Us</Link></li>
            </ul>
        </nav>
    );
}

function Header() {
    return (
        <header style={{ textAlign: 'center', fontFamily: '911 Porscha'}}>
            <h1>Porsche</h1>
            <NavBar />
        </header>
    );
}

export default Header;
