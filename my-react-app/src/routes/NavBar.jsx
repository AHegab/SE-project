import React from 'react';
import './NavBar.css'; // Import the CSS file

function NavBar() {
    return (
        <nav className="navbar navbar-expand px-3 border-bottom">
            <button className="btn" type="button" data-bs-theme="dark">
                <span className="navbar-toggler-icon"></span>
            </button>
        </nav>
    );
}

export default NavBar;
