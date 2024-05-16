import React from 'react';
// import './NavBar.css'; // Import the CSS file
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="navbar navbar-expand px-3 border-bottom">
            <button className="btn" type="button" data-bs-theme="dark">
                <span className="navbar-toggler-icon"></span>
            </button>
        <ul>
            {/* <li><Link to="/profile">Your Profile</Link></li> */}
            <li><Link to="http://localhost:3000/">Home</Link></li>
            {/* <li><Link to="/cars">View All Cars</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/order">Orders</Link></li> */}
        </ul>
        </nav>
    );
}


function Header(){
        
    return(<header>
        <h1>Welcome to our Car Website</h1>
        <NavBar />
    </header>
)
}
export default Header;