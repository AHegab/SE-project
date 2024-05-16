// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="h-100">
                <div className="sidebar-logo">
                    <Link to="/">Dashboard</Link>
                </div>
                <ul className="sidebar-nav">
                    <li className="sidebar-item">
                        <Link to="/" className="sidebar-link">
                            <i className="fa-solid fa-home pe-2"></i>
                            Home
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/login" className="sidebar-link">
                            <i className="fa-regular fa-user pe-2"></i>
                            Profile
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/contact" className="sidebar-link">
                            <i className="fa-regular fa-file-lines pe-2"></i>
                            Contact Us
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/about" className="sidebarink">
                            <i className="fa-solid fa-sliders pe-2"></i>
                            About Us
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
